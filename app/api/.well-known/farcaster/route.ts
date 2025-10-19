import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    frame: {
      name: "Arauco",
      version: "1",
      iconUrl: "https://x.com/Arauco_cl/photo",
      homeUrl: "https://arauco.space",
      imageUrl: "https://arauco.space/image.png",
      splashImageUrl: "https://arauco.space/splash.png",
      splashBackgroundColor: "#172F29",
      webhookUrl: "https://arauco.space/api/webhook",
      subtitle: "Plant trees, earn carbon credits on-chain",
      description: "Arauco is a blockchain-based platform that connects tree planting with carbon credits. Plant virtual trees as NFTs, track your environmental impact, and participate in the future of sustainable blockchain technology on Base network.",
      primaryCategory: "social"
    },
    accountAssociation: {
      header: "eyJmaWQiOjM2MDc1MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFQzc4MjE0OEZkMmFFRjlBOTc1MTdkQmFEODE0RGViRkUxZDliQTcifQ",
      payload: "eyJkb21haW4iOiJhcmF1Y28uc3BhY2UifQ",
      signature: "8oxoDrJGh0HCdHDPCEq3O7l7r6W5ONcDa85mZYBeKU9pSTsJ13fFcKko0GGd4q9pAw82oHMyZPQXc1Vbz9qYFBw="
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
