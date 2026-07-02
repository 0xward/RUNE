import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const solc = require("solc");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTRACTS_DIR = path.join(__dirname, "contracts");
const NODE_MODULES = path.join(__dirname, "node_modules");
const OUT_DIR = path.join(__dirname, "out");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

console.log("Using solc version:", solc.version());

// Resolves imports like "@openzeppelin/contracts/..." from node_modules
function findImports(importPath) {
  try {
    let fullPath;
    if (importPath.startsWith("@openzeppelin/")) {
      fullPath = path.join(NODE_MODULES, importPath);
    } else {
      fullPath = path.join(CONTRACTS_DIR, importPath);
    }
    const contents = fs.readFileSync(fullPath, "utf8");
    return { contents };
  } catch (e) {
    return { error: "File not found: " + importPath };
  }
}

// Different solc-js versions expect the import callback passed differently.
// This tries the modern pattern first, then falls back to the legacy one.
function compileWithFallback(inputJson) {
  try {
    return solc.compile(inputJson, { import: findImports });
  } catch (errModern) {
    try {
      return solc.compile(inputJson, findImports);
    } catch (errLegacy) {
      console.error("Both compile call patterns failed.");
      console.error("Modern pattern error:", errModern.message);
      console.error("Legacy pattern error:", errLegacy.message);
      throw errLegacy;
    }
  }
}

function compileContract(fileName) {
  const filePath = path.join(CONTRACTS_DIR, fileName);
  const source = fs.readFileSync(filePath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      [fileName]: { content: source },
    },
    settings: {
      evmVersion: "paris",
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
        },
      },
    },
  };

  console.log(`\nCompiling ${fileName}...`);
  const rawOutput = compileWithFallback(JSON.stringify(input));
  const output = JSON.parse(rawOutput);

  if (output.errors) {
    let hasError = false;
    for (const err of output.errors) {
      if (err.severity === "error") {
        hasError = true;
        console.error("ERROR:", err.formattedMessage);
      } else {
        console.warn("WARNING:", err.formattedMessage);
      }
    }
    if (hasError) {
      process.exit(1);
    }
  }

  const contractName = fileName.replace(".sol", "");

  if (!output.contracts || !output.contracts[fileName] || !output.contracts[fileName][contractName]) {
    console.error("Compilation produced no output for", fileName);
    console.error("Full output:", JSON.stringify(output, null, 2).slice(0, 2000));
    process.exit(1);
  }

  const compiled = output.contracts[fileName][contractName];

  const result = {
    abi: compiled.abi,
    bytecode: "0x" + compiled.evm.bytecode.object,
  };

  fs.writeFileSync(
    path.join(OUT_DIR, `${contractName}.json`),
    JSON.stringify(result, null, 2)
  );

  console.log(`✓ Compiled ${contractName} → out/${contractName}.json`);
  return result;
}

// Compile all three contracts
compileContract("RunePass.sol");
compileContract("RuneToken.sol");
compileContract("RuneRewards.sol");

console.log("\nAll contracts compiled successfully.");
