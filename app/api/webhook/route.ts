import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Farcaster webhook received:', body);

    // Handle different webhook events from Farcaster
    // You can process events like:
    // - frame_added
    // - frame_removed
    // - notifications
    // etc.

    return NextResponse.json({
      success: true,
      received: true
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Invalid webhook payload' },
      { status: 400 }
    );
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'Arauco Farcaster webhook endpoint',
    timestamp: new Date().toISOString()
  });
}
