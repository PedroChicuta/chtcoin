import type { SolidityHooks } from "hardhat/types/hooks";
import type { Compiler } from "hardhat/types/solidity";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const solc = require("solc") as {
  version: () => string;
  compile: (input: string) => string;
};

const compilerPath = fileURLToPath(new URL("../node_modules/solc/soljson.js", import.meta.url));

export default async (): Promise<Partial<SolidityHooks>> => ({
  getCompiler: async (context, compilerConfig, next): Promise<Compiler> => {
    if (compilerConfig.type !== undefined && compilerConfig.type !== "solc") {
      return next(context, compilerConfig);
    }

    const versaoInstalada = solc.version().split("+")[0];
    if (versaoInstalada !== compilerConfig.version) {
      throw new Error(
        `solc instalado (${versaoInstalada}) difere do configurado (${compilerConfig.version}).`,
      );
    }

    return {
      version: compilerConfig.version,
      longVersion: solc.version(),
      compilerPath,
      isSolcJs: true,
      async compile(input) {
        return JSON.parse(solc.compile(JSON.stringify(input)));
      },
    };
  },
});
