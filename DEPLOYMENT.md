# Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Get Sepolia Testnet ETH

1. Go to [Sepolia Faucet](https://sepoliafaucet.com)
2. Enter your MetaMask wallet address
3. Claim test ETH

### 2. Set Up Infura RPC

1. Create account at [Infura.io](https://infura.io)
2. Create new project
3. Copy Sepolia RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### 3. Deploy Smart Contract

**Create `contracts/hardhat.config.js`:**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

**Create `contracts/.env`:**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```

**Deploy Script `contracts/scripts/deploy.js`:**
```javascript
const hre = require("hardhat");

async function main() {
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const contract = await SupplyChain.deploy();
  await contract.deployed();
  
  console.log("SupplyChain deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

**Deploy:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Get Contract ABI

After deployment, save ABI to both backend and frontend:
- `backend/abi/SupplyChain.json`
- `frontend/src/abi/SupplyChain.json`

### 5. Configure Environment Files

**backend/.env:**
```
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x...deployed_address...
PORT=5000
```

**frontend/.env:**
```
REACT_APP_CONTRACT_ADDRESS=0x...deployed_address...
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 6. Assign Initial Roles

Use contract's `assignRole()` function:
- Admin assigns Manufacturer to address 1
- Admin assigns Distributor to address 2
- Admin assigns Retailer to address 3

### 7. Test the System

1. Switch to Manufacturer account
2. Create a product
3. Switch to Distributor account
4. Ship the product
5. Switch to Retailer account
6. Receive the product
7. Sell the product

## Contract Verification (Optional)

Verify on Sepolia Etherscan for transparency:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## Testing Locally (Hardhat Network)

For faster testing without gas fees:

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Configure MetaMask to use http://127.0.0.1:8545
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MetaMask not detecting contract | Verify contract address is correct, clear MetaMask cache |
| Transaction fails | Ensure account has ETH for gas, correct role assigned |
| Backend can't call contract | Check RPC URL, contract address, and ABI |
| Frontend shows "Not admin" | Ensure current account is contract owner |

## Production Considerations

- Use environment variable for private keys (never commit)
- Implement access control improvements
- Add event monitoring
- Set up automated alerts
- Regular security audits
- Implement backup smart contract upgrades
