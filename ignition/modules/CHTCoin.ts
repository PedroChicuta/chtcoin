import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CHTCoinModule", (m) => {
  const fornecimentoInicial = m.getParameter("fornecimentoInicial", 1_000_000n);
  const chtCoin = m.contract("CHTCoin", [fornecimentoInicial]);

  return { chtCoin };
});
