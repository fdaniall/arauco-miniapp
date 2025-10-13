// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TreeNFT
 * @dev NFT contract for Arauco Forest gamification
 * Users mint a tree NFT and water it daily to grow through 5 stages
 */
contract TreeNFT is ERC721, Ownable {
    // ============ Structs ============

    struct Tree {
        uint256 waterCount;        // Total times watered
        uint256 lastWateredDay;    // Last day watered (in days since epoch)
        uint256 currentStreak;     // Current consecutive days streak
        uint256 longestStreak;     // Longest streak achieved
        uint256 extraWater;        // Bonus water from tasks
        uint256 stage;             // Growth stage (0-4)
        bool exists;               // Track if tree exists
    }

    // ============ State Variables ============

    uint256 private _nextTokenId;

    mapping(uint256 => Tree) public trees;
    mapping(address => uint256) public userToTreeId;
    mapping(address => bool) public hasTree;

    // Growth stage thresholds (days watered needed for each stage)
    uint256[5] public stageThresholds = [0, 1, 3, 7, 14];

    // ============ Events ============

    event TreeMinted(address indexed owner, uint256 indexed tokenId);
    event TreeWatered(uint256 indexed tokenId, uint256 newWaterCount, uint256 currentStreak);
    event StageUpgraded(uint256 indexed tokenId, uint256 newStage);
    event ExtraWaterAdded(uint256 indexed tokenId, uint256 amount, string reason);

    // ============ Errors ============

    error AlreadyHasTree();
    error NoTreeOwned();
    error AlreadyWateredToday();
    error InvalidTokenId();

    // ============ Constructor ============

    constructor() ERC721("Arauco Tree", "TREE") Ownable(msg.sender) {}

    // ============ Public Functions ============

    /**
     * @dev Mint a new tree NFT (one per address)
     */
    function mintTree() external {
        if (hasTree[msg.sender]) revert AlreadyHasTree();

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Initialize tree data
        // Set lastWateredDay to max uint to allow immediate first watering
        trees[tokenId] = Tree({
            waterCount: 0,
            lastWateredDay: type(uint256).max,
            currentStreak: 0,
            longestStreak: 0,
            extraWater: 0,
            stage: 0,
            exists: true
        });

        userToTreeId[msg.sender] = tokenId;
        hasTree[msg.sender] = true;

        emit TreeMinted(msg.sender, tokenId);
    }

    /**
     * @dev Water your tree (once per day)
     */
    function waterTree() external {
        if (!hasTree[msg.sender]) revert NoTreeOwned();

        uint256 tokenId = userToTreeId[msg.sender];
        Tree storage tree = trees[tokenId];

        uint256 currentDay = block.timestamp / 1 days;

        // Check if already watered today
        if (tree.lastWateredDay == currentDay) revert AlreadyWateredToday();

        // Update water count
        tree.waterCount++;

        // Update streak
        if (tree.lastWateredDay == type(uint256).max) {
            // First watering
            tree.currentStreak = 1;
        } else if (tree.lastWateredDay == currentDay - 1) {
            // Consecutive day
            tree.currentStreak++;
        } else {
            // Streak broken
            tree.currentStreak = 1;
        }

        // Update longest streak
        if (tree.currentStreak > tree.longestStreak) {
            tree.longestStreak = tree.currentStreak;
        }

        tree.lastWateredDay = currentDay;

        // Check for stage upgrade
        _checkStageUpgrade(tokenId);

        emit TreeWatered(tokenId, tree.waterCount, tree.currentStreak);
    }

    /**
     * @dev Add extra water from completing social tasks (recast, referral, etc)
     */
    function addExtraWater(address user, uint256 amount, string calldata reason) external onlyOwner {
        if (!hasTree[user]) revert NoTreeOwned();

        uint256 tokenId = userToTreeId[user];
        trees[tokenId].extraWater += amount;

        emit ExtraWaterAdded(tokenId, amount, reason);
    }

    /**
     * @dev Use extra water to water tree (consumes extra water)
     */
    function useExtraWater() external {
        if (!hasTree[msg.sender]) revert NoTreeOwned();

        uint256 tokenId = userToTreeId[msg.sender];
        Tree storage tree = trees[tokenId];

        require(tree.extraWater > 0, "No extra water available");

        uint256 currentDay = block.timestamp / 1 days;
        require(tree.lastWateredDay != currentDay, "Already watered today");

        // Consume 1 extra water
        tree.extraWater--;
        tree.waterCount++;

        // Update streak
        if (tree.lastWateredDay == type(uint256).max) {
            // First watering
            tree.currentStreak = 1;
        } else if (tree.lastWateredDay == currentDay - 1) {
            tree.currentStreak++;
        } else {
            tree.currentStreak = 1;
        }

        if (tree.currentStreak > tree.longestStreak) {
            tree.longestStreak = tree.currentStreak;
        }

        tree.lastWateredDay = currentDay;

        // Check for stage upgrade
        _checkStageUpgrade(tokenId);

        emit TreeWatered(tokenId, tree.waterCount, tree.currentStreak);
    }

    // ============ View Functions ============

    /**
     * @dev Get tree data for a user
     */
    function getTreeData(address user) external view returns (Tree memory) {
        if (!hasTree[user]) revert NoTreeOwned();
        return trees[userToTreeId[user]];
    }

    /**
     * @dev Get tree stage based on water count
     */
    function getStage(uint256 tokenId) public view returns (uint256) {
        if (!trees[tokenId].exists) revert InvalidTokenId();
        return trees[tokenId].stage;
    }

    /**
     * @dev Check if user can water today
     */
    function canWaterToday(address user) external view returns (bool) {
        if (!hasTree[user]) return false;

        uint256 tokenId = userToTreeId[user];
        Tree memory tree = trees[tokenId];
        uint256 currentDay = block.timestamp / 1 days;

        return tree.lastWateredDay != currentDay;
    }

    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // ============ Internal Functions ============

    /**
     * @dev Check and upgrade tree stage if threshold met
     */
    function _checkStageUpgrade(uint256 tokenId) internal {
        Tree storage tree = trees[tokenId];
        uint256 waterCount = tree.waterCount;

        // Determine new stage based on water count
        uint256 newStage = 0;
        for (uint256 i = stageThresholds.length - 1; i >= 0; i--) {
            if (waterCount >= stageThresholds[i]) {
                newStage = i;
                break;
            }
        }

        // Upgrade if new stage is higher
        if (newStage > tree.stage) {
            tree.stage = newStage;
            emit StageUpgraded(tokenId, newStage);
        }
    }

    /**
     * @dev Override transfer to update hasTree mapping
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        // Update hasTree and userToTreeId mappings
        if (from != address(0)) {
            hasTree[from] = false;
            delete userToTreeId[from];
        }

        if (to != address(0)) {
            hasTree[to] = true;
            userToTreeId[to] = tokenId;
        }

        return from;
    }
}
