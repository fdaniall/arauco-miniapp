#!/bin/bash

echo "🔍 PRE-FLIGHT CHECK - Base Mainnet Deployment"
echo "=============================================="
echo ""

ERRORS=0
WARNINGS=0

if [ ! -f .env ]; then
    echo "❌ CRITICAL: .env file not found!"
    ERRORS=$((ERRORS+1))
else
    echo "✅ .env file exists"
fi

if [ -f .env ]; then
    source .env

    if [ -z "$PRIVATE_KEY" ]; then
        echo "❌ CRITICAL: PRIVATE_KEY not set in .env"
        ERRORS=$((ERRORS+1))
    else
        echo "✅ PRIVATE_KEY is set"

        DEPLOYER=$(cast wallet address --private-key $PRIVATE_KEY 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo "   📍 Deployer: $DEPLOYER"

            BALANCE=$(cast balance $DEPLOYER --rpc-url https://mainnet.base.org 2>/dev/null)
            if [ $? -eq 0 ]; then
                BALANCE_ETH=$(cast to-unit $BALANCE ether)
                echo "   💰 Balance: $BALANCE_ETH ETH"

                MIN_BALANCE="1000000000000000"
                if [ $(echo "$BALANCE < $MIN_BALANCE" | bc) -eq 1 ]; then
                    echo "❌ CRITICAL: Insufficient balance (need at least 0.001 ETH)"
                    ERRORS=$((ERRORS+1))
                else
                    echo "   ✅ Balance sufficient for deployment"
                fi
            else
                echo "⚠️  WARNING: Could not check balance"
                WARNINGS=$((WARNINGS+1))
            fi
        else
            echo "❌ CRITICAL: Invalid PRIVATE_KEY"
            ERRORS=$((ERRORS+1))
        fi
    fi

    if [ -z "$BASESCAN_API_KEY" ]; then
        echo "⚠️  WARNING: BASESCAN_API_KEY not set (contract won't auto-verify)"
        WARNINGS=$((WARNINGS+1))
    else
        echo "✅ BASESCAN_API_KEY is set"
    fi
fi

echo ""
echo "📁 Checking project structure..."

if [ ! -f "src/TreeNFT.sol" ]; then
    echo "❌ CRITICAL: src/TreeNFT.sol not found!"
    ERRORS=$((ERRORS+1))
else
    echo "✅ Contract file exists"
fi

if [ ! -f "script/DeployTreeNFT.s.sol" ]; then
    echo "❌ CRITICAL: script/DeployTreeNFT.s.sol not found!"
    ERRORS=$((ERRORS+1))
else
    echo "✅ Deploy script exists"
fi

if [ ! -f "foundry.toml" ]; then
    echo "❌ CRITICAL: foundry.toml not found!"
    ERRORS=$((ERRORS+1))
else
    echo "✅ Foundry config exists"
fi

echo ""
echo "🔨 Checking if contract compiles..."

forge build --quiet 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Contract compiles successfully"
else
    echo "❌ CRITICAL: Contract compilation failed!"
    echo "   Run 'forge build' to see errors"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "🌐 Checking frontend config..."

if grep -q "import { base }" app/rootProvider.tsx 2>/dev/null; then
    echo "✅ Frontend configured for mainnet"
else
    echo "⚠️  WARNING: Frontend might not be on mainnet"
    WARNINGS=$((WARNINGS+1))
fi

if grep -q "basescan.org" app/constants/index.ts 2>/dev/null; then
    echo "✅ BaseScan URLs are mainnet"
else
    echo "⚠️  WARNING: BaseScan URLs might be testnet"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "🔐 Security check..."

if git ls-files --error-unmatch .env 2>/dev/null 1>&2; then
    echo "⚠️  WARNING: .env is tracked by git!"
    echo "   This is a security risk. Add .env to .gitignore"
    WARNINGS=$((WARNINGS+1))
else
    echo "✅ .env is not tracked by git"
fi

if grep -q ".env" .gitignore 2>/dev/null; then
    echo "✅ .env is in .gitignore"
else
    echo "⚠️  WARNING: .env not explicitly in .gitignore"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "=============================================="
echo "📊 RESULTS:"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED!"
    echo ""
    echo "✅ Ready to deploy to Base Mainnet"
    echo ""
    echo "Run: ./deploy-mainnet.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS WARNING(S) - Can proceed but review warnings"
    echo ""
    echo "You can still deploy, but address the warnings above."
    echo ""
    echo "Run: ./deploy-mainnet.sh"
    exit 0
else
    echo "❌ $ERRORS CRITICAL ERROR(S)"
    if [ $WARNINGS -gt 0 ]; then
        echo "⚠️  $WARNINGS WARNING(S)"
    fi
    echo ""
    echo "Fix the errors above before deploying."
    exit 1
fi
