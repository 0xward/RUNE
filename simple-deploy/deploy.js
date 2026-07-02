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
  console.log("");

  // ── Step 1: Deploy RunePass ──────────────────────────────────────────────
  console.log("Deploying RunePass...");
  const runePassArtifact = loadArtifact("RunePass");
  const RunePassFactory = new ethers.ContractFactory(
    runePassArtifact.abi,
    runePassArtifact.bytecode,
    wallet
  );
  const runePass = await RunePassFactory.deploy(deployer);
  await runePass.waitForDeployment();
  const runePassAddress = await runePass.getAddress();
  console.log("RunePass deployed at:", runePassAddress);
  console.log("");

  // ── Step 2: Deploy RuneToken ─────────────────────────────────────────────
  console.log("Deploying RuneToken...");
  const runeTokenArtifact = loadArtifact("RuneToken");
  const RuneTokenFactory = new ethers.ContractFactory(
    runeTokenArtifact.abi,
    runeTokenArtifact.bytecode,
    wallet
  );
  const runeToken = await RuneTokenFactory.deploy(deployer, deployer, deployer, deployer);
  await runeToken.waitForDeployment();
  const runeTokenAddress = await runeToken.getAddress();
  console.log("RuneToken deployed at:", runeTokenAddress);
  console.log("");

  // ── Step 3: Deploy RuneRewards ───────────────────────────────────────────
  console.log("Deploying RuneRewards...");
  const runeRewardsArtifact = loadArtifact("RuneRewards");
  const RuneRewardsFactory = new ethers.ContractFactory(
    runeRewardsArtifact.abi,
    runeRewardsArtifact.bytecode,
    wallet
  );
  const runeRewards = await RuneRewardsFactory.deploy(runeTokenAddress, deployer);
  await runeRewards.waitForDeployment();
  const runeRewardsAddress = await runeRewards.getAddress();
  console.log("RuneRewards deployed at:", runeRewardsAddress);
  console.log("");

  // ── Step 4: Transfer community allocation to RuneRewards ────────────────
  console.log("Transferring community allocation...");
  const communityAmount = await runeToken.COMMUNITY_ALLOCATION();
  const transferTx = await runeToken.transfer(runeRewardsAddress, communityAmount);
  await transferTx.wait();
  console.log("Transferred:", ethers.formatEther(communityAmount), "RUNE");
  console.log("");

  // ── Step 5: Link RunePass to RuneRewards ─────────────────────────────────
  console.log("Linking RunePass to RuneRewards...");
  const linkTx = await runeRewards.setRunePassContract(runePassAddress);
  await linkTx.wait();
  console.log("Linked.");
  console.log("");

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("=== Deployment complete ===");
  console.log("RunePass:    ", runePassAddress);
  console.log("RuneToken:   ", runeTokenAddress);
  console.log("RuneRewards: ", runeRewardsAddress);
  console.log("");
  console.log("Add these to your Vercel environment variables:");
  console.log("NEXT_PUBLIC_RUNEPASS_ADDRESS=" + runePassAddress);
  console.log("NEXT_PUBLIC_RUNETOKEN_ADDRESS=" + runeTokenAddress);
  console.log("NEXT_PUBLIC_RUNEREWARDS_ADDRESS=" + runeRewardsAddress);

  // Save addresses to file too
  fs.writeFileSync(
    path.join(__dirname, "deployed-addresses.json"),
    JSON.stringify(
      { runePass: runePassAddress, runeToken: runeTokenAddress, runeRewards: runeRewardsAddress },
      null,
      2
    )
  );
  console.log("\nAlso saved to deployed-addresses.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
