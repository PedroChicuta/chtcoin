import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("CHTCoin", function () {
  const fornecimentoInicial = 1_000_000n;
  const umaUnidade = 10n ** 18n;

  async function implantarFixture() {
    const [dono, outraConta] = await ethers.getSigners();
    const token = await ethers.deployContract("CHTCoin", [fornecimentoInicial]);
    await token.waitForDeployment();
    return { token, dono, outraConta };
  }

  it("tem nome, símbolo e 18 casas decimais", async function () {
    const { token } = await networkHelpers.loadFixture(implantarFixture);
    expect(await token.name()).to.equal("CHTCoin");
    expect(await token.symbol()).to.equal("CHT");
    expect(await token.decimals()).to.equal(18n);
  });

  it("entrega todo o fornecimento inicial ao dono", async function () {
    const { token, dono } = await networkHelpers.loadFixture(implantarFixture);
    const fornecimentoEmUnidadesMinimas = fornecimentoInicial * umaUnidade;
    expect(await token.owner()).to.equal(dono.address);
    expect(await token.totalSupply()).to.equal(fornecimentoEmUnidadesMinimas);
    expect(await token.balanceOf(dono.address)).to.equal(fornecimentoEmUnidadesMinimas);
  });

  it("transfere 100 tokens inteiros para outra conta", async function () {
    const { token, dono, outraConta } = await networkHelpers.loadFixture(implantarFixture);
    const quantidade = 100n * umaUnidade;
    await expect(token.transfer(outraConta.address, quantidade))
      .to.emit(token, "Transfer")
      .withArgs(dono.address, outraConta.address, quantidade);
    expect(await token.balanceOf(outraConta.address)).to.equal(quantidade);
  });

  it("permite que o dono emita mais tokens", async function () {
    const { token, outraConta } = await networkHelpers.loadFixture(implantarFixture);
    await token.mint(outraConta.address, 50n);
    expect(await token.balanceOf(outraConta.address)).to.equal(50n * umaUnidade);
    expect(await token.totalSupply()).to.equal((fornecimentoInicial + 50n) * umaUnidade);
  });

  it("impede que outra conta emita tokens", async function () {
    const { token, outraConta } = await networkHelpers.loadFixture(implantarFixture);
    const tokenDaOutraConta = token.connect(outraConta) as typeof token;
    await expect(tokenDaOutraConta.mint(outraConta.address, 100n))
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
      .withArgs(outraConta.address);
  });
});
