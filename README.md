# Supply Chain Management - Full Stack

A complete blockchain-based supply chain management system built with Solidity, React, and Node.js.

## Project Structure

```
supply-chain-full-stack/
├── contracts/           # Solidity smart contract
├── backend/            # Express.js API server
├── frontend/           # React web interface
└── README.md
```

## Features

✅ **Smart Contract**

- Role-based access control (Manufacturer, Distributor, Retailer)
- Product lifecycle tracking
- Immutable transaction history
- Audit trail for transparency

✅ **Backend API**

- RESTful endpoints for product queries
- User role verification
- Contract interaction abstraction
- CORS enabled for frontend

✅ **Frontend UI**

- Dashboard with product listing
- Create new products
- Track product status updates
- View complete supply chain history
- MetaMask wallet integration
- Role-based management

## Prerequisites

- Node.js (v16+)
- MetaMask browser extension

## Setup Instructions

### 1. Start Local Persistent Blockchain and Deploy Contract

```bash
cd contracts
npm install
npm run node:persistent

# In another terminal
cd contracts
npm run deploy:local
```

`deploy:local` auto-syncs `.env.local` files in backend and frontend.

### 2. Start Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Update with your contract address and RPC URL

# Start server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Start Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Update with contract address

# Start React dev server
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Assign Roles**: Admin assigns Manufacturer, Distributor, Retailer roles
3. **Create Product**: Manufacturer creates new products
4. **Ship Product**: Distributor ships products
5. **Receive Product**: Retailer receives products
6. **Sell Product**: Retailer sells to end customer
7. **Track History**: View complete audit trail for any product

## Transaction Flow

```
Manufacturer Creates Product
           ↓
Distributor Ships Product (InTransit)
           ↓
Retailer Receives Product (Delivered)
           ↓
Retailer Sells Product (Sold)
```

## Technologies Used

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contract**: Solidity ^0.8.20
- **Frontend**: React 18, Web3.js
- **Backend**: Express.js, Node.js
- **Wallet Integration**: MetaMask
- **Styling**: CSS3

## API Endpoints

### GET /api/products

Get all products

### GET /api/products/:id

Get specific product details

### GET /api/user/:address/role

Get user's assigned role

### GET /api/health

Health check

## Team Members

Add your group members' names here:

1. Member 1
2. Member 2
3. Member 3
4. Member 4

## Presentation Demo Script

1. Show contract code and explain role-based system
2. Create a product as Manufacturer
3. Ship product as Distributor
4. Receive as Retailer
5. Show transaction history on blockchain
6. Demonstrate UI features and dashboard

## Future Enhancements

- QR code generation for products
- GPS location tracking
- IoT sensor integration
- Real-time notifications
- Analytics dashboard
- Mobile app version
- Multi-signature contracts for admin functions
