const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Web3 } = require('web3');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Web3 Setup
const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY');

// Contract Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ARTIFACT = require('./abi/SupplyChain.json');
const CONTRACT_ABI = Array.isArray(CONTRACT_ARTIFACT)
  ? CONTRACT_ARTIFACT
  : CONTRACT_ARTIFACT.abi;

function normalizeProduct(product) {
  // Web3 can return both numeric tuple indexes and named object fields.
  return {
    id: product.productId ?? product[0],
    name: product.name ?? product[1],
    manufacturer: product.manufacturer ?? product[2],
    currentOwner: product.currentOwner ?? product[3],
    state: product.currentState ?? product[4],
    createdAt: product.createdAt ?? product[5],
  };
}

let contract;
if (CONTRACT_ADDRESS && CONTRACT_ABI) {
  contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
}

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    if (!contract) return res.status(400).json({ error: 'Contract not initialized' });
    
    const productCount = await contract.methods.productCount().call();
    const products = [];
    
    for (let i = 1; i <= productCount; i++) {
      const product = await contract.methods.getProduct(i).call();
      const history = await contract.methods.getHistory(i).call();

      products.push({
        ...normalizeProduct(product),
        history,
      });
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific product
app.get('/api/products/:id', async (req, res) => {
  try {
    if (!contract) return res.status(400).json({ error: 'Contract not initialized' });
    
    const product = await contract.methods.getProduct(req.params.id).call();
    const history = await contract.methods.getHistory(req.params.id).call();

    res.json({
      ...normalizeProduct(product),
      history,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user role
app.get('/api/user/:address/role', async (req, res) => {
  try {
    if (!contract) return res.status(400).json({ error: 'Contract not initialized' });
    
    const role = await contract.methods.getUserRole(req.params.address).call();
    const roleMap = { 0: 'None', 1: 'Manufacturer', 2: 'Distributor', 3: 'Retailer' };
    
    res.json({ address: req.params.address, role: roleMap[role] });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    contractInitialized: !!contract,
    contractAddress: CONTRACT_ADDRESS || 'Not configured'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
