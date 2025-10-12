"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const [daysWatered, setDaysWatered] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [canWater, setCanWater] = useState(true);

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  const handleWaterTree = () => {
    // TODO: Implement watering logic with API call
    setDaysWatered((prev) => prev + 1);
    setCurrentStreak((prev) => prev + 1);
    setCanWater(false);

    // Reset after 24h (for demo, reset after 10s)
    setTimeout(() => setCanWater(true), 10000);
  };

  const getTreeStage = () => {
    if (daysWatered === 0) return "Seed";
    if (daysWatered < 3) return "Sprout";
    if (daysWatered < 7) return "Young Tree";
    if (daysWatered < 14) return "Mature Tree";
    return "Forest Tree";
  };

  return (
    <div className={styles.container}>
      {/* Header with Logo and Wallet */}
      <header className={styles.header}>
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
      </header>

      {/* Hero Section */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Arauco Forest
          </h1>
          <p className={styles.subtitle}>
            Water Your Tree Daily. Grow Your Forest.
          </p>
        </div>

        {/* Tree Visualization */}
        <div className={styles.treeSection}>
          <div className={styles.treeContainer}>
            <div className={styles.treeStageWrapper}>
              <div className={`${styles.treeVisual} ${styles[`stage${daysWatered}`]}`}>
                {/* Tree will be rendered here - placeholder for now */}
                <div className={styles.treePlaceholder}>
                  <span className={styles.treeEmoji}>
                    {daysWatered === 0 && "🌱"}
                    {daysWatered >= 1 && daysWatered < 3 && "🌿"}
                    {daysWatered >= 3 && daysWatered < 7 && "🌳"}
                    {daysWatered >= 7 && daysWatered < 14 && "🌲"}
                    {daysWatered >= 14 && "🌳🌲🌳"}
                  </span>
                </div>
                <div className={styles.treeStage}>{getTreeStage()}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{daysWatered}</div>
              <div className={styles.statLabel}>Days Watered</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{currentStreak}</div>
              <div className={styles.statLabel}>Current Streak</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Extra Water</div>
            </div>
          </div>

          {/* Water Button */}
          <button
            className={`${styles.waterButton} ${!canWater ? styles.disabled : ""}`}
            onClick={handleWaterTree}
            disabled={!canWater}
          >
            {canWater ? "💧 Water Tree" : "⏰ Come Back Tomorrow"}
          </button>
        </div>

        {/* How It Works */}
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌱</div>
              <h3>Start Your Tree</h3>
              <p>Mint your unique tree NFT and begin your growth journey on Base</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💧</div>
              <h3>Water Daily</h3>
              <p>Water once per day to keep your tree healthy and growing</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Watch It Grow</h3>
              <p>Your tree evolves through 5 stages from seed to forest tree</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎁</div>
              <h3>Earn Rewards</h3>
              <p>Complete tasks for extra water and unlock rare tree NFTs</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Grow Your Forest?</h2>
          <p className={styles.ctaText}>
            Join thousands growing their trees daily on Farcaster
          </p>
          <button className={styles.ctaButton}>
            Get Started
          </button>
        </div>
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
  );
}
