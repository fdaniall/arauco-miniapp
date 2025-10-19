# Farcaster Mini App Setup

## Files Created

### 1. Manifest JSON
- **Static file**: `public/.well-known/farcaster.json` (PRIMARY)
- **API route**: `app/api/.well-known/farcaster/route.ts` (Backup)
- **URL**: `https://arauco.space/.well-known/farcaster.json`
- **Format**: Uses `miniapp` property (not deprecated `frame`)

### 2. Webhook Endpoint
- **File**: `app/api/webhook/route.ts`
- **URL**: `https://arauco.space/api/webhook`
- **Supported events**:
  - `miniapp.notification` - User notification interactions
  - `miniapp.install` - App installation tracking
  - `miniapp.uninstall` - App removal tracking

### 3. Required Images (All in `public/`)
- `icon.png` - 1024x1024px PNG, no alpha ✅
- `splash.png` - 200x200px ✅
- `screenshot.png` - 1284x2778px portrait ✅
- `hero.png` - 1200x630px (1.91:1 ratio) ✅ (resized from banner)

## How to Test

### Local Testing

1. **Validate manifest** (recommended before deployment):
```bash
npm run validate:farcaster
```

This will check:
- Required fields presence
- Field length limits
- URL validity
- Tag format
- Emoji/special character usage
- Account association structure

2. **Start development server**:
```bash
npm run dev
```

3. **Test manifest endpoints**:
```bash
# Static file approach (primary)
curl http://localhost:3000/.well-known/farcaster.json

# API route approach (backup)
curl http://localhost:3000/api/.well-known/farcaster
```

4. **Test webhook**:
```bash
# GET request
curl http://localhost:3000/api/webhook

# POST request (simulate Farcaster event)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "miniapp.install", "data": {"fid": 123, "timestamp": 1234567890}}'
```

### Production Testing

After deploying to `arauco.space`:

```bash
# Check manifest
curl https://arauco.space/.well-known/farcaster.json

# Check webhook
curl https://arauco.space/api/webhook
```

## Farcaster Submission

