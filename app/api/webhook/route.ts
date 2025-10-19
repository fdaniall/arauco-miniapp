import { NextRequest, NextResponse } from 'next/server';

// Type definitions for Farcaster Mini App webhook events
interface NotificationEvent {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
}

interface WebhookPayload {
  event: 'miniapp.notification' | 'miniapp.install' | 'miniapp.uninstall';
  data: NotificationEvent | {
    fid: number;
    timestamp: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as WebhookPayload;

    console.log('Farcaster webhook received:', {
      event: body.event,
      timestamp: new Date().toISOString(),
      data: body.data
    });

    // Handle different webhook events
    switch (body.event) {
      case 'miniapp.notification':
        // Handle notification events
        // This is triggered when users interact with notifications
        console.log('Notification event:', body.data);
        break;

      case 'miniapp.install':
        // Handle app installation
        console.log('App installed by FID:', (body.data as { fid: number }).fid);
        // You could track this in your database
        break;

      case 'miniapp.uninstall':
        // Handle app uninstallation
        console.log('App uninstalled by FID:', (body.data as { fid: number }).fid);
        // You could update user records
        break;

      default:
        console.log('Unknown event type:', body.event);
    }

    return NextResponse.json({
      success: true,
      received: true,
      event: body.event
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
    status: 'Arauco Farcaster webhook endpoint active',
    timestamp: new Date().toISOString(),
    supportedEvents: [
      'miniapp.notification',
      'miniapp.install',
      'miniapp.uninstall'
    ]
  });
}
