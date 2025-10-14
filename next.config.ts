import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Suppress MetaMask SDK React Native async storage warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
    };

    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { message: /Can't resolve '@react-native-async-storage\/async-storage'/ },
    ];

    return config;
  },
};

export default nextConfig;
