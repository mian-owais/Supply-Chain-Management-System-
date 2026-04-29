const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.resolve(__dirname, "..", "deployment-config.json");
const BACKEND_ENV_PATH = path.resolve(__dirname, "..", "..", "backend", ".env.local");
const FRONTEND_ENV_PATH = path.resolve(__dirname, "..", "..", "frontend", ".env.local");

function loadExistingConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function isContractDeployed(address) {
  if (!address) return false;
  const code = await hre.ethers.provider.getCode(address);
  return code && code !== "0x";
}

function writeLocalEnvFiles(contractAddress) {
  const backendEnv = [
    "BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545",
    `CONTRACT_ADDRESS=${contractAddress}`,
    "PORT=5000",
    "",
  ].join("\n");

  const frontendEnv = [
    `REACT_APP_CONTRACT_ADDRESS=${contractAddress}`,
    "REACT_APP_BACKEND_URL=http://localhost:5000",
    "",
  ].join("\n");

  fs.writeFileSync(BACKEND_ENV_PATH, backendEnv);
  fs.writeFileSync(FRONTEND_ENV_PATH, frontendEnv);
}

function writeDeploymentConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

async function main() {
  const forceDeploy = process.env.FORCE_DEPLOY === "1";
  const existing = loadExistingConfig();

  if (!forceDeploy && existing?.CONTRACT_ADDRESS) {
    const existsOnChain = await isContractDeployed(existing.CONTRACT_ADDRESS);
    if (existsOnChain) {
      console.log("Using existing SupplyChain deployment:", existing.CONTRACT_ADDRESS);
      writeLocalEnvFiles(existing.CONTRACT_ADDRESS);
      console.log("✅ Synced backend/frontend .env.local files");
      console.log("ℹ️ Existing on-chain data is preserved (products, states, history).");
      return;
    }
  }

  console.log("Deploying SupplyChain contract...");

  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const contract = await SupplyChain.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ SupplyChain deployed to:", contractAddress);

  // Get all signers for role assignment
  const [owner, manufacturer, distributor, retailer] = await hre.ethers.getSigners();

  console.log("\n📝 Assigning roles...");
  
  // Assign roles (1 = Manufacturer, 2 = Distributor, 3 = Retailer)
  let tx = await contract.assignRole(manufacturer.address, 1);
  await tx.wait();
  console.log(`✅ Assigned Manufacturer role to: ${manufacturer.address}`);

  tx = await contract.assignRole(distributor.address, 2);
  await tx.wait();
  console.log(`✅ Assigned Distributor role to: ${distributor.address}`);

  tx = await contract.assignRole(retailer.address, 3);
  await tx.wait();
  console.log(`✅ Assigned Retailer role to: ${retailer.address}`);

  console.log("\n🚀 Deployment complete!");
  console.log("\n📋 Contract Configuration:");
  console.log(`Address: ${contractAddress}`);
  console.log(`Owner (Admin): ${owner.address}`);
  console.log(`Manufacturer: ${manufacturer.address}`);
  console.log(`Distributor: ${distributor.address}`);
  console.log(`Retailer: ${retailer.address}`);

  const config = {
    CONTRACT_ADDRESS: contractAddress,
    ADMIN: owner.address,
    MANUFACTURER: manufacturer.address,
    DISTRIBUTOR: distributor.address,
    RETAILER: retailer.address
  };

  writeDeploymentConfig(config);
  writeLocalEnvFiles(contractAddress);
  console.log("\n✅ Configuration saved to deployment-config.json");
  console.log("✅ Synced backend/frontend .env.local files");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
