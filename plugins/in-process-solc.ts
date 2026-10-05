import { definePlugin } from "hardhat/plugins";

export default definePlugin({
  id: "chtcoin:in-process-solc",
  hookHandlers: {
    solidity: () => import("./solc-handler.js"),
  },
});
