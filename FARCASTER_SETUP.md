# Farcaster Mini App Setup

## Files Created

### 1. Manifest JSON
- **Static file**: `public/.well-known/farcaster.json`
- **API route**: `app/api/.well-known/farcaster/route.ts`
- **URL**: `https://arauco.space/.well-known/farcaster.json`

### 2. Webhook Endpoint
- **File**: `app/api/webhook/route.ts`
- **URL**: `https://arauco.space/api/webhook`

### 3. Required Images
- `public/image.png` - Main frame image (copied from banner.png)
- `public/splash.png` - Splash screen (already exists)

## How to Test

### Local Testing

1. Start your development server:
```bash
npm run dev
```

2. Test the manifest endpoint:
```bash
# Static file approach
curl http://localhost:3000/.well-known/farcaster.json

# API route approach
curl http://localhost:3000/api/.well-known/farcaster
```

3. Test the webhook:
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
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
  "name": "Arauco",
  "subtitle": "Plant trees, earn carbon credits on-chain",
  "description": "Arauco is a blockchain-based platform that connects tree planting with carbon credits...",
  "primaryCategory": "social",
  "homeUrl": "https://arauco.space",
  "iconUrl": "https://x.com/Arauco_cl/photo",
  "imageUrl": "https://arauco.space/image.png",
  "splashImageUrl": "https://arauco.space/splash.png",
  "webhookUrl": "https://arauco.space/api/webhook"
}
```

## Important Notes

1. **Domain must match**: The `accountAssociation.payload` contains `"domain":"arauco.space"`, so your app MUST be deployed at `https://arauco.space`

2. **Images must be accessible**: Make sure `image.png` and `splash.png` are accessible at:
   - https://arauco.space/image.png
   - https://arauco.space/splash.png

3. **Icon URL**: Currently using Twitter photo URL `https://x.com/Arauco_cl/photo`. You may want to use a direct image URL instead.

4. **Webhook events**: The webhook will receive notifications about:
   - frame_added
   - frame_removed
   - notifications
   - user interactions

## Next Steps

1. Deploy to production (`arauco.space`)
2. Verify all URLs are accessible
3. Submit to Farcaster
4. Monitor webhook for events
5. Update iconUrl to a proper image URL if needed

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
