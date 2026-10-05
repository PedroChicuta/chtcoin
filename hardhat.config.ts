import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";
import { fileURLToPath } from "node:url";
import inProcessSolc from "./plugins/in-process-solc.js";

const caminhoSolcLocal = fileURLToPath(new URL("./node_modules/solc/soljson.js", import.meta.url));

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers, inProcessSolc],
  solidity: {
    version: "0.8.31",
    path: caminhoSolcLocal,
  },
  networks: {
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
