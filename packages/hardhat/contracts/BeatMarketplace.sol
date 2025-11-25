// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BeatNFT.sol";

/**
 * @title BeatMarketplace
 * @dev Marketplace for buying and selling beat NFTs
 */
contract BeatMarketplace is Ownable, ReentrancyGuard {
    // Fee percentage (in basis points, 100 = 1%)
    uint256 public platformFeePercentage = 250; // 2.5%
    
    // Mapping from beat ID to listing price
    mapping(uint256 => uint256) public beatListings;
    
    // BeatNFT contract reference
    BeatNFT public beatNFT;
    
    // Events
    event BeatListed(uint256 indexed beatId, address indexed seller, uint256 price);
    event BeatSold(uint256 indexed beatId, address indexed seller, address indexed buyer, uint256 price);
    event BeatListingCancelled(uint256 indexed beatId, address indexed seller);
    event PlatformFeeUpdated(uint256 newFeePercentage);
    
    /**
     * @dev Constructor
     * @param _beatNFT Address of the BeatNFT contract
     */
    constructor(address _beatNFT) Ownable(msg.sender) {
        beatNFT = BeatNFT(_beatNFT);
    }
    
    /**
     * @dev List a beat for sale
     * @param beatId ID of the beat to list
     * @param price Price in wei
     */
    function listBeat(uint256 beatId, uint256 price) external {
        require(beatNFT.ownerOf(beatId) == msg.sender, "Not the beat owner");
        require(price > 0, "Price must be greater than zero");
        require(beatNFT.getApproved(beatId) == address(this) || beatNFT.isApprovedForAll(msg.sender, address(this)), 
                "Marketplace not approved");
        
        beatListings[beatId] = price;
        
        emit BeatListed(beatId, msg.sender, price);
    }
    
    /**
     * @dev Buy a beat
     * @param beatId ID of the beat to buy
     */
    function buyBeat(uint256 beatId) external payable nonReentrant {
        uint256 price = beatListings[beatId];
        address seller = beatNFT.ownerOf(beatId);
        
        require(price > 0, "Beat not listed for sale");
        require(msg.value >= price, "Insufficient payment");
        
        // Remove listing
        delete beatListings[beatId];
        
        // Calculate platform fee
        uint256 platformFee = (price * platformFeePercentage) / 10000;
        uint256 sellerAmount = price - platformFee;
        
        // Transfer beat to buyer
        beatNFT.transferFrom(seller, msg.sender, beatId);
        
        // Transfer funds to seller
        (bool success, ) = payable(seller).call{value: sellerAmount}("");
        require(success, "Failed to send payment to seller");
        
        // Refund excess payment
        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Failed to refund excess payment");
        }
        
        emit BeatSold(beatId, seller, msg.sender, price);
    }
    
    /**
     * @dev Cancel a beat listing
     * @param beatId ID of the beat listing to cancel
     */
    function cancelListing(uint256 beatId) external {
        require(beatNFT.ownerOf(beatId) == msg.sender, "Not the beat owner");
        require(beatListings[beatId] > 0, "Beat not listed");
        
        delete beatListings[beatId];
        
        emit BeatListingCancelled(beatId, msg.sender);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param newFeePercentage New fee percentage in basis points
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee too high"); // Max 10%
        platformFeePercentage = newFeePercentage;
        
        emit PlatformFeeUpdated(newFeePercentage);
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
}