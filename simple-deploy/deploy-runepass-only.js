import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "out");

function loadArtifact(name) {
  const raw = fs.readFileSync(path.join(OUT_DIR, `${name}.json`), "utf8");
  return JSON.parse(raw);
}

async function main() {
  const RPC_URL = process.env.BASE_RPC_URL || "https://mainnet.base.org";
  const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    console.error("Missing DEPLOYER_PRIVATE_KEY in .env");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const deployer = wallet.address;

  const balance = await provider.getBalance(deployer);
  console.log("Deploying from:", deployer);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  // Check current gas price before deploying
  const feeData = await provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "Gwei");
  console.log("");

  console.log("Deploying RunePass...");
  const artifact = loadArtifact("RunePass");
  const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Estimate gas first so we know the cost before committing
  const deployTx = await Factory.getDeployTransaction(deployer);
  const estimatedGas = await provider.estimateGas({ ...deployTx, from: deployer });
  const estimatedCost = estimatedGas * (feeData.gasPrice || 0n);

  console.log("Estimated gas:", estimatedGas.toString());
  console.log("Estimated cost:", ethers.formatEther(estimatedCost), "ETH");

  if (estimatedCost > balance) {
    console.error("\nInsufficient balance to deploy. Need more ETH.");
    process.exit(1);
  }

  console.log("\nProceeding with deployment...");
  const contract = await Factory.deploy(deployer);
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✓ RunePass deployed at:", address);

  const receipt = await provider.getTransactionReceipt(contract.deploymentTransaction().hash);
  console.log("Actual gas used:", receipt.gasUsed.toString());
  console.log("Actual cost:", ethers.formatEther(receipt.gasUsed * receipt.gasPrice), "ETH");

  const remainingBalance = await provider.getBalance(deployer);
  console.log("\nRemaining balance:", ethers.formatEther(remainingBalance), "ETH");

  fs.writeFileSync(
    path.join(__dirname, "deployed-addresses.json"),
    JSON.stringify({ runePass: address }, null, 2)
  );

  console.log("\nAdd this to Vercel:");
  console.log("NEXT_PUBLIC_RUNEPASS_ADDRESS=" + address);
  console.log("\nSaved to deployed-addresses.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
