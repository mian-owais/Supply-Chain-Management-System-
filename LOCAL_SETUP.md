# Local Development Setup (Persistent Data)

Run the entire project on localhost with a persistent local blockchain so products, states, and history remain after restart.

## Prerequisites

- Node.js v16+
- npm
- MetaMask

## Quick Start

### Step 1: Start Persistent Blockchain

```bash
# Terminal 1
cd contracts
npm install
npm run node:persistent
```

This runs a local chain at `http://127.0.0.1:8545` and stores chain data in `contracts/ganache-db`.

### Step 2: Deploy or Reuse Contract

```bash
# Terminal 2
cd contracts
npm run deploy:local
```

Behavior of `deploy:local`:

- First run: deploys contract + assigns roles.
- Next runs: reuses the same deployed address if it exists on-chain.
- Preserves existing product data and history.

Use this only when you intentionally want a brand-new contract:

```bash
cd contracts
npm run deploy:local:force
```

### Step 3: Start Backend and Frontend

```bash
# Terminal 3
cd backend
npm install
npm run dev
```

Backend URL: `http://localhost:5000`

```bash
# Terminal 4
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:3000`

## MetaMask Network

Add custom network:

- Network name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

Because `node:persistent` uses the same test mnemonic each time, imported accounts remain stable between restarts.

## Persistence Rules

To keep all products and transaction history:

- Always run `npm run node:persistent` (not `npm run node`).
- Do not delete `contracts/ganache-db`.
- Use `npm run deploy:local` (reuse mode) after restart.
- Avoid `deploy:local:force` unless you want to reset contract state.

## Restart Without Losing Data

```bash
# Stop servers with Ctrl+C

# Terminal 1
cd contracts
npm run node:persistent

# Terminal 2
cd contracts
npm run deploy:local

# Terminal 3
cd backend
npm run dev

# Terminal 4
cd frontend
npm start
```

## Troubleshooting

- `ECONNREFUSED 127.0.0.1:8545`
  - Start `npm run node:persistent` in `contracts`.
- Products disappeared after restart
  - Ensure you started `node:persistent` and did not delete `contracts/ganache-db`.
  - Ensure you did not run `deploy:local:force`.
- Wrong contract address
  - Run `npm run deploy:local` again to resync `.env.local` files.

## What Gets Auto-Synced

`deploy:local` updates:

- `backend/.env.local`
- `frontend/.env.local`

So backend/frontend always point to the active contract address.
