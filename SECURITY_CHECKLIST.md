# 🔐 Security Checklist - Private Key Safety

## ✅ Current Status

Your `.env` file is properly gitignored and not tracked by git.

---

## ⚠️ CRITICAL: Private Key Security

You mentioned you updated the private key to a wallet with real funds. Here's what you MUST verify:

### 1. ✅ Check .env is NOT in Git History

Run this to verify:
```bash
git log --all --full-history -- .env
```

**Expected:** No output (file was never committed)

**If you see commits:** Your old private key may be exposed in git history!

---

### 2. ✅ Never Upload Private Key Anywhere

**NEVER set in Vercel:**
```
❌ PRIVATE_KEY  (NEVER upload to Vercel!)
```

Private key is ONLY for:
- Local Foundry deployment
- Contract deployment from your machine

---

### 3. ✅ Separate Wallets

**Best Practice:** Use different wallets for different purposes

| Purpose | Recommended Balance |
|---------|-------------------|
| **Deployment Wallet** | Just enough ETH for gas (~0.01 ETH) |
| **Testing Wallet** | Small amount (~0.001 ETH) |
| **Production Wallet** | Don't expose private key! |

---

### 4. ✅ If Private Key Was Ever Exposed

**Did you ever:**
- Commit `.env` to git?
- Share code with `.env` included?
- Push to GitHub with `.env`?
- Upload to Discord/Slack?

**If YES → Your wallet is COMPROMISED:**

1. **Create new wallet immediately**
2. **Transfer funds to new wallet**
3. **Never use old wallet again**
4. **Update `.env` with new private key**

---

## 🛡️ Recommended: Use Hardware Wallet for Mainnet

For mainnet deployment with real funds:

### Option 1: Use Foundry with Ledger/Trezor

```bash
# Deploy using hardware wallet (safer!)
forge script script/Deploy.s.sol \
  --rpc-url https://mainnet.base.org \
  --ledger \
  --broadcast
```

No private key in `.env` needed!

### Option 2: Use Deployment Wallet with Minimal Funds

```bash
# Create dedicated deployment wallet
# Only put enough ETH for gas (~0.01 ETH)
# Deploy contract
# Transfer ownership to secure wallet
```

---

## 🔍 Security Audit Checklist

Before deploying to mainnet with real money:

### Git Security:
- [ ] `.env` in `.gitignore` ✅
- [ ] `.env` never committed to git ✅
- [ ] No private keys in any committed files
- [ ] Repository is private (if on GitHub)

### File Security:
- [ ] Private key only in `.env` (local)
- [ ] `.env` not uploaded to cloud/Vercel
- [ ] No screenshots/shares with private key visible
- [ ] Backup `.env` stored securely (encrypted)

### Wallet Security:
- [ ] Using dedicated deployment wallet
- [ ] Deployment wallet has minimal funds
- [ ] Main funds in separate secure wallet
- [ ] Have backup/recovery phrase stored safely

### Deployment Security:
- [ ] Contract tested thoroughly on testnet
- [ ] Contract audited (if handling user funds)
- [ ] Ownership transfer to multisig (if production)
- [ ] Emergency pause/upgrade mechanism

---

## 🚨 What to Do If Compromised

If you think your private key was exposed:

### Immediate Actions:

1. **Stop everything** - Don't deploy yet

2. **Check wallet balance:**
```bash
cast balance <YOUR_ADDRESS> --rpc-url https://mainnet.base.org
```

3. **If funds still there:**
   - Create new wallet IMMEDIATELY
   - Transfer all funds to new wallet
   - Update `.env` with new private key
   - Never use old wallet

4. **If funds gone:**
   - Wallet was definitely compromised
   - Learn from mistake
   - Start fresh with new wallet

---

## 💡 Best Practices Going Forward

### For Development:
```env
# .env.development (testnet)
PRIVATE_KEY="<testnet_wallet_with_no_real_funds>"
```

### For Production:
```bash
# Use hardware wallet OR
# Use encrypted keystore OR
# Use deployment service (Defender, etc.)

# NEVER store mainnet private key in plain text!
```

---

## 📝 Current Setup Check

Your `.env` currently has:
```env
PRIVATE_KEY="0x4ca3276c538b2e03208f17fdc3e558a636794c0d47d302e68f3f202bce8ab351"
```

### Questions to Answer:

1. **Is this a new wallet?** YES → Good!
2. **How much ETH is in it?** Only deployment amount (~0.01)? → Good!
3. **Was it ever shared?** NO → Good!
4. **Is it backed up safely?** YES → Good!

---

## ✅ Quick Security Test

Run this to check your wallet balance:

```bash
# Check Base Mainnet balance
cast balance 0x<YOUR_ADDRESS> --rpc-url https://mainnet.base.org

# Check if address matches private key
cast wallet address --private-key $PRIVATE_KEY
```

---

## 🎯 Recommendation

Before deploying to mainnet:

1. **Use MINIMAL funds** in deployment wallet
   - Just enough for gas (~0.01 ETH)

2. **Deploy contract**

3. **Transfer ownership** to separate, secure wallet
   ```solidity
   contract.transferOwnership(SECURE_WALLET_ADDRESS);
   ```

4. **Remove private key** from `.env` after deployment
   - Or use separate `.env.deployment` file

---

**Remember:** Private keys are like passwords to your bank account. Treat them with EXTREME care! 🔐
