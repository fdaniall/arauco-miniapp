"use client";
import { motion } from "framer-motion";
import styles from "./TreeVisual.module.css";

interface TreeVisualProps {
  stage: number; // 0-4 (Seed, Sprout, Young, Mature, Forest)
  isWatering?: boolean;
}

export function TreeVisual({ stage, isWatering }: TreeVisualProps) {
  const trees = [
    // Stage 0: Seed
    <svg viewBox="0 0 200 200" className={styles.treeSvg} key="seed">
      <motion.circle
        cx="100"
        cy="160"
        r="15"
        fill="#8B4513"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      />
      <motion.ellipse
        cx="100"
        cy="155"
        rx="8"
        ry="4"
        fill="#a8e6cf"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
    </svg>,

    // Stage 1: Sprout
    <svg viewBox="0 0 200 200" className={styles.treeSvg} key="sprout">
      <motion.line
        x1="100"
        y1="170"
        x2="100"
        y2="140"
        stroke="#6B8E23"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.ellipse
        cx="90"
        cy="135"
        rx="12"
        ry="6"
        fill="#7CB342"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
      <motion.ellipse
        cx="110"
        cy="135"
        rx="12"
        ry="6"
        fill="#7CB342"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </svg>,

    // Stage 2: Young Tree
    <svg viewBox="0 0 200 200" className={styles.treeSvg} key="young">
      <motion.rect
        x="95"
        y="140"
        width="10"
        height="40"
        fill="#8B4513"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.circle
        cx="100"
        cy="120"
        r="35"
        fill="#4CAF50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
      />
      <motion.circle
        cx="80"
        cy="130"
        r="25"
        fill="#66BB6A"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.circle
        cx="120"
        cy="130"
        r="25"
        fill="#66BB6A"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </svg>,

    // Stage 3: Mature Tree
    <svg viewBox="0 0 200 200" className={styles.treeSvg} key="mature">
      <motion.rect
        x="92"
        y="120"
        width="16"
        height="60"
        fill="#654321"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.circle
        cx="100"
        cy="90"
        r="50"
        fill="#2E7D32"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
      />
      <motion.circle
        cx="70"
        cy="105"
        r="35"
        fill="#388E3C"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
      <motion.circle
        cx="130"
        cy="105"
        r="35"
        fill="#388E3C"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
      <motion.circle
        cx="100"
        cy="110"
        r="40"
        fill="#43A047"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
    </svg>,

    // Stage 4: Forest Tree
    <svg viewBox="0 0 200 200" className={styles.treeSvg} key="forest">
      <motion.rect
        x="90"
        y="100"
        width="20"
        height="80"
        fill="#5D4037"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "bottom" }}
      />
      <motion.circle
        cx="100"
        cy="70"
        r="60"
        fill="#1B5E20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
      />
      <motion.circle
        cx="60"
        cy="90"
        r="45"
        fill="#2E7D32"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      />
      <motion.circle
        cx="140"
        cy="90"
        r="45"
        fill="#2E7D32"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      />
      <motion.circle
        cx="100"
        cy="95"
        r="50"
        fill="#388E3C"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      />
      {/* Stars for max level */}
      {[...Array(3)].map((_, i) => (
        <motion.circle
          key={i}
          cx={80 + i * 20}
          cy={30}
          r="4"
          fill="#FFD700"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </svg>,
  ];

  return (
    <div className={styles.treeContainer}>
      <motion.div
        className={styles.treeWrapper}
        animate={isWatering ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {trees[stage]}
      </motion.div>

      {/* Water Drops Animation */}
      {isWatering && (
        <div className={styles.waterDrops}>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.waterDrop}
              initial={{
                x: Math.random() * 120 - 60, // Centered around tree (120px spread, -60 to +60)
                y: -20,
                opacity: 1,
              }}
              animate={{
                y: 200,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 1 + 1,
                delay: i * 0.1,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
