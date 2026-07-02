// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RunePass
/// @notice This contract issues the RUNE Pass: a Soulbound Token (SBT) that
///         proves membership in the RUNE intelligence terminal network.
///         A RunePass cannot be transferred, sold, or traded once minted.
///         It permanently belongs to the wallet that minted it.
///
///         Mint rules:
///         - The first 100 passes are FREE, first come first served.
///         - After the first 100, each pass costs 0.001 ETH.
///         - Each wallet may hold exactly one RunePass.
contract RunePass is ERC721, Ownable {
    /// @notice Number of passes available for free minting.
    uint256 public constant FREE_SUPPLY = 100;

    /// @notice Maximum number of passes that can ever be minted.
    uint256 public constant MAX_SUPPLY = 10000;

    /// @notice Price in wei for minting after the free supply runs out.
    uint256 public constant MINT_PRICE = 1000000000000000; // 0.001 ETH

    /// @notice Total number of passes minted so far.
    uint256 public totalSupply;

    /// @notice Whether minting is currently allowed.
    bool public mintOpen;

    /// @notice Maps a wallet address to the tokenId of its RunePass (0 = none).
    mapping(address => uint256) public passOf;

    /// @notice Maps a tokenId to the timestamp it was minted at.
    mapping(uint256 => uint256) public mintedAt;

    /// @notice Emitted whenever a new RunePass is minted.
    event PassMinted(address indexed to, uint256 indexed tokenId, bool wasFree);

    /// @notice Emitted when the contract owner withdraws collected ETH.
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address initialOwner) ERC721("RUNE Pass", "RUNEPASS") Ownable(initialOwner) {
        mintOpen = true;
    }

    /// @notice Mint a new RunePass to the caller's wallet.
    function mint() external payable {
        require(mintOpen, "Minting is currently closed");
        require(totalSupply < MAX_SUPPLY, "All passes have been minted");
        require(passOf[msg.sender] == 0, "This wallet already holds a RunePass");

        bool isFreeMint = totalSupply < FREE_SUPPLY;

        if (!isFreeMint) {
            require(msg.value >= MINT_PRICE, "Insufficient ETH sent for mint");
        }

        totalSupply = totalSupply + 1;
        uint256 newTokenId = totalSupply;

        passOf[msg.sender] = newTokenId;
        mintedAt[newTokenId] = block.timestamp;

        _safeMint(msg.sender, newTokenId);

        if (!isFreeMint && msg.value > MINT_PRICE) {
            uint256 refund = msg.value - MINT_PRICE;
            payable(msg.sender).transfer(refund);
        }

        emit PassMinted(msg.sender, newTokenId, isFreeMint);
    }

    /// @notice Check whether a wallet currently holds a RunePass.
    function hasPass(address wallet) external view returns (bool) {
        return passOf[wallet] != 0;
    }

    /// @notice Number of free mint slots remaining.
    function remainingFree() external view returns (uint256) {
        if (totalSupply >= FREE_SUPPLY) {
            return 0;
        }
        return FREE_SUPPLY - totalSupply;
    }

    /// @notice Builds the on-chain metadata and image for a given pass.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(mintedAt[tokenId] != 0, "Token does not exist");

        bool isGenesis = tokenId <= FREE_SUPPLY;
        string memory tier = isGenesis ? "Genesis" : "Standard";
        string memory idText = _toString(tokenId);

        bytes memory svg = abi.encodePacked(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 560'>",
            "<rect width='400' height='560' fill='%230a0a0a'/>",
            "<text x='200' y='220' font-family='monospace' font-size='64' font-weight='900' fill='%23ffffff' text-anchor='middle' letter-spacing='-2'>RUNE</text>",
            "<text x='200' y='250' font-family='monospace' font-size='12' fill='%23666666' text-anchor='middle' letter-spacing='6'>PASS</text>",
            "<text x='40' y='340' font-family='monospace' font-size='10' fill='%23444444'>PASS ID</text>",
            "<text x='40' y='365' font-family='monospace' font-size='22' font-weight='700' fill='%23ffffff'>#", idText, "</text>",
            "<text x='40' y='400' font-family='monospace' font-size='10' fill='%23444444'>TIER</text>",
            "<text x='40' y='420' font-family='monospace' font-size='14' font-weight='700' fill='%23cccccc'>", tier, "</text>",
            "<text x='40' y='520' font-family='monospace' font-size='9' fill='%23333333'>SOULBOUND - NON TRANSFERABLE</text>",
            "</svg>"
        );

        bytes memory json = abi.encodePacked(
            "data:application/json,",
            "%7B%22name%22%3A%22RUNE%20Pass%20%23", idText, "%22%2C",
            "%22description%22%3A%22Soulbound%20membership%20pass%20for%20the%20RUNE%20intelligence%20terminal.%22%2C",
            "%22attributes%22%3A%5B%7B%22trait_type%22%3A%22Tier%22%2C%22value%22%3A%22", tier, "%22%7D%5D%2C",
            "%22image%22%3A%22data%3Aimage%2Fsvg%2Bxml%2C", string(svg), "%22%7D"
        );

        return string(json);
    }

    /// @dev Minimal uint to string conversion, avoids extra library imports.
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /// @notice Soulbound enforcement: passes cannot be transferred between wallets.
    function transferFrom(address, address, uint256) public pure override(ERC721) {
        revert("RunePass is soulbound and cannot be transferred");
    }

    /// @notice Soulbound enforcement: passes cannot be transferred between wallets.
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721) {
        revert("RunePass is soulbound and cannot be transferred");
    }

    /// @notice Owner can pause or resume minting.
    function setMintOpen(bool isOpen) external onlyOwner {
        mintOpen = isOpen;
    }

    /// @notice Owner can withdraw ETH collected from paid mints.
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawn(owner(), balance);
    }
}
