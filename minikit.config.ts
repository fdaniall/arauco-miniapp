// Use production domain for Farcaster manifest
// Set NEXT_PUBLIC_URL in Vercel env to override
const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.NODE_ENV === 'production' ? "https://arauco.space" : null) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjM2MDc1MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFQzc4MjE0OEZkMmFFRjlBOTc1MTdkQmFEODE0RGViRkUxZDliQTcifQ",
    payload: "eyJkb21haW4iOiJhcmF1Y28uc3BhY2UifQ",
    signature: "8oxoDrJGh0HCdHDPCEq3O7l7r6W5ONcDa85mZYBeKU9pSTsJ13fFcKko0GGd4q9pAw82oHMyZPQXc1Vbz9qYFBw=",
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
