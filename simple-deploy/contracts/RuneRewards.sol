// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RuneRewards
/// @notice This contract holds the RUNE community allocation and distributes
///         it to active users of the RUNE intelligence terminal.
///
///         There are two ways tokens leave this contract:
///         1. The owner (the RUNE backend) calls reward() or rewardBatch()
///            after verifying off-chain activity, such as an accurate
///            forecast or a useful signal contribution.
///         2. Any wallet holding a RunePass can call claimPassAirdrop()
///            once, to receive a one-time welcome airdrop.
contract RuneRewards is Ownable {
    /// @notice The RUNE token this contract distributes.
    IERC20 public immutable runeToken;

    /// @notice Address of the deployed RunePass contract, used to verify
    ///         airdrop eligibility.
    address public runePassContract;

    /// @notice Amount of RUNE granted to each RunePass holder, once.
    uint256 public constant PASS_AIRDROP_AMOUNT = 500000000000000000000; // 500 * 1e18

    /// @notice Total RUNE earned by each wallet through this contract.
    mapping(address => uint256) public totalEarned;

    /// @notice Whether a wallet has already claimed its RunePass airdrop.
    mapping(address => bool) public airdropClaimed;

    /// @notice Emitted whenever RUNE is sent out as a reward.
    event RewardSent(address indexed to, uint256 amount, string reason);

    /// @notice Emitted when a wallet claims its one-time RunePass airdrop.
    event AirdropClaimed(address indexed to, uint256 amount);

    /// @param tokenAddress Address of the deployed RuneToken contract.
    /// @param initialOwner Wallet allowed to trigger rewards (the RUNE backend).
    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        runeToken = IERC20(tokenAddress);
    }

    /// @notice Links this contract to the deployed RunePass contract.
    /// @dev Must be called once after both contracts are deployed.
    function setRunePassContract(address runePassAddress) external onlyOwner {
        runePassContract = runePassAddress;
    }

    /// @notice Sends a reward to a single wallet for verified activity.
    /// @param to Wallet receiving the reward.
    /// @param amount Amount of RUNE to send.
    /// @param reason Short human readable reason, stored in the event log.
    function reward(address to, uint256 amount, string calldata reason) external onlyOwner {
        require(runeToken.balanceOf(address(this)) >= amount, "Reward pool is too low");

        totalEarned[to] = totalEarned[to] + amount;
        runeToken.transfer(to, amount);

        emit RewardSent(to, amount, reason);
    }

    /// @notice Sends rewards to many wallets in a single transaction.
    /// @param recipients List of wallets to reward.
    /// @param amounts Matching list of amounts, same length as recipients.
    /// @param reason Short human readable reason applied to every reward.
    function rewardBatch(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string calldata reason
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Recipients and amounts must match");

        uint256 count = recipients.length;
        for (uint256 i = 0; i < count; i++) {
            totalEarned[recipients[i]] = totalEarned[recipients[i]] + amounts[i];
            runeToken.transfer(recipients[i], amounts[i]);
            emit RewardSent(recipients[i], amounts[i], reason);
        }
    }

    /// @notice Lets a RunePass holder claim a one-time welcome airdrop.
    function claimPassAirdrop() external {
        require(runePassContract != address(0), "RunePass contract not set yet");
        require(!airdropClaimed[msg.sender], "Airdrop already claimed");

        bool ownsPass = _walletHasPass(msg.sender);
        require(ownsPass, "Wallet does not hold a RunePass");

        airdropClaimed[msg.sender] = true;
        totalEarned[msg.sender] = totalEarned[msg.sender] + PASS_AIRDROP_AMOUNT;
        runeToken.transfer(msg.sender, PASS_AIRDROP_AMOUNT);

        emit AirdropClaimed(msg.sender, PASS_AIRDROP_AMOUNT);
    }

    /// @dev Reads hasPass(wallet) from the RunePass contract without
    ///      importing its full interface, keeping this contract simple.
    function _walletHasPass(address wallet) internal view returns (bool) {
        (bool success, bytes memory data) = runePassContract.staticcall(
            abi.encodeWithSignature("hasPass(address)", wallet)
        );
        require(success, "Could not reach RunePass contract");
        return abi.decode(data, (bool));
    }

    /// @notice Returns how much RUNE remains in the reward pool.
    function remainingPool() external view returns (uint256) {
        return runeToken.balanceOf(address(this));
    }
}
