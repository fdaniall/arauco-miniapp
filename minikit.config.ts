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
    subtitle: "Grow your forest on-chain",
    description: "Water your tree daily and watch your on-chain forest grow. Collect NFTs, earn rewards, and track your environmental impact on Base blockchain.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#1a3a2e",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["nft", "gamification", "sustainability", "forest", "climate"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Grow your forest on-chain",
    ogTitle: "Arauco Forest",
    ogDescription: "Water your tree daily and grow your forest. Earn NFT rewards on Base blockchain.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
