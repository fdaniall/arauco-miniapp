// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/TreeNFT.sol";

contract TreeNFTTest is Test {
    TreeNFT public treeNFT;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        treeNFT = new TreeNFT();
    }

    // ============ Mint Tests ============

    function testMintTree() public {
        vm.prank(user1);
        treeNFT.mintTree();

        assertTrue(treeNFT.hasTree(user1));
        assertEq(treeNFT.userToTreeId(user1), 0);
        assertEq(treeNFT.ownerOf(0), user1);
    }

    function testCannotMintTwice() public {
        vm.startPrank(user1);
        treeNFT.mintTree();

        vm.expectRevert(TreeNFT.AlreadyHasTree.selector);
        treeNFT.mintTree();
        vm.stopPrank();
    }

    function testMultipleUsersMint() public {
        vm.prank(user1);
        treeNFT.mintTree();

        vm.prank(user2);
        treeNFT.mintTree();

        assertEq(treeNFT.totalSupply(), 2);
        assertTrue(treeNFT.hasTree(user1));
        assertTrue(treeNFT.hasTree(user2));
    }

    // ============ Watering Tests ============

    function testWaterTree() public {
        vm.prank(user1);
        treeNFT.mintTree();

        vm.prank(user1);
        treeNFT.waterTree();

        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.waterCount, 1);
        assertEq(tree.currentStreak, 1);
        assertEq(tree.stage, 1); // Should be stage 1 after 1 water
    }

    function testCannotWaterWithoutTree() public {
        vm.prank(user1);
        vm.expectRevert(TreeNFT.NoTreeOwned.selector);
        treeNFT.waterTree();
    }

    function testCannotWaterTwiceInOneDay() public {
        vm.prank(user1);
        treeNFT.mintTree();

        vm.startPrank(user1);
        treeNFT.waterTree();

        vm.expectRevert(TreeNFT.AlreadyWateredToday.selector);
        treeNFT.waterTree();
        vm.stopPrank();
    }

    function testWaterNextDay() public {
        vm.prank(user1);
        treeNFT.mintTree();

        vm.prank(user1);
        treeNFT.waterTree();

        // Skip to next day
        vm.warp(block.timestamp + 1 days);

        vm.prank(user1);
        treeNFT.waterTree();

        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.waterCount, 2);
        assertEq(tree.currentStreak, 2);
    }

    // ============ Streak Tests ============

    function testStreakContinues() public {
        vm.prank(user1);
        treeNFT.mintTree();

        // Water for 5 consecutive days
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(user1);
            treeNFT.waterTree();
            vm.warp(block.timestamp + 1 days);
        }

        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.currentStreak, 5);
        assertEq(tree.longestStreak, 5);
    }

    function testStreakBreaks() public {
        vm.prank(user1);
        treeNFT.mintTree();

        // Water for 3 days
        for (uint256 i = 0; i < 3; i++) {
            vm.prank(user1);
            treeNFT.waterTree();
            vm.warp(block.timestamp + 1 days);
        }

        // Skip a day (break streak)
        vm.warp(block.timestamp + 1 days);

        // Water again
        vm.prank(user1);
        treeNFT.waterTree();

        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.currentStreak, 1); // Streak reset
        assertEq(tree.longestStreak, 3); // Longest streak preserved
    }

    // ============ Growth Stage Tests ============

    function testStageProgression() public {
        vm.prank(user1);
        treeNFT.mintTree();

        // Stage 0 (Seed) - 0 waters
        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.stage, 0);

        // Stage 1 (Sprout) - 1 water
        vm.prank(user1);
        treeNFT.waterTree();
        tree = treeNFT.getTreeData(user1);
        assertEq(tree.stage, 1);

        // Stage 2 (Young) - 3 waters
        for (uint256 i = 0; i < 2; i++) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(user1);
            treeNFT.waterTree();
        }
        tree = treeNFT.getTreeData(user1);
        assertEq(tree.stage, 2);

        // Stage 3 (Mature) - 7 waters
        for (uint256 i = 0; i < 4; i++) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(user1);
            treeNFT.waterTree();
        }
        tree = treeNFT.getTreeData(user1);
        assertEq(tree.stage, 3);

        // Stage 4 (Forest) - 14 waters
        for (uint256 i = 0; i < 7; i++) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(user1);
            treeNFT.waterTree();
        }
        tree = treeNFT.getTreeData(user1);
        assertEq(tree.stage, 4);
    }

    // ============ Extra Water Tests ============

    function testAddExtraWater() public {
        vm.prank(user1);
        treeNFT.mintTree();

        // Owner adds extra water
        treeNFT.addExtraWater(user1, 3, "recast");

        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.extraWater, 3);
    }

    function testUseExtraWater() public {
        vm.prank(user1);
        treeNFT.mintTree();

        // Add extra water
        treeNFT.addExtraWater(user1, 2, "referral");

        // Use extra water
        vm.prank(user1);
        treeNFT.useExtraWater();

        TreeNFT.Tree memory tree = treeNFT.getTreeData(user1);
        assertEq(tree.extraWater, 1);
        assertEq(tree.waterCount, 1);
    }

    function testCannotUseExtraWaterIfAlreadyWatered() public {
        vm.prank(user1);
        treeNFT.mintTree();

        treeNFT.addExtraWater(user1, 1, "test");

        vm.startPrank(user1);
        treeNFT.waterTree();

        vm.expectRevert("Already watered today");
        treeNFT.useExtraWater();
        vm.stopPrank();
    }

    // ============ View Function Tests ============

    function testCanWaterToday() public {
        vm.prank(user1);
        treeNFT.mintTree();

        assertTrue(treeNFT.canWaterToday(user1));

        vm.prank(user1);
        treeNFT.waterTree();

        assertFalse(treeNFT.canWaterToday(user1));

        // Next day
        vm.warp(block.timestamp + 1 days);
        assertTrue(treeNFT.canWaterToday(user1));
    }

    function testGetStage() public {
        vm.prank(user1);
        treeNFT.mintTree();

        uint256 tokenId = treeNFT.userToTreeId(user1);
        assertEq(treeNFT.getStage(tokenId), 0);

        vm.prank(user1);
        treeNFT.waterTree();

        assertEq(treeNFT.getStage(tokenId), 1);
    }

    // ============ Transfer Tests ============

    function testTransferUpdatesMapping() public {
        vm.prank(user1);
        treeNFT.mintTree();

        uint256 tokenId = treeNFT.userToTreeId(user1);

        // Transfer to user2
        vm.prank(user1);
        treeNFT.transferFrom(user1, user2, tokenId);

        // Check mappings updated
        assertFalse(treeNFT.hasTree(user1));
        assertTrue(treeNFT.hasTree(user2));
        assertEq(treeNFT.userToTreeId(user2), tokenId);
    }
}
