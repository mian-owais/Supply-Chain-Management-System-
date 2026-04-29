import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import ManageRoles from './pages/ManageRoles';

const LOCAL_ROLE_MAP = {
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266': 'Admin',
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8': 'Manufacturer',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc': 'Distributor',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906': 'Retailer',
};

const HARDHAT_CHAIN_HEX = '0x7a69'; // 31337
const HARDHAT_NETWORK_PARAMS = {
  chainId: HARDHAT_CHAIN_HEX,
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
};

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [userRole, setUserRole] = useState('None');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    initWeb3();
  }, []);

  const ensureHardhatNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_CHAIN_HEX }],
      });
    } catch (switchError) {
      // 4902 = chain is not added in MetaMask
      if (switchError?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [HARDHAT_NETWORK_PARAMS],
        });
      } else {
        throw switchError;
      }
    }
  };

  const initWeb3 = async () => {
    try {
      if (window.ethereum) {
        await ensureHardhatNetwork();
        const web3Instance = new Web3(window.ethereum);
        
        // First, try to get already connected accounts
        let accounts = await web3Instance.eth.getAccounts();
        
        // If no accounts are connected, request them
        if (accounts.length === 0) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          accounts = await web3Instance.eth.getAccounts();
        }
        
        if (accounts.length > 0) {
          const userAccount = accounts[0];
          setAccount(userAccount);
          setWeb3(web3Instance);
          setUserRole(LOCAL_ROLE_MAP[userAccount.toLowerCase()] || 'None');
          
          // Initialize contract (supports both full Hardhat artifact and plain ABI array)
          const abiModule = require('./abi/SupplyChain.json');
          const abi = Array.isArray(abiModule) ? abiModule : abiModule?.abi;
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
          
          if (contractAddress && Array.isArray(abi)) {
            try {
              const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
              setContract(contractInstance);
            } catch (err) {
              console.error("Failed to fetch role or initialize contract:", err);
            }
          }
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', function (newAccounts) {
            if (newAccounts.length === 0) {
              setAccount(null);
              setUserRole('None');
            } else {
              window.location.reload();
            }
          });

          // Keep app and wallet network in sync for local testing
          window.ethereum.on('chainChanged', function () {
            window.location.reload();
          });
        }
      } else {
        alert('Please install MetaMask or use a Web3-enabled browser');
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
    }
  };

  const connectWallet = async () => {
    try {
      await initWeb3();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar account={account} userRole={userRole} connectWallet={connectWallet} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard web3={web3} account={account} contract={contract} />} />
            <Route path="/product/:id" element={<ProductDetail account={account} contract={contract} userRole={userRole} />} />
            <Route path="/create-product" element={<CreateProduct account={account} contract={contract} userRole={userRole} />} />
            <Route path="/manage-roles" element={<ManageRoles account={account} contract={contract} userRole={userRole} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
