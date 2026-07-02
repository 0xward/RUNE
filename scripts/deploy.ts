import { ethers } from "hardhat";

/**
 * Deploys all three RUNE contracts to whichever network Hardhat is pointed
 * at (Base Mainnet or Base Sepolia, depending on the --network flag).
 *
 * Usage:
 *   npx hardhat run scripts/deploy.ts --network base
 *   npx hardhat run scripts/deploy.ts --network baseSepolia
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Deploying from:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  console.log("");

  // ── Step 1: Deploy RunePass ──────────────────────────────────────────────
  console.log("Deploying RunePass...");
  const RunePass = await ethers.getContractFactory("RunePass");
  const runePass = await RunePass.deploy(deployer.address);
  await runePass.waitForDeployment();
  const runePassAddress = await runePass.getAddress();
  console.log("RunePass deployed at:", runePassAddress);
  console.log("");

  // ── Step 2: Deploy RuneToken ─────────────────────────────────────────────
  // For now, the deployer wallet receives the community and ecosystem
  // allocations too. The community allocation is transferred to
  // RuneRewards in Step 4 below.
  console.log("Deploying RuneToken...");
  const RuneToken = await ethers.getContractFactory("RuneToken");
  const runeToken = await RuneToken.deploy(
    deployer.address, // founder wallet
    deployer.address, // community wallet (temporary, moved to RuneRewards next)
    deployer.address, // ecosystem wallet
    deployer.address  // liquidity wallet
  );
  await runeToken.waitForDeployment();
  const runeTokenAddress = await runeToken.getAddress();
  console.log("RuneToken deployed at:", runeTokenAddress);
  console.log("");

  // ── Step 3: Deploy RuneRewards ───────────────────────────────────────────
  console.log("Deploying RuneRewards...");
  const RuneRewards = await ethers.getContractFactory("RuneRewards");
  const runeRewards = await RuneRewards.deploy(runeTokenAddress, deployer.address);
  await runeRewards.waitForDeployment();
  const runeRewardsAddress = await runeRewards.getAddress();
  console.log("RuneRewards deployed at:", runeRewardsAddress);
  console.log("");

  // ── Step 4: Move community allocation into RuneRewards ───────────────────
  console.log("Transferring community allocation to RuneRewards...");
  const communityAmount = await runeToken.COMMUNITY_ALLOCATION();
  const transferTx = await runeToken.transfer(runeRewardsAddress, communityAmount);
  await transferTx.wait();
  console.log("Transferred", ethers.formatEther(communityAmount), "RUNE");
  console.log("");

  // ── Step 5: Link RunePass to RuneRewards for airdrop checks ──────────────
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
