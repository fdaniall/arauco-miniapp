"use client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FeatureDetailModal.module.css";

interface FeatureDetail {
  icon: string;
  title: string;
  description: string;
  details: string[];
  benefits: string[];
}

interface FeatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureDetail | null;
}

export function FeatureDetailModal({ isOpen, onClose, feature }: FeatureDetailModalProps) {
  if (!feature) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>

              {/* Icon */}
              <motion.div
                className={styles.iconWrapper}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className={styles.icon}>{feature.icon}</div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className={styles.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {feature.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                className={styles.description}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {feature.description}
              </motion.p>

              {/* Details Section */}
              <motion.div
                className={styles.section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className={styles.sectionTitle}>How It Works</h3>
                <ul className={styles.list}>
                  {feature.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      className={styles.listItem}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <span className={styles.bullet}>→</span>
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Benefits Section */}
              <motion.div
                className={styles.section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className={styles.sectionTitle}>Benefits</h3>
                <ul className={styles.list}>
                  {feature.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      className={styles.listItem}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <span className={styles.bullet}>✓</span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                className={styles.ctaButton}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Got It!
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Feature data
export const FEATURES_DATA: Record<string, FeatureDetail> = {
  start: {
    icon: "🌱",
    title: "Start Your Tree",
    description: "Begin your journey by minting your unique tree NFT on Base blockchain.",
    details: [
      "Connect your wallet to the Arauco miniapp",
      "Mint your first tree NFT (one-time setup)",
      "Your tree starts as a tiny seed waiting to grow",
      "Each tree is unique with its own growth history",
    ],
    benefits: [
      "Own a real NFT on Base blockchain",
      "Track your daily commitment on-chain",
      "Build a collection of digital trees",
      "Contribute to the virtual forest ecosystem",
    ],
  },
  water: {
    icon: "💧",
    title: "Water Daily",
    description: "Water your tree once per day to keep it healthy and growing.",
    details: [
      "Open the app and click 'Water Tree' button",
      "One water drop per day keeps your tree alive",
      "Miss a day and your tree stops growing",
      "Each watering is recorded on the blockchain",
    ],
    benefits: [
      "Build a daily habit with visual rewards",
      "Watch your tree grow with each water",
      "Earn streak bonuses for consistency",
      "Get extra water through social tasks",
    ],
  },
  grow: {
    icon: "📈",
    title: "Watch It Grow",
    description: "Your tree evolves through 5 beautiful stages as you water it consistently.",
    details: [
      "Stage 1: Seed (Day 0) - Your journey begins",
      "Stage 2: Sprout (Day 1-2) - First signs of life",
      "Stage 3: Young Tree (Day 3-6) - Growing strong",
      "Stage 4: Mature Tree (Day 7-13) - Full canopy",
      "Stage 5: Forest Tree (Day 14+) - Majestic giant",
    ],
    benefits: [
      "Visual representation of your commitment",
      "Dynamic NFT that changes with your progress",
      "Unlock rare tree variants at milestones",
      "Share your forest growth on social media",
    ],
  },
  rewards: {
    icon: "🎁",
    title: "Earn Rewards",
    description: "Complete tasks and hit milestones to unlock exclusive rewards and bonuses.",
    details: [
      "Recast Arauco posts to earn +1 extra water",
      "Refer friends to get +3 water per referral",
      "Hit 7-day streak for special Eco Badge NFT",
      "Reach 30 days to unlock rare tree variants",
    ],
    benefits: [
      "Collect exclusive NFT badges",
      "Unlock rare tree skins and variants",
      "Join seasonal campaigns for special rewards",
      "Top the leaderboard for community recognition",
    ],
  },
};
