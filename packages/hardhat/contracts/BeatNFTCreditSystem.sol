// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BeatNFTCreditSystem is ERC721, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId = 1;
    
    // Credit packages
    struct CreditPackage {
        uint256 credits;
        uint256 price;
        bool active;
    }
    
    // Pro NFT details
    uint256 public constant PRO_NFT_PRICE = 0.1 ether;
    uint256 public constant PRO_NFT_TOKEN_ID = 0; // Special token ID for Pro NFT
    
    // User balances
    mapping(address => uint256) public creditBalances;
    mapping(address => bool) public hasProNFT;
    mapping(address => uint256) public totalCreditsUsed;
    
    // Credit packages
    mapping(uint256 => CreditPackage) public creditPackages;
    uint256 public packageCount;
    
    // Events
    event CreditsPurchased(address indexed user, uint256 credits, uint256 price);
    event CreditsUsed(address indexed user, uint256 credits, string purpose);
    event ProNFTUpgraded(address indexed user, uint256 price);
    event CreditPackageAdded(uint256 indexed packageId, uint256 credits, uint256 price);
    
    constructor(address initialOwner) ERC721("BeatNFT Credits", "BEATCRED") Ownable(initialOwner) {
        // Initialize default credit packages
        _addCreditPackage(10, 0.01 ether);   // 10 credits for 0.01 ETH
        _addCreditPackage(25, 0.02 ether);   // 25 credits for 0.02 ETH  
        _addCreditPackage(50, 0.035 ether);  // 50 credits for 0.035 ETH
        
        // Give new users 10 free credits
        creditBalances[msg.sender] = 10;
    }
    
    function purchaseCredits(uint256 packageId) external payable nonReentrant {
        require(packageId < packageCount, "Invalid package");
        CreditPackage memory package = creditPackages[packageId];
        require(package.active, "Package not active");
        require(msg.value >= package.price, "Insufficient payment");
        
        creditBalances[msg.sender] += package.credits;
        
        // Refund excess payment
        if (msg.value > package.price) {
            payable(msg.sender).transfer(msg.value - package.price);
        }
        
        emit CreditsPurchased(msg.sender, package.credits, package.price);
    }
    
    function upgradeToProNFT() external payable nonReentrant {
        require(!hasProNFT[msg.sender], "Already has Pro NFT");
        require(msg.value >= PRO_NFT_PRICE, "Insufficient payment");
        
        hasProNFT[msg.sender] = true;
        _safeMint(msg.sender, PRO_NFT_TOKEN_ID);
        
        // Refund excess payment
        if (msg.value > PRO_NFT_PRICE) {
            payable(msg.sender).transfer(msg.value - PRO_NFT_PRICE);
        }
        
        emit ProNFTUpgraded(msg.sender, PRO_NFT_PRICE);
    }
    
    function useCredits(address user, uint256 credits, string memory purpose) external {
        require(msg.sender == owner() || msg.sender == user, "Not authorized");
        require(hasProNFT[user] || creditBalances[user] >= credits, "Insufficient credits");
        
        if (!hasProNFT[user]) {
            creditBalances[user] -= credits;
            totalCreditsUsed[user] += credits;
        }
        
        emit CreditsUsed(user, credits, purpose);
    }
    
    function getCreditBalance(address user) external view returns (uint256) {
        if (hasProNFT[user]) {
            return type(uint256).max; // Unlimited
        }
        return creditBalances[user];
    }
    
    function canUpload(address user, uint256 requiredCredits) external view returns (bool) {
        return hasProNFT[user] || creditBalances[user] >= requiredCredits;
    }
    
    function _addCreditPackage(uint256 credits, uint256 price) internal {
        creditPackages[packageCount] = CreditPackage({
            credits: credits,
            price: price,
            active: true
        });
        emit CreditPackageAdded(packageCount, credits, price);
        packageCount++;
    }
    
    function addCreditPackage(uint256 credits, uint256 price) external onlyOwner {
        _addCreditPackage(credits, price);
    }
    
    function togglePackage(uint256 packageId) external onlyOwner {
        require(packageId < packageCount, "Invalid package");
        creditPackages[packageId].active = !creditPackages[packageId].active;
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Give free credits to new users (only owner)
    function grantFreeCredits(address user, uint256 credits) external onlyOwner {
        creditBalances[user] += credits;
        emit CreditsPurchased(user, credits, 0);
    }
}