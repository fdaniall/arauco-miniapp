"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./MetadataModal.module.css";

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenURI: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export default function MetadataModal({ isOpen, onClose, tokenURI }: MetadataModalProps) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tokenURI) {
      setLoading(true);
      setError(null);

      try {
        // Check if it's a data URI
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Data = tokenURI.split(",")[1];
          const jsonString = atob(base64Data);
          const data = JSON.parse(jsonString);
          setMetadata(data);
          setLoading(false);
        } else {
          // If it's a regular URL, fetch it
          fetch(tokenURI)
            .then((res) => res.json())
            .then((data) => {
              setMetadata(data);
              setLoading(false);
            })
            .catch(() => {
              setError("Failed to load metadata");
              setLoading(false);
            });
        }
      } catch {
        setError("Failed to parse metadata");
        setLoading(false);
      }
    }
  }, [isOpen, tokenURI]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Loading NFT Metadata...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {metadata && !loading && (
            <div className={styles.content}>
              <div className={styles.imageContainer}>
                <Image
                  src={metadata.image}
                  alt={metadata.name}
                  width={400}
                  height={400}
                  className={styles.image}
                  unoptimized
                />
              </div>

              <div className={styles.info}>
                <h2 className={styles.title}>{metadata.name}</h2>
                <p className={styles.description}>{metadata.description}</p>

                <div className={styles.attributes}>
                  <h3>Attributes</h3>
                  <div className={styles.attributesGrid}>
                    {metadata.attributes.map((attr, i) => (
                      <div key={i} className={styles.attribute}>
                        <span className={styles.traitType}>{attr.trait_type}</span>
                        <span className={styles.traitValue}>{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
