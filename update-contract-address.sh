#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "Usage: ./update-contract-address.sh <CONTRACT_ADDRESS>"
    echo "Example: ./update-contract-address.sh 0x1234567890abcdef..."
    exit 1
fi

CONTRACT_ADDRESS=$1

if [[ ! $CONTRACT_ADDRESS =~ ^0x[a-fA-F0-9]{40}$ ]]; then
    echo "❌ Error: Invalid Ethereum address format"
    echo "   Expected: 0x followed by 40 hexadecimal characters"
    exit 1
fi

echo "🔄 Updating contract address to: $CONTRACT_ADDRESS"
echo ""

if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

if grep -q "NEXT_PUBLIC_TREE_NFT_ADDRESS=" .env; then
    sed -i.bak "s/NEXT_PUBLIC_TREE_NFT_ADDRESS=.*/NEXT_PUBLIC_TREE_NFT_ADDRESS=\"$CONTRACT_ADDRESS\"/" .env
    rm -f .env.bak
    echo "✅ Updated .env"
else
    echo "NEXT_PUBLIC_TREE_NFT_ADDRESS=\"$CONTRACT_ADDRESS\"" >> .env
    echo "✅ Added to .env"
fi

echo ""
echo "📝 Next steps:"
echo "1. Verify contract on BaseScan: https://basescan.org/address/$CONTRACT_ADDRESS"
echo "2. Update Vercel environment variable:"
echo "   - Go to: https://vercel.com/fdanialls-projects/arauco-miniapp/settings/environment-variables"
echo "   - Update NEXT_PUBLIC_TREE_NFT_ADDRESS"
echo "   - Value: $CONTRACT_ADDRESS"
echo "3. Commit and push:"
echo "   git add .env"
echo "   git commit -m 'Update mainnet contract address'"
echo "   git push"
echo ""
