# 🚀 Mainnet Deployment Guide

## ✅ Code Already Updated to Mainnet!

All testnet references have been changed to mainnet. Here's what was updated:

### Files Changed:

1. **[app/rootProvider.tsx](app/rootProvider.tsx:3)**
   - ✅ Changed from `baseSepolia` to `base`
   - ✅ Chain ID now points to Base Mainnet (8453)

2. **[app/page.tsx](app/page.tsx:18)**
   - ✅ Import changed to `base`
   - ✅ All network switch messages now say "Base Mainnet"
   - ✅ All `chainId` references updated

3. **[app/constants/index.ts](app/constants/index.ts:12)**
   - ✅ BaseScan URL: `basescan.org` (no longer sepolia)

4. **[app/components/NFTInfoCard.tsx](app/components/NFTInfoCard.tsx:29)**
   - ✅ BaseScan link updated to mainnet

---

## 📋 Before Deploying to Mainnet

### 1. Deploy Smart Contract to Base Mainnet

You need to deploy your TreeNFT contract to Base Mainnet first.

#### Using Foundry:

```bash
# Make sure you're in the contract directory
cd path/to/your/contract

# Deploy to Base Mainnet (Chain ID: 8453)
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $BASESCAN_API_KEY \
  --verify \
  src/TreeNFT.sol:TreeNFT

# Or use your existing deployment script
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify
```

**⚠️ IMPORTANT:** Save the deployed contract address!

---

### 2. Update Environment Variables

#### Local (.env):
```env
NEXT_PUBLIC_TREE_NFT_ADDRESS="<YOUR_MAINNET_CONTRACT_ADDRESS>"
```

#### Vercel (Production):
```
Settings → Environment Variables

Update:
  Name: NEXT_PUBLIC_TREE_NFT_ADDRESS
  Value: <YOUR_MAINNET_CONTRACT_ADDRESS>
  Environment: ✓ Production
```

---

### 3. Verify Contract on BaseScan

After deployment, verify your contract:

```bash
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/TreeNFT.sol:TreeNFT \
  --chain-id 8453 \
  --etherscan-api-key $BASESCAN_API_KEY
```

Or it should auto-verify if you used `--verify` flag during deployment.

---

## 🔄 Network Configuration Summary

### Before (Testnet):
- Chain: Base Sepolia
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Faucet: Available (free test ETH)

### After (Mainnet):
- Chain: Base Mainnet ✅
- Chain ID: 8453 ✅
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org ✅
- Faucet: None (need real ETH)

---

## 💰 Gas Costs (Estimate)

On Base Mainnet, typical costs:

| Action | Gas | Estimated Cost (at 0.001 gwei) |
|--------|-----|-------------------------------|
| Mint Tree NFT | ~100k gas | ~$0.001 |
| Water Tree | ~50k gas | ~$0.0005 |

Base has very low fees compared to Ethereum mainnet!

---

## 🧪 Testing on Mainnet

### Before going live:

1. **Test with small amount of ETH**
   - Bridge small amount from Ethereum to Base
   - Use official Base Bridge: https://bridge.base.org

2. **Test all functions**
   - Connect wallet
   - Mint tree NFT
   - Water tree
   - Check BaseScan links work

3. **Verify frontend**
   - Network detection works
   - Wrong network prompts appear correctly
   - Transaction confirmations show up

---

## 🚀 Deployment Checklist

- [ ] Smart contract deployed to Base Mainnet
- [ ] Contract verified on BaseScan
- [ ] Contract address saved
- [ ] `.env` updated with mainnet contract address
- [ ] Vercel env vars updated
- [ ] Test deployment on staging first
- [ ] Test with real wallet on mainnet
- [ ] All functions work (mint, water, view)
- [ ] BaseScan links working
- [ ] Deploy to production

---

## 🔙 Rollback to Testnet

If you need to go back to testnet:

1. **Revert code changes:**
```bash
# Change imports back
sed -i 's/import { base }/import { baseSepolia }/g' app/rootProvider.tsx app/page.tsx

# Change variables back
sed -i 's/chain={base}/chain={baseSepolia}/g' app/rootProvider.tsx
sed -i 's/chainId: base.id/chainId: baseSepolia.id/g' app/page.tsx

# Change BaseScan URLs
sed -i 's/basescan.org/sepolia.basescan.org/g' app/constants/index.ts app/components/NFTInfoCard.tsx

# Change UI messages
sed -i 's/Base Mainnet/Base Sepolia/g' app/page.tsx
```

2. **Update contract address back to testnet**

---

## 📝 Important Notes

1. **Mainnet = Real Money**
   - All transactions cost real ETH
   - Contract interactions are permanent
   - Triple-check before deploying

2. **Security Best Practices**
   - Never commit private keys
   - Use hardware wallet for deployment
   - Test thoroughly on testnet first
   - Audit contract before mainnet

3. **User Experience**
   - Users need Base ETH to interact
   - Add clear instructions for bridging
   - Consider gasless options (meta-transactions)
   - Have support/help documentation ready

---

## ✅ Current Status

Your app is now configured for **Base Mainnet (Chain ID: 8453)**.

All code references have been updated. Just need to:
1. Deploy contract to mainnet
2. Update contract address
3. Test & deploy!

🎉 Ready for mainnet deployment!
