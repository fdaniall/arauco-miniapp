"use client";
import { motion } from "framer-motion";
import InfoTooltip from "./InfoTooltip";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
  tooltip?: string;
}

export function StatsCard({ value, label, icon, gradient, delay = 0, tooltip }: StatsCardProps) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      style={{
        background: `linear-gradient(135deg, ${gradient})`,
      }}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <motion.div
        className={styles.value}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
      >
        {value}
      </motion.div>
      <div className={styles.label}>
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>

      {/* Glow effect */}
      <div className={styles.glow} style={{ background: gradient }} />
    </motion.div>
  );
}

export function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.icon}>
      <motion.path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        fill="currentColor"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.icon}>
      <motion.path
        d="M12 2C8 6 6 10 6 13c0 3.31 2.69 6 6 6s6-2.69 6-6c0-3-2-7-6-11z"
        fill="currentColor"
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

export function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.icon}>
      <motion.path
        d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"
        fill="currentColor"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.path
        d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"
        fill="currentColor"
        animate={{
          rotate: [0, -360],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}
