#!/bin/bash

set -e

echo "🚀 Arauco TreeNFT - Base Mainnet Deployment"
echo "=========================================="
echo ""

if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

source .env

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$BASESCAN_API_KEY" ]; then
    echo "❌ Error: BASESCAN_API_KEY not set in .env"
    exit 1
fi

DEPLOYER_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
echo "📍 Deployer Address: $DEPLOYER_ADDRESS"

BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url https://mainnet.base.org)
BALANCE_ETH=$(cast to-unit $BALANCE ether)
echo "💰 Balance: $BALANCE_ETH ETH"

MIN_BALANCE="1000000000000000"
if [ $(echo "$BALANCE < $MIN_BALANCE" | bc) -eq 1 ]; then
    echo "❌ Error: Insufficient balance! Need at least 0.001 ETH"
    echo "   Current: $BALANCE_ETH ETH"
    exit 1
fi

echo ""
read -p "⚠️  You are deploying to MAINNET. This will cost real ETH. Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "🔨 Building contract..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📡 Deploying TreeNFT to Base Mainnet..."
echo ""

forge script script/DeployTreeNFT.s.sol:DeployTreeNFT \
    --rpc-url base \
    --broadcast \
    --verify \
    --retries 3 \
    --delay 10 \
    -vvvv

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the contract address from the output above"
echo "2. Update .env: NEXT_PUBLIC_TREE_NFT_ADDRESS=<address>"
echo "3. Update Vercel environment variables"
echo "4. Deploy frontend: git push"
echo ""
