# CHTCoin

Projeto da atividade **Minha Criptomoeda**: token ERC-20 feito com OpenZeppelin, Hardhat 3, TypeScript, Mocha e Ethers.js.

**Caminho escolhido para a atividade: A — deploy na rede local Hardhat e visualização na MetaMask.** O Caminho B (Sepolia) não faz parte da entrega planejada; não são necessários RPC externo, ETH de teste nem link do Etherscan.

O contrato `CHTCoin` usa o símbolo `CHT`. O fornecimento inicial padrão é **1.000.000 de tokens**, valor provisório até a escolha do aluno. Ele pode ser alterado antes do deploy em `ignition/modules/CHTCoin.ts`. A conta que implanta o contrato recebe esse fornecimento e se torna proprietária. Apenas ela pode chamar `mint` para emitir mais tokens.

## Instalação e testes

Na pasta `chtcoin`, com Node.js compatível com Hardhat 3, instale as dependências. O projeto inclui um `pnpm-lock.yaml` para reproduzir as versões testadas:

```bash
pnpm install
npx hardhat compile
npx hardhat test
```

Se você usa apenas npm, `npm install` também instala as dependências declaradas em `package.json`. A configuração aponta para o compilador `solc` instalado no projeto.

No contrato, `decimals()` retorna 18. O construtor e `mint` recebem quantidades de tokens inteiros e as convertem para as unidades mínimas usadas pelo ERC-20. Por exemplo, `mint(endereco, 50)` emite 50 tokens, enquanto uma chamada direta a `transfer` espera `50 * 10 ** 18` unidades mínimas.

## Caminho A escolhido: deploy local

Execute os comandos abaixo na pasta `chtcoin`. No primeiro terminal, inicie o nó e **mantenha-o aberto**:

```bash
npx hardhat node
```

No segundo terminal, faça o deploy:

```bash
npx hardhat ignition deploy ignition/modules/CHTCoin.ts --network localhost
```

Copie o endereço exibido em `Deployed Addresses` e confira o contrato, a rede e o saldo da conta administradora:

```bash
node scripts/verificar-local.mjs ENDERECO_DO_CONTRATO
```

O verificador deve mostrar `Hardhat Local (31337)`, `CHTCoin (CHT)`, o endereço do proprietário e o saldo. Na MetaMask, adicione a rede com RPC `http://127.0.0.1:8545`, Chain ID `31337` e símbolo `ETH`. Importe a **conta de teste** impressa pelo nó local cujo endereço é igual ao proprietário mostrado pelo verificador. Depois, na mesma rede e conta, escolha **Importar tokens** e cole o endereço do contrato. O saldo do token deverá aparecer na carteira.

Se fechar e reiniciar o nó, a blockchain local será recriada. Faça um novo deploy, use o novo endereço no verificador e importe esse endereço na MetaMask. Caso o Ignition tente reaproveitar um deploy anterior, passe um novo `--deployment-id`, por exemplo `chtcoin-local-02`. As chaves impressas pelo nó são apenas para testes e não devem guardar ativos reais.

Neste ambiente de execução do agente, a abertura de portas locais é bloqueada (`EPERM`). Por isso, a etapa de nó RPC e MetaMask deve ser feita no terminal do aluno. A compilação, os cinco testes e o deploy Ignition em rede simulada já foram validados.

O projeto ainda contém uma configuração de rede Sepolia, mas ela não precisa ser usada para concluir o Caminho A. O endereço local deve ser identificado como tal na entrega; ele não terá uma página no Sepolia Etherscan.