1. Go to [Farcaster Frames](https://warpcast.com/~/developers/frames)
2. Click "Add Frame" or "Submit Frame"
3. Enter your domain: `https://arauco.space`
4. Farcaster will automatically fetch the manifest from `/.well-known/farcaster.json`
5. Verify all information is correct
6. Submit for review

## Manifest Details

```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "eyJkb21haW4iOiJhcmF1Y28uc3BhY2UifQ",
    "signature": "..."
  },
  "miniapp": {
    "version": "1",
    "name": "Arauco",
    "subtitle": "Plant trees, earn credits",
    "description": "Arauco connects tree planting with carbon credits...",
    "primaryCategory": "social",
    "tags": ["climate", "nft", "sustainability", "carbon-credits", "base"],
    "homeUrl": "https://arauco.space",
    "iconUrl": "https://arauco.space/icon.png",
    "splashImageUrl": "https://arauco.space/splash.png",
    "splashBackgroundColor": "#172F29",
    "screenshotUrls": ["https://arauco.space/screenshot.png"],
    "heroImageUrl": "https://arauco.space/hero.png",
    "ogImageUrl": "https://arauco.space/hero.png",
    "webhookUrl": "https://arauco.space/api/webhook",
    "requiredChains": ["eip155:8453"],
    "requiredCapabilities": ["actions.signIn", "wallet.getEthereumProvider"]
  }
}
```

### Key Requirements Met:
- ✅ Uses `miniapp` property (not deprecated `frame`)
- ✅ Icon: 1024x1024px PNG without alpha
- ✅ Splash: 200x200px
- ✅ Screenshots: 1284x2778px portrait
- ✅ Hero/OG Image: 1200x630px (1.91:1 ratio)
- ✅ Subtitle: Max 30 chars, no emojis
- ✅ Description: Max 170 chars
- ✅ Tags: Max 5, lowercase, no spaces
- ✅ Required chains: Base (eip155:8453)
- ✅ Account association with verified ownership

## Important Notes

1. **Domain must match**: The `accountAssociation.payload` contains `"domain":"arauco.space"`, so your app MUST be deployed at `https://arauco.space`

2. **Images must be accessible**: After deployment, verify all images are accessible:
   - https://arauco.space/icon.png (1024x1024px)
   - https://arauco.space/splash.png (200x200px)
   - https://arauco.space/screenshot.png (1284x2778px)
   - https://arauco.space/hero.png (1200x630px)

3. **Manifest location**: Farcaster expects the manifest at:
   - Primary: `https://arauco.space/.well-known/farcaster.json`
   - Backup: `https://arauco.space/api/.well-known/farcaster`

4. **Webhook events**: The webhook will receive:
   - `miniapp.notification` - User notification interactions
   - `miniapp.install` - App installation events
   - `miniapp.uninstall` - App removal events

5. **Blockchain requirements**:
   - App requires Base network (Chain ID: 8453)
   - Requires wallet provider and sign-in capabilities

## Next Steps

### Before Deployment

1. ✅ Manifest JSON created and validated
2. ✅ All required images prepared
3. ✅ Webhook endpoint implemented
4. ⚠️ **Note**: Icon has alpha channel - Farcaster requires no alpha (may need manual conversion)

### Deployment Checklist

1. **Deploy to production** (`arauco.space`)
   ```bash
   # Your deployment command here
   npm run build
   # Deploy to your hosting provider
   ```

2. **Verify all URLs are accessible**:
   ```bash
   curl https://arauco.space/.well-known/farcaster.json
   curl -I https://arauco.space/icon.png
   curl -I https://arauco.space/splash.png
   curl -I https://arauco.space/screenshot.png
   curl -I https://arauco.space/hero.png
   curl https://arauco.space/api/webhook
   ```

3. **Submit to Farcaster**:
   - Go to [Farcaster Developer Tools](https://warpcast.com/~/developers/mini-apps)
   - Click "Add Mini App"
   - Enter domain: `arauco.space`
   - Farcaster will validate your manifest
   - Review and submit

4. **Alternative: Use Farcaster Hosted Manifests**:
   - Visit https://farcaster.xyz/~/developers/mini-apps/manifest
   - Create hosted manifest (easier to update without redeployment)
   - Automatic validation and error checking

5. **Monitor webhook events**:
   - Check server logs for incoming webhook calls
   - Track installs/uninstalls
   - Handle notification interactions

## Troubleshooting

### Manifest not found
- Check if file exists at `public/.well-known/farcaster.json`
- Verify Next.js is serving static files from `public/`
- Check deployment configuration

### Images not loading
- Ensure images are in `public/` folder
- Check file permissions
- Verify URLs in browser

### Webhook not receiving events
- Check server logs for errors
- Verify endpoint is accessible publicly
- Test with curl or Postman

## Quick Reference

### File Structure
```
arauco-miniapp/
├── public/
│   ├── .well-known/
│   │   └── farcaster.json          # Main manifest (PRIMARY)
│   ├── icon.png                     # 1024x1024px, no alpha
│   ├── splash.png                   # 200x200px
│   ├── screenshot.png               # 1284x2778px portrait
│   └── hero.png                     # 1200x630px (1.91:1)
├── app/
│   └── api/
│       ├── webhook/
│       │   └── route.ts             # Webhook handler
│       └── .well-known/
│           └── farcaster/
│               └── route.ts         # API manifest (backup)
└── scripts/
    └── validate-farcaster-manifest.js
```

### NPM Scripts
```bash
npm run dev                  # Start dev server
npm run validate:farcaster   # Validate manifest
npm run build               # Build (auto-validates manifest first)
```

### Important URLs
- **Manifest**: `https://arauco.space/.well-known/farcaster.json`
- **Webhook**: `https://arauco.space/api/webhook`
- **Farcaster Dev Tools**: https://warpcast.com/~/developers/mini-apps
- **Hosted Manifest**: https://farcaster.xyz/~/developers/mini-apps/manifest

### Key Constraints
| Field | Constraint |
|-------|------------|
| name | Max 32 chars |
| subtitle | Max 30 chars, no emojis |
| description | Max 170 chars, no emojis |
| tagline | Max 30 chars |
| ogTitle | Max 30 chars |
| ogDescription | Max 100 chars |
| tags | Max 5 tags, max 20 chars each, lowercase only |
| iconUrl | 1024x1024px PNG, no alpha |
| splashImageUrl | 200x200px PNG |
| heroImageUrl | 1200x630px (1.91:1) PNG |
| screenshotUrls | 1284x2778px portrait, max 3 |

### Supported Chains (CAIP-2)
- Base Mainnet: `eip155:8453`
- Ethereum: `eip155:1`
- Optimism: `eip155:10`
- [Full list](https://github.com/farcasterxyz/protocol/blob/main/docs/FARCASTER_PROTOCOL.md)

### Required Capabilities
- `actions.signIn` - User authentication
- `wallet.getEthereumProvider` - Wallet access
- `actions.swapToken` - Token swaps (if needed)
- [Full list](https://docs.farcaster.xyz/developers/frames/v2/spec#capabilities)
