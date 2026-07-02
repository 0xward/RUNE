import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "out");

// ── Fill in the addresses you already deployed ──────────────────────────────
const RUNETOKEN_ADDRESS = "0x22Af6749E959621e1c3996c7a0ABA55ecd278726";
const RUNEPASS_ADDRESS = "0x9139cF741AA1730BFeE9f8EF1432df31487F211D";

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

  // ── Step 1: Deploy RuneRewards ───────────────────────────────────────────
  console.log("Checking RuneRewards deployment cost...");
  const rewardsArtifact = loadArtifact("RuneRewards");
  const RewardsFactory = new ethers.ContractFactory(rewardsArtifact.abi, rewardsArtifact.bytecode, wallet);
  const rewardsDeployTx = await RewardsFactory.getDeployTransaction(RUNETOKEN_ADDRESS, deployer);
  const rewardsGas = await provider.estimateGas({ ...rewardsDeployTx, from: deployer });
  const rewardsCost = rewardsGas * (feeData.gasPrice || 0n);
  console.log("Estimated cost:", ethers.formatEther(rewardsCost), "ETH");

  if (rewardsCost > balance) {
    console.error("\nStill insufficient balance for RuneRewards. Add a bit more ETH and try again.");
    process.exit(1);
  }

  console.log("Deploying RuneRewards...");
  const runeRewards = await RewardsFactory.deploy(RUNETOKEN_ADDRESS, deployer);
  await runeRewards.waitForDeployment();
  const runeRewardsAddress = await runeRewards.getAddress();
  console.log("✓ RuneRewards deployed at:", runeRewardsAddress);

  balance = await provider.getBalance(deployer);
  console.log("Remaining balance:", ethers.formatEther(balance), "ETH\n");

  // ── Step 2: Connect to RuneToken to transfer community allocation ───────
  const tokenArtifact = loadArtifact("RuneToken");
  const runeToken = new ethers.Contract(RUNETOKEN_ADDRESS, tokenArtifact.abi, wallet);

  console.log("Transferring community allocation to RuneRewards...");
  try {
    const communityAmount = ethers.parseUnits("40000000", 18); // 40,000,000 RUNE
    const transferTx = await runeToken.transfer(runeRewardsAddress, communityAmount);
    await transferTx.wait();
    console.log("✓ Transferred 40,000,000 RUNE to RuneRewards");
  } catch (e) {
    console.warn("Could not transfer community allocation:", e.message);
    console.warn("You can do this manually later.");
  }

  // ── Step 3: Link RunePass so airdrop claims work ────────────────────────
  console.log("\nLinking RunePass to RuneRewards...");
  try {
    const linkTx = await runeRewards.setRunePassContract(RUNEPASS_ADDRESS);
    await linkTx.wait();
    console.log("✓ Linked RunePass to RuneRewards");
  } catch (e) {
    console.warn("Could not link RunePass:", e.message);
    console.warn("You can do this manually later.");
  }

  console.log("\n=== Done ===");
  console.log("RunePass:    ", RUNEPASS_ADDRESS);
  console.log("RuneToken:   ", RUNETOKEN_ADDRESS);
  console.log("RuneRewards: ", runeRewardsAddress);

  fs.writeFileSync(
    path.join(__dirname, "deployed-addresses.json"),
    JSON.stringify(
      { runePass: RUNEPASS_ADDRESS, runeToken: RUNETOKEN_ADDRESS, runeRewards: runeRewardsAddress },
      null,
      2
    )
  );

  console.log("\nAdd these to Vercel:");
  console.log("NEXT_PUBLIC_RUNEPASS_ADDRESS=" + RUNEPASS_ADDRESS);
  console.log("NEXT_PUBLIC_RUNETOKEN_ADDRESS=" + RUNETOKEN_ADDRESS);
  console.log("NEXT_PUBLIC_RUNEREWARDS_ADDRESS=" + runeRewardsAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
