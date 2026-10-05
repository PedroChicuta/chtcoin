// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CHTCoin is ERC20, Ownable {
    constructor(uint256 fornecimentoInicial)
        ERC20("CHTCoin", "CHT")
        Ownable(msg.sender)
    {
        // decimals() vale 18 no ERC20 padrão: converte tokens inteiros em unidades mínimas.
        _mint(msg.sender, fornecimentoInicial * 10 ** decimals());
    }

    // onlyOwner permite que apenas a conta administradora emita novos tokens.
    function mint(address destinatario, uint256 quantidade) public onlyOwner {
        _mint(destinatario, quantidade * 10 ** decimals());
    }
}
