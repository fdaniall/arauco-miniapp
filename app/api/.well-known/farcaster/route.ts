import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjM2MDc1MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFQzc4MjE0OEZkMmFFRjlBOTc1MTdkQmFEODE0RGViRkUxZDliQTcifQ",
      payload: "eyJkb21haW4iOiJhcmF1Y28uc3BhY2UifQ",
      signature: "8oxoDrJGh0HCdHDPCEq3O7l7r6W5ONcDa85mZYBeKU9pSTsJ13fFcKko0GGd4q9pAw82oHMyZPQXc1Vbz9qYFBw="
    },
    miniapp: {
      version: "1",
      name: "Arauco",
      iconUrl: "https://arauco.space/icon.png",
      homeUrl: "https://arauco.space",
      splashImageUrl: "https://arauco.space/splash.png",
      splashBackgroundColor: "#172F29",
      webhookUrl: "https://arauco.space/api/webhook",
      subtitle: "Grow your forest on-chain",
      description: "Water your tree daily and watch your on-chain forest grow. Collect NFTs, earn rewards, and track your environmental impact on Base blockchain.",
      screenshotUrls: [
        "https://arauco.space/screenshot.png"
      ],
      primaryCategory: "games",
      tags: [
        "climate",
        "nft",
        "gamification",
        "sustainability",
        "forest"
      ],
      heroImageUrl: "https://arauco.space/hero.png",
      tagline: "Grow your forest on-chain",
      ogTitle: "Arauco Forest",
      ogDescription: "Water your tree daily and watch your on-chain forest grow. Earn rewards on Base blockchain.",
      ogImageUrl: "https://arauco.space/hero.png",
      requiredChains: [
        "eip155:8453"
      ],
      requiredCapabilities: [
        "actions.signIn",
        "wallet.getEthereumProvider"
      ]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
