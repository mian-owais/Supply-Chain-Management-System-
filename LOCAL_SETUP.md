# Local Development Setup

Run the entire project on localhost with a Hardhat local blockchain node.

## Prerequisites

- Node.js v16+
- npm

## 🚀 Quick Start (3 Steps)

### Step 1: Deploy Smart Contract to Local Node

```bash
# Terminal 1: Start Hardhat node
cd contracts
npm install
npm run node
```

Leave this terminal running. The node will be at `http://127.0.0.1:8545`

### Step 2: Deploy Contract (New Terminal)

```bash
# Terminal 2: Deploy contract
cd contracts
npm run deploy:local
```

You'll see output like:
```
✅ SupplyChain deployed to: 0x5FbDB2315678afccb333f8a9c3a94e1f93944d44

📝 Assigning roles...
✅ Assigned Manufacturer role to: 0x70997970C51812e339D9B73b0245ad59719f5a08
✅ Assigned Distributor role to: 0x3C44CdDdB6a900556239b2C04767eF4007a0b2B
✅ Assigned Retailer role to: 0x14dC79964da2C08b23698B3D3cc7ca32193d9955
```

**Copy the contract address** (you'll need it next)

### Step 3: Start Backend and Frontend (New Terminals)

```bash
# Terminal 3: Start Backend
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

```bash
# Terminal 4: Start Frontend
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🔧 Configure MetaMask

1. **Add Local Network to MetaMask:**
   - Open MetaMask → Settings → Networks → Add Network
   - Network name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Import Test Accounts:**
   - When you run `npm run node`, Hardhat displays accounts with private keys
   - In MetaMask: Account menu → Import Account
   - Copy-paste the private key (without `0x` prefix)
   - Repeat for Manufacturer, Distributor, and Retailer accounts

3. **Get Test ETH:**
   - Hardhat local accounts start with 10,000 ETH each
   - No faucet needed!

---

## 📋 Test Accounts

After running `npm run node`, you'll see accounts like:

```
Account #0: 0x1234... (Admin - 10000 ETH)
Account #1: 0x5678... (Manufacturer - 10000 ETH)
Account #2: 0x90ab... (Distributor - 10000 ETH)
Account #3: 0xcdef... (Retailer - 10000 ETH)
```

Each account has private key displayed. Save them!

---

## 🧪 Test the System

1. **Switch to Manufacturer account** in MetaMask
2. Go to `http://localhost:3000`
3. Click "Connect Wallet"
4. Create a product
5. Switch to Distributor account
6. Ship the product
7. Switch to Retailer account
8. Receive and Sell the product
9. View the complete history!

---

## 📊 View Transactions

### Terminal Logs
- **Hardhat Node Terminal**: Shows all transaction details
- **Backend Terminal**: Shows API calls
- **Frontend Console**: Browser developer tools (F12)

### Check Block Explorer (Local)

Visit `http://127.0.0.1:8545` for RPC status (basic)

---

## 🔄 Redeploying

If you need to restart everything:

```bash
# Stop all terminals (Ctrl+C)

# Terminal 1: Fresh node
cd contracts
npm run node

# Terminal 2: Redeploy
cd contracts
npm run deploy:local

# Terminal 3 & 4: Restart backend and frontend
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Make sure `npm run node` is running in Terminal 1 |
| MetaMask stuck | Switch networks → back, or restart MetaMask |
| "Wrong contract address" | Update `.env.local` values in both backend and frontend |
| "Insufficient funds" | Use a different test account (they all have 10,000 ETH) |
| Frontend shows "Not Connected" | Check MetaMask is on Hardhat Local network |

---

## 📁 Environment Files

Auto-configured for local development:

**backend/.env.local**
```
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c3a94e1f93944d44
PORT=5000
```

**frontend/.env.local**
```
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c3a94e1f93944d44
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## ✅ You're Done!

You now have a fully functional supply chain system running locally with:
- ✅ Hardhat blockchain at `localhost:8545`
- ✅ Smart contract deployed with pre-assigned roles
- ✅ Backend API at `localhost:5000`
- ✅ React frontend at `localhost:3000`

Ready for development, testing, and your presentation demo!
