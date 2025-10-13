"use client";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import styles from "./CelebrationModal.module.css";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: string;
  message: string;
}

export function CelebrationModal({
  isOpen,
  onClose,
  milestone,
  message,
}: CelebrationModalProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Lock both html and body scroll
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      // Save original values
      const originalHtmlOverflow = htmlElement.style.overflow;
      const originalBodyOverflow = bodyElement.style.overflow;
      const originalBodyPosition = bodyElement.style.position;
      const originalBodyWidth = bodyElement.style.width;

      // Lock scroll completely
      htmlElement.style.overflow = "hidden";
      bodyElement.style.overflow = "hidden";
      bodyElement.style.position = "fixed";
      bodyElement.style.width = "100%";

      // Cleanup function
      return () => {
        htmlElement.style.overflow = originalHtmlOverflow;
        bodyElement.style.overflow = originalBodyOverflow;
        bodyElement.style.position = originalBodyPosition;
        bodyElement.style.width = originalBodyWidth;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.3}
            colors={["#4a9d7f", "#a8e6cf", "#2d6e55", "#7CB342", "#FFD700"]}
          />

          {/* Modal Overlay */}
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
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Star burst effect */}
              <div className={styles.starburst}>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={styles.starLine}
                    style={{ rotate: `${i * 45}deg` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                  />
                ))}
              </div>

              {/* Trophy Icon */}
              <motion.div
                className={styles.trophy}
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                🏆
              </motion.div>

              {/* Milestone Badge */}
              <motion.div
                className={styles.milestone}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {milestone}
              </motion.div>

              {/* Message */}
              <motion.h2
                className={styles.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Congratulations! 🎉
              </motion.h2>

              <motion.p
                className={styles.message}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {message}
              </motion.p>

              {/* Close Button */}
              <motion.button
                className={styles.button}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Growing 🌳
              </motion.button>

              {/* Floating sparkles */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className={styles.sparkle}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
