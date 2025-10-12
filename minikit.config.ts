const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    allowedAddresses: [],
  },
  miniapp: {
    version: "1",
    name: "Arauco Forest",
    subtitle: "Water Your Tree Daily",
    description: "Grow your digital tree NFT by watering it daily. Build streaks, earn rewards, and help grow a virtual forest on Base. Simple daily habit game meets Web3.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/logo-arauco.png`,
    splashImageUrl: `${ROOT_URL}/banner.png`,
    splashBackgroundColor: "#1a3a2e",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["nft", "gamification", "sustainability", "daily-habit", "forest", "tree"],
    heroImageUrl: `${ROOT_URL}/banner.png`,
    tagline: "Grow your on-chain forest, one drop at a time 🌳",
    ogTitle: "Arauco Forest - Water Your Tree Daily",
    ogDescription: "Join the daily habit game on Farcaster. Water your tree, grow your forest, earn NFT rewards on Base.",
    ogImageUrl: `${ROOT_URL}/banner.png`,
  },
} as const;
