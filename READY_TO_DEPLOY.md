# 🚀 READY TO DEPLOY - Base Mainnet

## ✅ PRE-DEPLOYMENT CHECKLIST

### Code Configuration: ✅ ALL DONE

- [x] Chain changed to Base Mainnet (Chain ID: 8453)
- [x] All "Base Sepolia" references changed to "Base Mainnet"
- [x] BaseScan URLs updated to mainnet
- [x] Contract address placeholder ready
- [x] All comments removed (clean code)
- [x] Farcaster manifest configured

### Smart Contract: ✅ READY

- [x] Contract located: `src/TreeNFT.sol`
- [x] Deployment script: `script/DeployTreeNFT.s.sol`
- [x] Foundry config has Base mainnet RPC
- [x] Build verified: Ready to compile

### Environment Variables: ⚠️ UPDATE NEEDED

**Local (.env):**
```env
✅ NEXT_PUBLIC_URL="https://arauco.space"
✅ PRIVATE_KEY="<your_wallet_with_0.00243_ETH>"
✅ BASESCAN_API_KEY="<your_api_key>"
⚠️  NEXT_PUBLIC_TREE_NFT_ADDRESS="YOUR_NEW_MAINNET_CONTRACT_ADDRESS"
```

**Vercel (Production):**
- [ ] NEXT_PUBLIC_URL=https://arauco.space
- [ ] NEXT_PUBLIC_TREE_NFT_ADDRESS=<after_deployment>
- [ ] NEXT_PUBLIC_PROJECT_NAME=arauco-miniapp

### Wallet Balance: ✅ SUFFICIENT

- Balance: 0.00243 ETH on Base Mainnet
- Required: ~0.0015 ETH max
- Status: ✅ Enough for deployment + testing

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Deploy Smart Contract

```bash
cd /Users/fdaniall/DanialCode/Field/arauco/arauco-miniapp

# Make sure you're in the right directory
pwd

# Run deployment script
./deploy-mainnet.sh
```

**What it does:**
1. Checks your balance
2. Asks for confirmation
3. Builds contract
4. Deploys to Base Mainnet (Chain ID: 8453)
5. Verifies on BaseScan
6. Outputs contract address

**Expected output:**
```
✅ Deployment complete!
TreeNFT deployed at: 0xABC123...
```

**⚠️ SAVE THIS ADDRESS!**

---

### Step 2: Update Contract Address

```bash
# Use the address from Step 1
./update-contract-address.sh 0xYOUR_CONTRACT_ADDRESS_HERE
```

**What it does:**
1. Validates address format
2. Updates `.env` file
3. Shows next steps

---

### Step 3: Update Vercel Environment Variables

```
1. Go to: https://vercel.com/fdanialls-projects/arauco-miniapp/settings/environment-variables

2. Add/Update these variables:

   Name: NEXT_PUBLIC_URL
   Value: https://arauco.space
   Environment: ✓ Production, ✓ Preview

   Name: NEXT_PUBLIC_TREE_NFT_ADDRESS
   Value: <contract_address_from_step_1>
   Environment: ✓ Production, ✓ Preview

   Name: NEXT_PUBLIC_PROJECT_NAME
   Value: arauco-miniapp
   Environment: ✓ Production, ✓ Preview

3. Click Save for each
```

---

### Step 4: Deploy Frontend

```bash
# Commit changes
git add .
git commit -m "Deploy to Base Mainnet with contract 0xYOUR_ADDRESS"
git push origin mainnet

# Or push to main branch
git push origin main
```

**Vercel will auto-deploy** (takes 2-3 minutes)

---

### Step 5: Verify Deployment

#### A. Verify Contract on BaseScan

1. Go to: `https://basescan.org/address/YOUR_CONTRACT_ADDRESS`
2. Check:
   - ✅ Contract is verified (green checkmark)
   - ✅ Contract name shows "TreeNFT"
   - ✅ Source code is visible

#### B. Verify Frontend

1. Go to: `https://arauco.space`
2. Test:
   - ✅ Page loads
   - ✅ Connect wallet works
   - ✅ Shows "Base Mainnet" (not testnet)
   - ✅ Can see contract address in network info

#### C. Test Contract Interaction

1. **Connect Wallet** (make sure on Base Mainnet)
2. **Mint Tree** (costs ~0.0001 ETH)
3. **Verify on BaseScan**: Check transaction appeared
4. **Water Tree** (test functionality)
5. **Check NFT**: View on BaseScan NFT section

---

## 📋 DEPLOYMENT TROUBLESHOOTING

### Problem: "Insufficient balance"

**Solution:**
```bash
# Check balance
cast balance YOUR_ADDRESS --rpc-url https://mainnet.base.org

# Need more? Bridge from Ethereum
# https://bridge.base.org
```

### Problem: "Verification failed"

**Solution:**
```bash
# Manual verify
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/TreeNFT.sol:TreeNFT \
  --chain-id 8453 \
  --etherscan-api-key $BASESCAN_API_KEY \
  --watch
```

### Problem: "RPC error"

**Solution:**
- Check internet connection
- Try again (RPC might be busy)
- Use alternative RPC: `--rpc-url https://base.llamarpc.com`

### Problem: "Wrong network in frontend"

**Solution:**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R)
3. Check Vercel deployment logs
4. Verify env vars in Vercel dashboard

---

## 🎉 POST-DEPLOYMENT CHECKLIST

After successful deployment:

- [ ] Contract verified on BaseScan
- [ ] Frontend deployed to arauco.space
- [ ] Can connect wallet on mainnet
- [ ] Mint transaction works
- [ ] Water transaction works
- [ ] BaseScan links work
- [ ] NFT metadata displays correctly

### Share Your Success!

- [ ] Tweet about launch
- [ ] Submit to Farcaster
- [ ] Update documentation
- [ ] Monitor for first users

---

## 📊 DEPLOYMENT COSTS (Estimate)

| Action | Gas | Cost (at 0.001 gwei) |
|--------|-----|---------------------|
| Deploy Contract | ~800k gas | ~$0.003 |
| Verify Contract | FREE | $0 |
| Test Mint | ~100k gas | ~$0.0004 |
| Test Water | ~50k gas | ~$0.0002 |
| **Total** | | **~$0.0036** |

Your balance: 0.00243 ETH (~$9.38) → More than enough! ✅

---

## 🔐 SECURITY REMINDERS

- [x] Private key in .env (gitignored)
- [x] .env never committed to git
- [ ] After deployment: Remove private key from .env
- [ ] Backup contract address safely
- [ ] Monitor contract on BaseScan
- [ ] Set up Etherscan alerts

---

## 📞 NEED HELP?

If something goes wrong:

1. Check Foundry logs: Look for error messages
2. Check Vercel logs: Deployment tab → View logs
3. Check BaseScan: Transaction status
4. Check browser console: F12 → Console tab

---

## 🚀 YOU'RE READY!

**Everything is configured and ready to deploy to Base Mainnet.**

Run this command to start:
```bash
./deploy-mainnet.sh
```

Good luck! 🌳✨
