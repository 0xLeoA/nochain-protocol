// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "./NativeMetaTransaction.sol";

// native crosschain functionality implemented through wormhole
// natively supported meta transactions
contract MetaTxSupportedERC20 is ERC20, ContextMixin, NativeMetaTransaction {
    // for development [IGNORE]:
    // wormhole goerli relayer addr: 0x28D8F1Be96f97C1387e94A53e00eCcFb4E75175a
    // polygon wormhole relayer addr: 0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0

    //g: 0x3159Ef6C053E9Ac16376ead6F96220053FD34e32
    //c: 0x1Bb19e21cbd8E3F56A8Deb7e4b97C5a729f7e09D
    /**
    @dev constructor 
    @param name name of token 
    @param symbol symbol of token 
    @param amount to mint to contract creator, without decimals 
    */
    constructor(
        string memory name,
        string memory symbol,
        uint256 amount
    ) ERC20(name, symbol) {
        _mint(msg.sender, amount * 10 ** 18);
        _initializeEIP712(name);
    }

    function _msgSender() internal view override returns (address sender) {
        return ContextMixin.msgSender();
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
