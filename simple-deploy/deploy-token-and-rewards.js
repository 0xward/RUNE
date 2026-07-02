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

  let balance = await provider.getBalance(deployer);
  console.log("Deploying from:", deployer);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  const feeData = await provider.getFeeData();
  console.log("Current gas price:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "Gwei\n");

  // ── Step 1: Estimate RuneToken cost ──────────────────────────────────────
  console.log("Checking RuneToken deployment cost...");
  const tokenArtifact = loadArtifact("RuneToken");
  const TokenFactory = new ethers.ContractFactory(tokenArtifact.abi, tokenArtifact.bytecode, wallet);
  const tokenDeployTx = await TokenFactory.getDeployTransaction(deployer, deployer, deployer, deployer);
  const tokenGas = await provider.estimateGas({ ...tokenDeployTx, from: deployer });
  const tokenCost = tokenGas * (feeData.gasPrice || 0n);
  console.log("Estimated cost:", ethers.formatEther(tokenCost), "ETH");

  if (tokenCost > balance) {
    console.error("\nInsufficient balance for RuneToken. Stopping here — RunePass remains deployed and usable.");
    process.exit(1);
  }

  console.log("Deploying RuneToken...");
  const runeToken = await TokenFactory.deploy(deployer, deployer, deployer, deployer);
  await runeToken.waitForDeployment();
  const runeTokenAddress = await runeToken.getAddress();
  console.log("✓ RuneToken deployed at:", runeTokenAddress);

  balance = await provider.getBalance(deployer);
  console.log("Remaining balance:", ethers.formatEther(balance), "ETH\n");

  // ── Step 2: Estimate RuneRewards cost ────────────────────────────────────
  console.log("Checking RuneRewards deployment cost...");
  const rewardsArtifact = loadArtifact("RuneRewards");
  const RewardsFactory = new ethers.ContractFactory(rewardsArtifact.abi, rewardsArtifact.bytecode, wallet);
  const rewardsDeployTx = await RewardsFactory.getDeployTransaction(runeTokenAddress, deployer);
  const rewardsGas = await provider.estimateGas({ ...rewardsDeployTx, from: deployer });
  const rewardsCost = rewardsGas * (feeData.gasPrice || 0n);
  console.log("Estimated cost:", ethers.formatEther(rewardsCost), "ETH");

  if (rewardsCost > balance) {
    console.error("\nInsufficient balance for RuneRewards. RuneToken is deployed, but RuneRewards will need to wait.");
    fs.writeFileSync(
      path.join(__dirname, "deployed-addresses.json"),
      JSON.stringify({ runeToken: runeTokenAddress }, null, 2)
    );
    console.log("\nAdd this to Vercel:");
    console.log("NEXT_PUBLIC_RUNETOKEN_ADDRESS=" + runeTokenAddress);
    process.exit(0);
  }

  console.log("Deploying RuneRewards...");
  const runeRewards = await RewardsFactory.deploy(runeTokenAddress, deployer);
  await runeRewards.waitForDeployment();
  const runeRewardsAddress = await runeRewards.getAddress();
  console.log("✓ RuneRewards deployed at:", runeRewardsAddress);

  balance = await provider.getBalance(deployer);
  console.log("Remaining balance:", ethers.formatEther(balance), "ETH\n");

  // ── Step 3: Wire community allocation + link RunePass (only if enough left) ──
  const communityAmount = await runeToken.COMMUNITY_ALLOCATION();

  console.log("Transferring community allocation to RuneRewards...");
  try {
    const transferTx = await runeToken.transfer(runeRewardsAddress, communityAmount);
    await transferTx.wait();
    console.log("✓ Transferred", ethers.formatEther(communityAmount), "RUNE");

    const linkTx = await runeRewards.setRunePassContract(process.env.RUNEPASS_ADDRESS || "");
    await linkTx.wait();
    console.log("✓ Linked RunePass to RuneRewards");
  } catch (e) {
    console.warn("Could not complete wiring steps (this is OK, can be done later):", e.message);
  }

  console.log("\n=== Done ===");
  console.log("RuneToken:   ", runeTokenAddress);
  console.log("RuneRewards: ", runeRewardsAddress);

  fs.writeFileSync(
    path.join(__dirname, "deployed-addresses.json"),
    JSON.stringify({ runeToken: runeTokenAddress, runeRewards: runeRewardsAddress }, null, 2)
  );

  console.log("\nAdd these to Vercel:");
  console.log("NEXT_PUBLIC_RUNETOKEN_ADDRESS=" + runeTokenAddress);
  console.log("NEXT_PUBLIC_RUNEREWARDS_ADDRESS=" + runeRewardsAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
