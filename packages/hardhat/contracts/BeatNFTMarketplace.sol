// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract BeatNFTMarketplace is ReentrancyGuard, Ownable {
    uint256 public constant PLATFORM_FEE = 1500; // 15%
    uint256 public constant BASIS_POINTS = 10000;
    
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 timestamp;
    }
    
    struct RoyaltyStream {
        uint256 tokenId;
        address owner;
        uint256 sharePercentage; // basis points
        uint256 price;
        bool isForSale;
    }
    
    IERC721 public beatNFTContract;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => RoyaltyStream[]) public royaltyStreams;
    uint256[] public activeListings;
    
    event BeatNFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event BeatNFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event RoyaltyStreamCreated(uint256 indexed tokenId, address indexed owner, uint256 sharePercentage);
    
    constructor(address _beatNFTContract, address initialOwner) Ownable(initialOwner) {
        beatNFTContract = IERC721(_beatNFTContract);
    }
    
    function listBeatNFT(uint256 _tokenId, uint256 _price) external {
        require(beatNFTContract.ownerOf(_tokenId) == msg.sender, "Not owner");
        require(_price > 0, "Price must be > 0");
        
        listings[_tokenId] = Listing({
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price,
            isActive: true,
            timestamp: block.timestamp
        });
        
        activeListings.push(_tokenId);
        emit BeatNFTListed(_tokenId, msg.sender, _price);
    }
    
    function buyBeatNFT(uint256 _tokenId) external payable nonReentrant {
        Listing storage listing = listings[_tokenId];
        require(listing.isActive, "Not for sale");
        require(msg.value == listing.price, "Incorrect price");
        
        listing.isActive = false;
        
        // Calculate fees
        uint256 platformFee = (msg.value * PLATFORM_FEE) / BASIS_POINTS;
        uint256 sellerAmount = msg.value - platformFee;
        
        // Transfer payments
        payable(owner()).transfer(platformFee);
        payable(listing.seller).transfer(sellerAmount);
        
        // Transfer NFT
        beatNFTContract.transferFrom(listing.seller, msg.sender, _tokenId);
        
        emit BeatNFTSold(_tokenId, msg.sender, msg.value);
    }
    
    function createRoyaltyStream(uint256 _tokenId, uint256 _sharePercentage, uint256 _price) external {
        require(beatNFTContract.ownerOf(_tokenId) == msg.sender, "Not owner");
        require(_sharePercentage <= 5000, "Max 50% share");
        
        royaltyStreams[_tokenId].push(RoyaltyStream({
            tokenId: _tokenId,
            owner: msg.sender,
            sharePercentage: _sharePercentage,
            price: _price,
            isForSale: true
        }));
        
        emit RoyaltyStreamCreated(_tokenId, msg.sender, _sharePercentage);
    }
    
    function getActiveListings() external view returns (uint256[] memory) {
        return activeListings;
    }
}