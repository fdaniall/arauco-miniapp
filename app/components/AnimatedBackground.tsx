"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  // Generate particle data only on client side
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParticles(
      [...Array(20)].map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div className="animated-background">
      {/* Gradient Mesh Background */}
      <motion.div
        className="gradient-blob blob-1"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="gradient-blob blob-2"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="gradient-blob blob-3"
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles - only render on client */}
      {mounted && particles.map((particle, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      <style jsx>{`
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(135deg, #0a1f1a 0%, #1a3a2e 50%, #0f2419 100%);
        }

        .gradient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #4a9d7f 0%, transparent 70%);
          top: -100px;
          left: -100px;
        }

        .blob-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #2d6e55 0%, transparent 70%);
          bottom: -150px;
          right: -150px;
        }

        .blob-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #a8e6cf 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(168, 230, 207, 0.6);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(168, 230, 207, 0.8);
        }
      `}</style>
    </div>
  );
}
