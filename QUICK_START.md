# ⚡ Quick Start - Local Development (5 Minutes)

## Three Simple Commands

Open 4 terminals in the project root:

### Terminal 1: Start Blockchain

```bash
cd contracts && npm install && npm run node:persistent
```

Keep this running. You'll see accounts with private keys.

### Terminal 2: Deploy Contract

```bash
cd contracts && npm run deploy:local
```

First run deploys a new contract; next runs reuse existing deployment to keep product history.

### Terminal 3: Backend

```bash
cd backend && npm install && npm run dev
```

Runs on `http://localhost:5000`

### Terminal 4: Frontend

```bash
cd frontend && npm install && npm start
```

Opens `http://localhost:3000`

## MetaMask Setup (2 Minutes)

1. **Add Network:**
   - Network: `Hardhat Local`
   - RPC: `http://127.0.0.1:8545`
   - Chain ID: `31337`

2. **Import Accounts:**
   - From Terminal 1 output, copy first account's private key
   - MetaMask → Import Account → Paste key
   - Repeat for 3 more accounts

3. **Done!** Each account has 10,000 ETH

## Test It

1. Switch to Manufacturer account → Create product
2. Switch to Distributor account → Ship product
3. Switch to Retailer account → Receive & Sell
4. View supply chain history! ✅

## Full Guide

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for detailed instructions.
