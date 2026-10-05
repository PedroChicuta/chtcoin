import { Contract, JsonRpcProvider, formatUnits, getAddress } from "ethers";

const [enderecoContratoInformado, enderecoCarteiraInformado] = process.argv.slice(2);

if (enderecoContratoInformado === undefined) {
  console.error("Uso: node scripts/verificar-local.mjs <endereco-do-contrato> [endereco-da-carteira]");
  process.exit(2);
}

const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function owner() view returns (address)",
  "function balanceOf(address) view returns (uint256)",
];

try {
  const enderecoContrato = getAddress(enderecoContratoInformado);
  const provider = new JsonRpcProvider("http://127.0.0.1:8545");
  const rede = await provider.getNetwork();

  if (rede.chainId !== 31337n) {
    throw new Error(`Chain ID inesperado: ${rede.chainId}. Esperado: 31337.`);
  }

  if ((await provider.getCode(enderecoContrato)) === "0x") {
    throw new Error("Nenhum contrato encontrado nesse endereço. Confira o deploy e se o nó local foi reiniciado.");
  }

  const token = new Contract(enderecoContrato, abi, provider);
  const [nome, simbolo, casasDecimais, fornecimento, dono] = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals(),
    token.totalSupply(),
    token.owner(),
  ]);

  if (nome !== "CHTCoin" || simbolo !== "CHT") {
    throw new Error(`Token inesperado: ${nome} (${simbolo}).`);
  }

  const enderecoCarteira = enderecoCarteiraInformado
    ? getAddress(enderecoCarteiraInformado)
    : dono;
  const saldo = await token.balanceOf(enderecoCarteira);

  console.log(`Rede: Hardhat Local (${rede.chainId})`);
  console.log(`Contrato: ${enderecoContrato}`);
  console.log(`Token: ${nome} (${simbolo}), ${casasDecimais} casas decimais`);
  console.log(`Proprietário: ${dono}`);
  console.log(`Fornecimento total: ${formatUnits(fornecimento, casasDecimais)} ${simbolo}`);
  console.log(`Saldo de ${enderecoCarteira}: ${formatUnits(saldo, casasDecimais)} ${simbolo}`);
} catch (error) {
  console.error(`Falha na verificação local: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
}
