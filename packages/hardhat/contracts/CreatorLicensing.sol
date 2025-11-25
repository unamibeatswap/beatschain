// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorLicensing is ReentrancyGuard, Ownable {
    uint256 public constant PLATFORM_FEE = 1500; // 15%
    uint256 public constant BASIS_POINTS = 10000;
    
    struct Negotiation {
        uint256 beatNftId;
        address creator;
        address producer;
        uint256 proposedPrice;
        uint256 creatorRoyaltyShare; // basis points
        string message;
        bool isAccepted;
        bool isPaid;
        uint256 timestamp;
    }
    
    mapping(uint256 => Negotiation) public negotiations;
    mapping(address => uint256[]) public creatorNegotiations;
    mapping(address => uint256[]) public producerNegotiations;
    uint256 public negotiationCounter;
    
    event NegotiationCreated(
        uint256 indexed negotiationId,
        uint256 indexed beatNftId,
        address indexed creator,
        address producer,
        uint256 proposedPrice,
        uint256 creatorRoyaltyShare
    );
    
    event NegotiationAccepted(uint256 indexed negotiationId);
    event LicensePaid(uint256 indexed negotiationId, uint256 amount);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    function createNegotiation(
        uint256 _beatNftId,
        address _producer,
        uint256 _proposedPrice,
        uint256 _creatorRoyaltyShare,
        string memory _message
    ) external {
        require(_creatorRoyaltyShare <= 4500, "Max 45% creator royalty");
        require(_proposedPrice > 0, "Price must be > 0");
        
        uint256 negotiationId = negotiationCounter++;
        
        negotiations[negotiationId] = Negotiation({
            beatNftId: _beatNftId,
            creator: msg.sender,
            producer: _producer,
            proposedPrice: _proposedPrice,
            creatorRoyaltyShare: _creatorRoyaltyShare,
            message: _message,
            isAccepted: false,
            isPaid: false,
            timestamp: block.timestamp
        });
        
        creatorNegotiations[msg.sender].push(negotiationId);
        producerNegotiations[_producer].push(negotiationId);
        
        emit NegotiationCreated(
            negotiationId,
            _beatNftId,
            msg.sender,
            _producer,
            _proposedPrice,
            _creatorRoyaltyShare
        );
    }
    
    function acceptNegotiation(uint256 _negotiationId) external {
        Negotiation storage negotiation = negotiations[_negotiationId];
        require(negotiation.producer == msg.sender, "Only producer can accept");
        require(!negotiation.isAccepted, "Already accepted");
        
        negotiation.isAccepted = true;
        emit NegotiationAccepted(_negotiationId);
    }
    
    function payLicense(uint256 _negotiationId) external payable nonReentrant {
        Negotiation storage negotiation = negotiations[_negotiationId];
        require(negotiation.creator == msg.sender, "Only creator can pay");
        require(negotiation.isAccepted, "Not accepted yet");
        require(!negotiation.isPaid, "Already paid");
        require(msg.value == negotiation.proposedPrice, "Incorrect amount");
        
        negotiation.isPaid = true;
        
        // Calculate splits
        uint256 platformFee = (msg.value * PLATFORM_FEE) / BASIS_POINTS;
        uint256 creatorRoyalty = (msg.value * negotiation.creatorRoyaltyShare) / BASIS_POINTS;
        uint256 producerShare = msg.value - platformFee - creatorRoyalty;
        
        // Transfer payments
        payable(owner()).transfer(platformFee);
        payable(negotiation.producer).transfer(producerShare);
        // Creator royalty stays in contract for future claims
        
        emit LicensePaid(_negotiationId, msg.value);
    }
    
    function getCreatorNegotiations(address _creator) external view returns (uint256[] memory) {
        return creatorNegotiations[_creator];
    }
    
    function getProducerNegotiations(address _producer) external view returns (uint256[] memory) {
        return producerNegotiations[_producer];
    }
}