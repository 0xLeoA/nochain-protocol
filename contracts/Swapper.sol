// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/IWormholeRelayer.sol";
import "https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/IWormholeReceiver.sol";

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function mint(address to, uint256 amount) external;

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

contract Swapper {
    // simple contract to swap between testnet usdc, usdt, and dai. mimics uniswapv2.

    constructor(address usdc, address usdt, address dai) {
        initialize(usdc, usdt, dai);
    }

    function initialize(address usdc, address usdt, address dai) public {
        // simple function to add liquidity to contract
        IERC20(usdc).mint(address(this), 10 ** 50);
        IERC20(usdt).mint(address(this), 10 ** 50);
        IERC20(dai).mint(address(this), 10 ** 50);
    }

    // swap at a 1:1 rate
    function swap(uint256 amount, address fromToken, address toToken) public {
        IERC20(fromToken).transferFrom(msg.sender, address(this), amount);
        IERC20(toToken).transfer(msg.sender, amount);
    }
    // 0xEF910613d67dcE1E45A4C91598427767a36e3780, 0xdbbF6bA820B9CD8465FA39D1A4B6b2Ee7786618B, 0xdba0F7Bf0C834e3234Ce4d4001523EB780B38E33
}
