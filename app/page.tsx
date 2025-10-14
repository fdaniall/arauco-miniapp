"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { TreeVisual } from "./components/TreeVisual";
import { StatsCard, DropletIcon, FlameIcon, SparklesIcon } from "./components/StatsCard";
import { CelebrationModal } from "./components/CelebrationModal";
import { FeatureDetailModal, FEATURES_DATA } from "./components/FeatureDetailModal";
import TitleBadge from "./components/TitleBadge";
import TitleProgress from "./components/TitleProgress";
import NFTInfoCard from "./components/NFTInfoCard";
import { useTreeNFT } from "./hooks/useTreeNFT";
import { useAccount } from "wagmi";
import styles from "./page.module.css";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const { isConnected } = useAccount();
  const {
    hasTree,
    treeData,
    canWaterToday,
    mintTree,
    waterTree,
    isPending,
    isConfirming,
    isSuccess,
    error,
    refetchAll,
    tokenURI,
  } = useTreeNFT();

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ milestone: "", message: "" });
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Track if we've already handled this success
  const isHandlingSuccessRef = useRef(false);
  // Track which milestones we've already celebrated
  const celebratedMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  useEffect(() => {
    if (isSuccess && !isHandlingSuccessRef.current) {
      // Prevent duplicate handling
      isHandlingSuccessRef.current = true;

      toast.dismiss("mint");
      toast.dismiss("water");

      const handleSuccess = async () => {
        toast.success("✨ Transaction confirmed!", {
          duration: 2000,
          style: {
            background: "#2d6e55",
            color: "#fff",
          },
        });

        // Wait for blockchain to update
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Refetch data
        await refetchAll();

        // Wait a bit more for state to update
        await new Promise(resolve => setTimeout(resolve, 500));
      };

      handleSuccess();
    }

    // Reset flag when isSuccess becomes false
    if (!isSuccess) {
      isHandlingSuccessRef.current = false;
    }
  }, [isSuccess, refetchAll]);

  // Separate effect for checking milestones
  useEffect(() => {
    if (!treeData || !isSuccess) return;

    const waterCount = treeData.waterCount;

    // Skip if we've already celebrated this milestone
    if (celebratedMilestonesRef.current.has(waterCount)) {
      return;
    }

    // Check for milestones
    let shouldCelebrate = false;

    if (waterCount === 1) {
      setCelebrationData({
        milestone: "First Watering! 💧",
        message: "Great start! Your tree journey begins. Water daily to watch it grow!",
      });
      shouldCelebrate = true;
    } else if (waterCount === 3) {
      setCelebrationData({
        milestone: "Sprout Unlocked!",
        message: "Your dedication is showing! Your tree is starting to sprout.",
      });
      shouldCelebrate = true;
    } else if (waterCount === 7) {
      setCelebrationData({
        milestone: "One Week Streak! 🔥",
        message: "Amazing! You've watered for 7 days straight. Your tree is growing strong!",
      });
      shouldCelebrate = true;
    } else if (waterCount === 14) {
      setCelebrationData({
        milestone: "Mature Tree Achievement! 🌳",
        message: "Two weeks of consistent care! Your tree has matured beautifully.",
      });
      shouldCelebrate = true;
    } else if (waterCount === 30) {
      setCelebrationData({
        milestone: "Forest Guardian! 🏆",
        message: "30 days! You're a true forest guardian. Rare NFT unlocked!",
      });
      shouldCelebrate = true;
    }

    if (shouldCelebrate) {
      celebratedMilestonesRef.current.add(waterCount);
      setShowCelebration(true);
    }
  }, [treeData?.waterCount, isSuccess]);

  useEffect(() => {
    if (error) {
      toast.dismiss("mint");
      toast.dismiss("water");
      toast.error(error.message || "Transaction failed. Please try again.", {
        duration: 3000,
      });
    }
  }, [error]);

  const handleMintTree = () => {
    toast.loading("Registering to campaign...", { id: "mint" });
    mintTree();
  };

  const handleWaterTree = () => {
    if (!canWaterToday) {
      toast.error("Come back tomorrow to water!", { duration: 2000 });
      return;
    }

    toast.loading("💧 Sending transaction...", { id: "water" });
    waterTree();
  };

  const getTreeStage = () => {
    const stage = treeData?.stage || 0;
    const stages = ["Seed", "Sprout", "Young Tree", "Mature Tree", "Forest Tree"];
    return stages[stage] || "Seed";
  };

  const getTreeStageIndex = () => {
    return treeData?.stage || 0;
  };

  const daysWatered = treeData?.waterCount || 0;
  const currentStreak = treeData?.currentStreak || 0;
  const extraWater = treeData?.extraWater || 0;
  const canWater = canWaterToday && !isPending && !isConfirming;
  const isWatering = isPending || isConfirming;

  const handleFeatureClick = (featureKey: string) => {
    setSelectedFeature(featureKey);
    setShowFeatureModal(true);
  };

  const scrollToTree = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <AnimatedBackground />
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        milestone={celebrationData.milestone}
        message={celebrationData.message}
      />
      <FeatureDetailModal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        feature={selectedFeature ? FEATURES_DATA[selectedFeature] : null}
      />

      <div className={styles.container}>
        {/* Header with Logo and Wallet */}
        <motion.header
          className={styles.header}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.logoContainer}>
            <Image
              src="/logo-arauco.png"
              alt="Arauco"
              width={50}
              height={50}
              className={styles.logo}
            />
          </div>
          <Wallet />
        </motion.header>

        {/* Hero Section */}
        <main className={styles.main}>
          <motion.div
            className={styles.hero}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className={styles.title}>Arauco Forest</h1>
            <p className={styles.subtitle}>Water Your Tree Daily. Grow Your Forest.</p>
          </motion.div>

          {/* Tree Visualization */}
          <motion.div
            className={styles.treeSection}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Title Badge */}
            {hasTree && treeData && (
              <TitleBadge titleRank={treeData.titleRank} waterCount={daysWatered} />
            )}

            <div className={styles.treeContainer}>
              <div className={styles.treeStageWrapper}>
                <TreeVisual stage={getTreeStageIndex()} isWatering={isWatering} />
                <motion.div
                  className={styles.treeStage}
                  key={getTreeStage()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {getTreeStage()}
                </motion.div>
              </div>
            </div>

            {/* Title Progress */}
            {hasTree && treeData && (
              <TitleProgress titleRank={treeData.titleRank} waterCount={daysWatered} />
            )}

            {/* Stats */}
            <div className={styles.stats}>
              <StatsCard
                value={daysWatered}
                label="Days Watered"
                icon={<DropletIcon />}
                gradient="rgba(74, 157, 127, 0.2) 0%, rgba(45, 110, 85, 0.2) 100%"
                delay={0.5}
              />
              <StatsCard
                value={currentStreak}
                label="Current Streak"
                icon={<FlameIcon />}
                gradient="rgba(255, 152, 0, 0.2) 0%, rgba(255, 87, 34, 0.2) 100%"
                delay={0.6}
              />
              <StatsCard
                value={extraWater}
                label="Extra Water"
                icon={<SparklesIcon />}
                gradient="rgba(100, 181, 246, 0.2) 0%, rgba(30, 136, 229, 0.2) 100%"
                delay={0.7}
              />
            </div>

            {/* NFT Info Card */}
            {hasTree && treeData && (
              <NFTInfoCard
                stage={getTreeStageIndex()}
                titleRank={treeData.titleRank}
                waterCount={daysWatered}
                currentStreak={currentStreak}
                contractAddress={process.env.NEXT_PUBLIC_TREE_NFT_ADDRESS || ""}
                tokenURI={tokenURI}
              />
            )}

            {!isConnected ? (
              <motion.div
                className={styles.connectPrompt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p>Connect your wallet to start growing your tree</p>
              </motion.div>
            ) : !hasTree ? (
              <motion.button
                className={styles.waterButton}
                onClick={handleMintTree}
                disabled={isPending || isConfirming}
                whileHover={!isPending && !isConfirming ? { scale: 1.05 } : {}}
                whileTap={!isPending && !isConfirming ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {isPending || isConfirming ? "🌱 Registering..." : "🌱 Start Growing"}
              </motion.button>
            ) : (
              <motion.button
                className={`${styles.waterButton} ${!canWater ? styles.disabled : ""}`}
                onClick={handleWaterTree}
                disabled={!canWater || isWatering}
                whileHover={canWater && !isWatering ? { scale: 1.05 } : {}}
                whileTap={canWater && !isWatering ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {isWatering
                  ? "💧 Watering..."
                  : canWater
                  ? "💧 Water Tree"
                  : "⏰ Come Back Tomorrow"}
              </motion.button>
            )}
          </motion.div>

          {/* How It Works */}
          <motion.div
            className={styles.infoSection}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.features}>
              {[
                {
                  key: "start",
                  icon: "🌱",
                  title: "Start Your Tree",
                  desc: "Mint your unique tree NFT and begin your growth journey on Base",
                },
                {
                  key: "water",
                  icon: "💧",
                  title: "Water Daily",
                  desc: "Water once per day to keep your tree healthy and growing",
                },
                {
                  key: "grow",
                  icon: "📈",
                  title: "Watch It Grow",
                  desc: "Your tree evolves through 5 stages from seed to forest tree",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className={styles.featureCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => handleFeatureClick(feature.key)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                  <div className={styles.learnMore}>Learn More →</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className={styles.ctaSection}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.ctaTitle}>Ready to Grow Your Forest?</h2>
            <p className={styles.ctaText}>
              Join thousands growing their trees daily on Farcaster
            </p>
            <motion.button
              className={styles.ctaButton}
              onClick={scrollToTree}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Built on Base with OnchainKit</p>
          <div className={styles.footerLinks}>
            <a href="https://docs.base.org" target="_blank" rel="noreferrer">
              Docs
            </a>
            <span>•</span>
            <a href="https://warpcast.com" target="_blank" rel="noreferrer">
              Farcaster
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
