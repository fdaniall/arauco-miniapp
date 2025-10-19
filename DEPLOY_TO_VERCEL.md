# 🚀 Deploy Arauco to Vercel - Fix Farcaster Manifest

## 🔥 Problem Found

Your production manifest at `https://www.arauco.space/.well-known/farcaster.json` is:
1. ❌ Missing `accountAssociation`
2. ❌ Using old Vercel URLs instead of `arauco.space`
3. ❌ Generated from `minikit.config.ts` without accountAssociation

## ✅ What Was Fixed

### 1. Updated `minikit.config.ts`
- ✅ Added accountAssociation (was empty before)
- ✅ Updated ROOT_URL logic to use `https://arauco.space` in production

### 2. Files Modified
- [minikit.config.ts](minikit.config.ts) - Added accountAssociation + production URL
- [.env.example](.env.example) - Environment variable template

---

## 📋 Deployment Steps

### Step 1: Set Environment Variable in Vercel

Go to your Vercel project dashboard:

```
1. Open: https://vercel.com/fdanialls-projects/arauco-miniapp
2. Go to: Settings → Environment Variables
3. Add new variable:
   - Name: NEXT_PUBLIC_URL
   - Value: https://arauco.space
   - Environment: Production (check this option)
4. Click "Save"
```

**Why:** This ensures the manifest uses `https://arauco.space` for all URLs, matching the accountAssociation domain.

---

### Step 2: Redeploy

#### Option A: Redeploy from Vercel Dashboard
```
1. Go to Deployments tab
2. Click on latest deployment
3. Click the "..." menu
4. Select "Redeploy"
5. Check "Use existing Build Cache" = NO
6. Click "Redeploy"
```

#### Option B: Push to Git
```bash
git add .
git commit -m "Fix Farcaster manifest: add accountAssociation and use arauco.space"
git push origin main
```

Vercel will auto-deploy.

---

### Step 3: Verify Deployment

After deployment completes (wait ~2-3 minutes), verify:

#### 3.1 Check Manifest Has accountAssociation
```bash
curl https://arauco.space/.well-known/farcaster.json | jq '.accountAssociation'
```

**Expected output:**
```json
{
  "header": "eyJmaWQiOjM2MDc1MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFQzc4MjE0OEZkMmFFRjlBOTc1MTdkQmFEODE0RGViRkUxZDliQTcifQ",
  "payload": "eyJkb21haW4iOiJhcmF1Y28uc3BhY2UifQ",
  "signature": "8oxoDrJGh0HCdHDPCEq3O7l7r6W5ONcDa85mZYBeKU9pSTsJ13fFcKko0GGd4q9pAw82oHMyZPQXc1Vbz9qYFBw="
}
```

If you see `null` or empty strings, the env variable didn't apply. Redeploy.

#### 3.2 Check URLs Use arauco.space
```bash
curl https://arauco.space/.well-known/farcaster.json | jq '.miniapp.homeUrl'
```

**Expected:** `"https://arauco.space"`
**NOT:** Vercel URL

#### 3.3 Test with www subdomain
```bash
curl https://www.arauco.space/.well-known/farcaster.json | jq '.accountAssociation'
```

Should return the same accountAssociation.

---

### Step 4: Submit to Farcaster

Once verified:

1. **Go to:** https://warpcast.com/~/developers/mini-apps

2. **Enter domain:** `arauco.space` (NO www, NO https://)

3. **Farcaster will:**
   - Fetch `https://arauco.space/.well-known/farcaster.json`
   - Validate accountAssociation signature
   - Check domain in payload matches

4. **Should succeed!** ✅

---

## 🔍 Troubleshooting

### Problem: Still no accountAssociation after deploy

**Solution:**
```bash
# Verify env variable is set
vercel env ls

# If not there, add it:
vercel env add NEXT_PUBLIC_URL
# Enter value: https://arauco.space
# Select: Production

# Force redeploy
vercel --prod --force
```

### Problem: URLs still showing Vercel domain

**Check:**
```bash
curl https://arauco.space/.well-known/farcaster.json | grep -o 'vercel.app'
```

If you see `vercel.app`, the NEXT_PUBLIC_URL env var didn't take effect.

**Solution:**
1. Double-check env var is set for Production
2. Redeploy with cache cleared
3. Wait for full deployment (not instant)

### Problem: www vs non-www mismatch

Both should work. If one doesn't:

**In Vercel DNS settings:**
- Ensure both `arauco.space` and `www.arauco.space` point to Vercel
- Check SSL certificates for both

---

## 📝 Summary of Changes

### Before:
```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "miniapp": {
    "homeUrl": "https://arauco-miniapp-o7ptcxlnd-fdanialls-projects.vercel.app",
    // ... other fields with vercel URLs
  }
}
```

### After:
```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjM2MDc1MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFQzc4MjE0OEZkMmFFRjlBOTc1MTdkQmFEODE0RGViRkUxZDliQTcifQ",
    "payload": "eyJkb21haW4iOiJhcmF1Y28uc3BhY2UifQ",
    "signature": "8oxoDrJGh0HCdHDPCEq3O7l7r6W5ONcDa85mZYBeKU9pSTsJ13fFcKko0GGd4q9pAw82oHMyZPQXc1Vbz9qYFBw="
  },
  "miniapp": {
    "homeUrl": "https://arauco.space",
    "iconUrl": "https://arauco.space/icon.png",
    // ... all URLs use arauco.space
  }
}
```

---

## ✅ Deployment Checklist

- [ ] Set `NEXT_PUBLIC_URL=https://arauco.space` in Vercel env vars
- [ ] Redeploy to production
- [ ] Verify accountAssociation is present in manifest
- [ ] Verify all URLs use `arauco.space`
- [ ] Test both `arauco.space` and `www.arauco.space`
- [ ] Submit to Farcaster with domain `arauco.space`
- [ ] ✨ Success!

---

**Next:** Follow the steps above, then submit to Farcaster! 🚀
