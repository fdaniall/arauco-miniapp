# TreeNFT Deployment Guide

## Prerequisites

1. **Get Base Sepolia ETH** (for gas fees)
   - Go to: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Or: https://basescan.org/faucet
   - Connect wallet and request testnet ETH

2. **Get Basescan API Key** (for contract verification)
   - Go to: https://basescan.org/register
   - Create account
   - Generate API key at: https://basescan.org/myapikey

3. **Get your wallet Private Key**
   - In MetaMask: Account Details → Show Private Key
   - **⚠️ NEVER share this key or commit it to git!**

## Setup

1. **Add to `.env` file:**
```bash
PRIVATE_KEY="your_private_key_here_without_0x_prefix"
BASESCAN_API_KEY="your_basescan_api_key"
```

2. **Source the environment:**
```bash
source .env
```

## Deploy to Base Sepolia

### Option 1: Deploy Only
```bash
forge script script/DeployTreeNFT.s.sol:DeployTreeNFT \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

### Option 2: Deploy + Verify Separately
```bash
# 1. Deploy
forge script script/DeployTreeNFT.s.sol:DeployTreeNFT \
  --rpc-url base_sepolia \
  --broadcast

# 2. Verify (if auto-verify fails)
forge verify-contract <CONTRACT_ADDRESS> \
  src/TreeNFT.sol:TreeNFT \
  --chain base-sepolia \
  --watch
```

### Option 3: Simulate First (Dry Run)
```bash
forge script script/DeployTreeNFT.s.sol:DeployTreeNFT \
  --rpc-url base_sepolia
```

## After Deployment

1. **Copy contract address** from terminal output
2. **Update `.env`:**
```bash
NEXT_PUBLIC_TREE_NFT_ADDRESS="0x..."
```

3. **Verify on Basescan:**
   - Go to: https://sepolia.basescan.org/address/<YOUR_CONTRACT_ADDRESS>
   - Check contract is verified (green checkmark)

## Deploy to Base Mainnet (Production)

⚠️ **Only after testing on Sepolia!**

```bash
forge script script/DeployTreeNFT.s.sol:DeployTreeNFT \
  --rpc-url base \
  --broadcast \
  --verify
```

## Useful Commands

```bash
# Check contract bytecode
forge build

# Run tests
forge test

# Check gas estimates
forge test --gas-report

# Get contract size
forge build --sizes

# Format code
forge fmt
```

## Troubleshooting

**Error: "insufficient funds"**
- Get more Base Sepolia ETH from faucet

**Error: "PRIVATE_KEY not found"**
- Make sure `.env` is sourced: `source .env`
- Check `.env` file has correct variable name

**Verification failed**
- Wait 1-2 minutes after deployment
- Try manual verification with `forge verify-contract`
- Check Basescan API key is correct

## Contract Addresses

### Base Sepolia (Testnet)
- TreeNFT: `[TO BE DEPLOYED]`

### Base Mainnet (Production)
- TreeNFT: `[TO BE DEPLOYED]`
