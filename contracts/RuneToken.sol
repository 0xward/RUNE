// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RuneToken
/// @notice RUNE is the utility and governance token of the RUNE intelligence
///         terminal. It is used to reward accurate forecasts and active
///         signal contributions, and to vote on platform direction.
///
///         Total supply: 100,000,000 RUNE, minted once at deployment.
///
///         Allocation:
///         - 20,000,000 RUNE to the founder wallet, released gradually
///           over 1 year with a 6 month cliff (see claimVested).
///         - 40,000,000 RUNE to the community wallet, used to reward
///           active users of the RUNE terminal.
///         - 25,000,000 RUNE to the ecosystem wallet, used for grants
///           and long term development.
///         - 15,000,000 RUNE reserved for future liquidity, held in this
///           contract until the owner unlocks it (see unlockLiquidity).
contract RuneToken is ERC20, Ownable {
    /// @notice Total token supply, minted once in the constructor.
    uint256 public constant TOTAL_SUPPLY = 100000000000000000000000000; // 100,000,000 * 1e18

    /// @notice Portion of supply allocated to the founder, vested over time.
    uint256 public constant FOUNDER_ALLOCATION = 20000000000000000000000000; // 20,000,000 * 1e18

    /// @notice Portion of supply allocated to community rewards.
    uint256 public constant COMMUNITY_ALLOCATION = 40000000000000000000000000; // 40,000,000 * 1e18

    /// @notice Portion of supply allocated to ecosystem grants and development.
    uint256 public constant ECOSYSTEM_ALLOCATION = 25000000000000000000000000; // 25,000,000 * 1e18

    /// @notice Portion of supply reserved for future liquidity, locked until unlocked.
    uint256 public constant LIQUIDITY_ALLOCATION = 15000000000000000000000000; // 15,000,000 * 1e18

    /// @notice Length of the founder cliff: no tokens vest before this time has passed.
    uint256 public constant VESTING_CLIFF = 180 days;

    /// @notice Total length of the founder vesting schedule.
    uint256 public constant VESTING_DURATION = 365 days;

    /// @notice Wallet that will receive vested founder tokens.
    address public founderWallet;

    /// @notice Timestamp when vesting started (deployment time).
    uint256 public vestingStart;

    /// @notice Amount of founder tokens already claimed.
    uint256 public founderClaimed;

    /// @notice Wallet that will receive the liquidity allocation once unlocked.
    address public liquidityWallet;

    /// @notice Whether the liquidity allocation has been released yet.
    bool public liquidityUnlocked;

    /// @notice Emitted whenever the founder claims a portion of vested tokens.
    event FounderClaimed(uint256 amount);

    /// @notice Emitted when the liquidity allocation is released.
    event LiquidityUnlocked(address indexed to, uint256 amount);

    /// @param founder Wallet that owns this contract and receives vested founder tokens.
    /// @param community Wallet that immediately receives the community allocation.
    /// @param ecosystem Wallet that immediately receives the ecosystem allocation.
    /// @param liquidity Wallet that will later receive the liquidity allocation.
    constructor(
        address founder,
        address community,
        address ecosystem,
        address liquidity
    ) ERC20("RUNE", "RUNE") Ownable(founder) {
        founderWallet = founder;
        liquidityWallet = liquidity;
        vestingStart = block.timestamp;

        // Founder and liquidity allocations are minted to this contract
        // and released gradually through claimVested / unlockLiquidity.
        _mint(address(this), FOUNDER_ALLOCATION);
        _mint(address(this), LIQUIDITY_ALLOCATION);

        // Community and ecosystem allocations are minted directly to
        // their target wallets, which distribute them onward.
        _mint(community, COMMUNITY_ALLOCATION);
        _mint(ecosystem, ECOSYSTEM_ALLOCATION);
    }

    /// @notice Calculates how much of the founder allocation has vested so far.
    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < vestingStart + VESTING_CLIFF) {
            return 0;
        }

        uint256 elapsed = block.timestamp - vestingStart;

        if (elapsed >= VESTING_DURATION) {
            return FOUNDER_ALLOCATION;
        }

        return (FOUNDER_ALLOCATION * elapsed) / VESTING_DURATION;
    }

    /// @notice Lets the founder claim any newly vested tokens.
    function claimVested() external {
        require(msg.sender == founderWallet, "Only the founder wallet can claim");

        uint256 totalVested = vestedAmount();
        uint256 claimable = totalVested - founderClaimed;

        require(claimable > 0, "Nothing is currently claimable");

        founderClaimed = founderClaimed + claimable;
        _transfer(address(this), founderWallet, claimable);

        emit FounderClaimed(claimable);
    }

    /// @notice Releases the liquidity allocation to the liquidity wallet.
    /// @dev Can only be called once. Intended to be triggered when the
    ///      project is ready to provide liquidity on a DEX.
    function unlockLiquidity() external onlyOwner {
        require(!liquidityUnlocked, "Liquidity has already been unlocked");

        liquidityUnlocked = true;
        _transfer(address(this), liquidityWallet, LIQUIDITY_ALLOCATION);

        emit LiquidityUnlocked(liquidityWallet, LIQUIDITY_ALLOCATION);
    }
}
