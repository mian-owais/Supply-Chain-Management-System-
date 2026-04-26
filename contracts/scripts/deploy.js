const hre = require("hardhat");

async function main() {
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

  // Save configuration to file
  const fs = require("fs");
  const config = {
    CONTRACT_ADDRESS: contractAddress,
    ADMIN: owner.address,
    MANUFACTURER: manufacturer.address,
    DISTRIBUTOR: distributor.address,
    RETAILER: retailer.address
  };

  fs.writeFileSync(
    "./deployment-config.json",
    JSON.stringify(config, null, 2)
  );
  console.log("\n✅ Configuration saved to deployment-config.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
