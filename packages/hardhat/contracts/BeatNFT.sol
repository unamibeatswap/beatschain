// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BeatNFT is ERC721, ERC721URIStorage, IERC2981, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public platformFeePercentage = 1500; // 15%
    address public platformFeeRecipient;
    
    struct Beat {
        uint256 price;
        address producer;
        uint256 royaltyPercentage; // Basis points (e.g., 1000 = 10%)
        bool isForSale;
        string genre;
        uint256 bpm;
        string musicalKey;
    }
    
    mapping(uint256 => Beat) public beats;
    mapping(address => bool) public verifiedProducers;
    
    event BeatMinted(uint256 indexed tokenId, address indexed producer, uint256 price);
    event BeatSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed recipient, uint256 amount);
    
    constructor(address initialOwner, address _platformFeeRecipient) 
        ERC721("BeatNFT", "BEATNFT") 
        Ownable(initialOwner) 
    {
        platformFeeRecipient = _platformFeeRecipient;
    }
    
    function mintBeat(
        address to,
        string memory uri,
        uint256 price,
        uint256 royaltyPercentage,
        string memory genre,
        uint256 bpm,
        string memory musicalKey
    ) public returns (uint256) {
        require(royaltyPercentage <= 1000, "Royalty too high"); // Max 10%
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        beats[tokenId] = Beat({
            price: price,
            producer: to,
            royaltyPercentage: royaltyPercentage,
            isForSale: true,
            genre: genre,
            bpm: bpm,
            musicalKey: musicalKey
        });
        
        emit BeatMinted(tokenId, to, price);
        return tokenId;
    }
    
    function buyBeat(uint256 tokenId) public payable nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Beat does not exist");
        require(beats[tokenId].isForSale, "Beat not for sale");
        require(msg.value >= beats[tokenId].price, "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        uint256 price = beats[tokenId].price;
        
        // Calculate fees
        uint256 platformFee = (price * platformFeePercentage) / 10000;
        uint256 royaltyFee = 0;
        
        // Pay royalty if not original producer
        if (seller != beats[tokenId].producer) {
            royaltyFee = (price * beats[tokenId].royaltyPercentage) / 10000;
            if (royaltyFee > 0) {
                payable(beats[tokenId].producer).transfer(royaltyFee);
                emit RoyaltyPaid(tokenId, beats[tokenId].producer, royaltyFee);
            }
        }
        
        // Pay platform fee
        if (platformFee > 0) {
            payable(platformFeeRecipient).transfer(platformFee);
        }
        
        // Pay seller
        uint256 sellerAmount = price - platformFee - royaltyFee;
        payable(seller).transfer(sellerAmount);
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        beats[tokenId].isForSale = false;
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit BeatSold(tokenId, msg.sender, price);
    }
    
    function setBeatForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        beats[tokenId].price = price;
        beats[tokenId].isForSale = true;
    }
    
    function removeBeatFromSale(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        beats[tokenId].isForSale = false;
    }
    
    function verifyProducer(address producer) public onlyOwner {
        verifiedProducers[producer] = true;
    }
    
    function setPlatformFee(uint256 _platformFeePercentage) public onlyOwner {
        require(_platformFeePercentage <= 1500, "Fee too high"); // Max 15%
        platformFeePercentage = _platformFeePercentage;
    }
    
    function setPlatformFeeRecipient(address _platformFeeRecipient) public onlyOwner {
        platformFeeRecipient = _platformFeeRecipient;
    }
    
    // ERC2981 Royalty Standard
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_ownerOf(tokenId) != address(0), "Beat does not exist");
        
        receiver = beats[tokenId].producer;
        royaltyAmount = (salePrice * beats[tokenId].royaltyPercentage) / 10000;
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}