// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TreeNFT
 * @dev NFT contract for Arauco Forest gamification
 * Users mint a tree NFT and water it daily to grow through 5 stages
 */
contract TreeNFT is ERC721, Ownable {
    // ============ Structs ============

    struct Tree {
        uint256 waterCount;
        uint256 lastWateredDay;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 extraWater;
        uint256 stage;
        uint8 titleRank;
        bool exists;
    }

    // ============ State Variables ============

    uint256 private _nextTokenId;

    mapping(uint256 => Tree) public trees;
    mapping(address => uint256) public userToTreeId;
    mapping(address => bool) public hasTree;
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

        trees[tokenId] = Tree({
            waterCount: 0,
            lastWateredDay: type(uint256).max,
            currentStreak: 0,
            longestStreak: 0,
            extraWater: 0,
            stage: 0,
            titleRank: 0,
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

        if (tree.lastWateredDay == currentDay) revert AlreadyWateredToday();

        tree.waterCount++;

        if (tree.lastWateredDay == type(uint256).max) {
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

        tree.extraWater--;
        tree.waterCount++;

        if (tree.lastWateredDay == type(uint256).max) {
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

    /**
     * @dev Get title string based on rank
     */
    function getTitleString(uint8 rank) public pure returns (string memory) {
        if (rank == 0) return "Seedling Keeper";
        if (rank == 1) return "Novice Gardener";
        if (rank == 2) return "Expert Gardener";
        if (rank == 3) return "Master Gardener";
        if (rank == 4) return "Forest Guardian";
        return "Seedling Keeper";
    }

    /**
     * @dev Get stage name
     */
    function getStageName(uint256 stage) public pure returns (string memory) {
        if (stage == 0) return "Seed";
        if (stage == 1) return "Sprout";
        if (stage == 2) return "Young Tree";
        if (stage == 3) return "Mature Tree";
        if (stage == 4) return "Forest Tree";
        return "Seed";
    }

    /**
     * @dev Override tokenURI to return on-chain metadata with SVG
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        Tree memory tree = trees[tokenId];

        // Generate SVG based on stage
        string memory svg = _generateSVG(tree);

        // Build JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name": "Arauco Tree #', Strings.toString(tokenId), '",',
            '"description": "A tree NFT that grows as you water it daily. Part of the Arauco Forest on Base.",',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes": [',
                '{"trait_type": "Stage", "value": "', getStageName(tree.stage), '"},',
                '{"trait_type": "Title", "value": "', getTitleString(tree.titleRank), '"},',
                '{"trait_type": "Days Watered", "value": ', Strings.toString(tree.waterCount), '},',
                '{"trait_type": "Current Streak", "value": ', Strings.toString(tree.currentStreak), '},',
                '{"trait_type": "Longest Streak", "value": ', Strings.toString(tree.longestStreak), '},',
                '{"trait_type": "Extra Water", "value": ', Strings.toString(tree.extraWater), '}',
            ']}'
        ));

        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(bytes(json))));
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

        // Update title rank based on water count
        _updateTitleRank(tokenId);
    }

    /**
     * @dev Update title rank based on water count
     * 0: Seedling Keeper (0-6 days)
     * 1: Novice Gardener (7-29 days)
     * 2: Expert Gardener (30-99 days)
     * 3: Master Gardener (100-364 days)
     * 4: Forest Guardian (365+ days)
     */
    function _updateTitleRank(uint256 tokenId) internal {
        Tree storage tree = trees[tokenId];
        uint256 waterCount = tree.waterCount;

        uint8 newRank;
        if (waterCount >= 365) {
            newRank = 4;
        } else if (waterCount >= 100) {
            newRank = 3;
        } else if (waterCount >= 30) {
            newRank = 2;
        } else if (waterCount >= 7) {
            newRank = 1;
        } else {
            newRank = 0;
        }

        tree.titleRank = newRank;
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

    /**
     * @dev Generate SVG image based on tree stage
     */
    function _generateSVG(Tree memory tree) internal pure returns (string memory) {
        string memory treeEmoji;
        string memory bgColor;
        string memory titleEmoji;

        // Determine visuals based on stage
        if (tree.stage == 0) {
            treeEmoji = "&#127793;"; // 🌱
            bgColor = "#e8f5e9";
        } else if (tree.stage == 1) {
            treeEmoji = "&#127794;"; // 🌲
            bgColor = "#c8e6c9";
        } else if (tree.stage == 2) {
            treeEmoji = "&#127795;"; // 🌳
            bgColor = "#a5d6a7";
        } else if (tree.stage == 3) {
            treeEmoji = "&#127796;"; // 🌴
            bgColor = "#81c784";
        } else {
            treeEmoji = "&#127797;"; // 🌲🌳
            bgColor = "#66bb6a";
        }

        // Title emoji
        if (tree.titleRank == 0) titleEmoji = "&#127793;"; // 🌱
        else if (tree.titleRank == 1) titleEmoji = "&#127807;"; // 🌿
        else if (tree.titleRank == 2) titleEmoji = "&#127795;"; // 🌳
        else if (tree.titleRank == 3) titleEmoji = "&#127942;"; // 🏆
        else titleEmoji = "&#128081;"; // 👑

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">',
            '<defs>',
            '<linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">',
            '<stop offset="0%" style="stop-color:', bgColor, ';stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />',
            '</linearGradient>',
            '</defs>',
            '<rect width="400" height="400" fill="url(#bg)"/>',
            '<text x="200" y="150" font-size="120" text-anchor="middle">', treeEmoji, '</text>',
            '<text x="200" y="220" font-size="24" text-anchor="middle" fill="#2d6e55" font-weight="bold">',
            getTitleString(tree.titleRank), ' ', titleEmoji,
            '</text>',
            '<text x="200" y="260" font-size="18" text-anchor="middle" fill="#4a9d7f">',
            'Days: ', Strings.toString(tree.waterCount),
            '</text>',
            '<text x="200" y="290" font-size="18" text-anchor="middle" fill="#4a9d7f">',
            'Streak: ', Strings.toString(tree.currentStreak), ' &#128293;',
            '</text>',
            '<text x="200" y="340" font-size="14" text-anchor="middle" fill="#888">',
            'Arauco Forest',
            '</text>',
            '</svg>'
        ));
    }
}
