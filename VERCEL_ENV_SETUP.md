# 🔧 Vercel Environment Variables Setup

## 📝 Variables Yang Perlu Di-Set di Vercel

Berdasarkan `.env` Anda, ini yang perlu di-upload ke Vercel:

### ✅ WAJIB untuk Production:

```env
NEXT_PUBLIC_URL=https://arauco.space
NEXT_PUBLIC_TREE_NFT_ADDRESS=0xBd13210b592860B2513A4610F6aFB35D8A6C7fdd
NEXT_PUBLIC_PROJECT_NAME=arauco-miniapp
```

### 🔐 OPSIONAL (jika pakai OnChainKit features):

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<your_api_key>
```

Get from: https://portal.cdp.coinbase.com/

### ❌ JANGAN Upload Ini:

```env
# BAHAYA! Jangan upload private key!
PRIVATE_KEY=...

# BaseScan API key bisa di-upload kalau butuh server-side verification
# Tapi untuk sekarang tidak perlu
```

---

## 🚀 Cara Set Environment Variables di Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Buka Vercel Project:**
   - Go to: https://vercel.com/fdanialls-projects/arauco-miniapp
   - Or: https://vercel.com/dashboard

2. **Settings → Environment Variables:**
   - Click "Add New" button

3. **Add Each Variable:**

   **Variable 1:**
   ```
   Name: NEXT_PUBLIC_URL
   Value: https://arauco.space
   Environment: ✓ Production, ✓ Preview, ✓ Development
   ```

   **Variable 2:**
   ```
   Name: NEXT_PUBLIC_TREE_NFT_ADDRESS
   Value: 0xBd13210b592860B2513A4610F6aFB35D8A6C7fdd
   Environment: ✓ Production, ✓ Preview, ✓ Development
   ```

   **Variable 3:**
   ```
   Name: NEXT_PUBLIC_PROJECT_NAME
   Value: arauco-miniapp
   Environment: ✓ Production, ✓ Preview, ✓ Development
   ```

4. **Save** each one

---

### Method 2: Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_URL production
# Enter value: https://arauco.space

vercel env add NEXT_PUBLIC_TREE_NFT_ADDRESS production
# Enter value: 0xBd13210b592860B2513A4610F6aFB35D8A6C7fdd

vercel env add NEXT_PUBLIC_PROJECT_NAME production
# Enter value: arauco-miniapp

# List to verify
vercel env ls
```

---

## 🔄 After Adding Environment Variables

### Redeploy Required!

Environment variables only take effect on **new deployments**.

**Option A: Push to Git**
```bash
git add .
git commit -m "Update manifest config for Farcaster"
git push
```

**Option B: Manual Redeploy**
```
1. Go to Deployments tab
2. Click latest deployment
3. Click "..." menu
4. Select "Redeploy"
5. Uncheck "Use existing Build Cache"
6. Click "Redeploy"
```

---

## ✅ Verify Environment Variables Work

After deployment completes:

### 1. Check manifest uses correct domain
```bash
curl https://arauco.space/.well-known/farcaster.json | jq '.miniapp.homeUrl'
```

**Expected:** `"https://arauco.space"`

### 2. Check accountAssociation exists
```bash
curl https://arauco.space/.well-known/farcaster.json | jq '.accountAssociation'
```

**Expected:** Full object with header, payload, signature (NOT empty strings)

### 3. Check contract address is accessible
```bash
curl https://arauco.space | grep -o "0xBd13210b592860B2513A4610F6aFB35D8A6C7fdd"
```

**Expected:** Should find the address in the page

---

## 📋 Quick Checklist

Before deploying:

- [ ] ✅ `.env` file updated locally with `NEXT_PUBLIC_URL=https://arauco.space`
- [ ] ✅ `.env` file in `.gitignore` (already done)
- [ ] ✅ Private key NOT committed to git
- [ ] ✅ Environment variables added to Vercel dashboard
- [ ] ✅ Redeployed to production
- [ ] ✅ Verified manifest has accountAssociation
- [ ] ✅ Verified URLs use arauco.space

After deployment:

- [ ] ✅ Test manifest: `curl https://arauco.space/.well-known/farcaster.json`
- [ ] ✅ Submit to Farcaster with domain: `arauco.space`

---

## 🎯 Summary

**Upload to Vercel (in dashboard):**
```
NEXT_PUBLIC_URL=https://arauco.space
NEXT_PUBLIC_TREE_NFT_ADDRESS=0xBd13210b592860B2513A4610F6aFB35D8A6C7fdd
NEXT_PUBLIC_PROJECT_NAME=arauco-miniapp
```

**DO NOT upload:**
```
PRIVATE_KEY=... (NEVER!)
BASESCAN_API_KEY=... (not needed for now)
```

**Then:** Redeploy and verify! 🚀
