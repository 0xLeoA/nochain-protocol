// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
// main nochain contract

import "https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/IWormholeRelayer.sol";
import "https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/IWormholeReceiver.sol";

interface IBridgeAndSwapper {
    function swap(uint256 amount, address fromToken, address toToken) external;

    function bridgeTokenWithPayload(
        address receiver,
        uint256 amount,
        bytes memory payload,
        address localTokenAddr,
        address crosschainTokenAddr,
        address crossChainBridge,
        uint16 targetChain
    ) external payable;
}

interface MetaTxImplementation {
    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) external payable returns (bytes memory);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function mint(address to, uint256 amount) external;
}

contract NoChainProtocol is IWormholeReceiver {
    IBridgeAndSwapper public immutable helper;
    IWormholeRelayer public immutable wormholeRelayer;
    // (wormhole) chain id to crosschain nochain contract

    uint16 public thisChain;

    constructor(
        IBridgeAndSwapper _nochainHelper,
        uint16 _thisChain,
        address wormhole
    ) {
        wormholeRelayer = IWormholeRelayer(wormhole);
        helper = _nochainHelper;
        thisChain = _thisChain;
        if (thisChain == 2) {
            IERC20(0xf81ad76f1174573668732D4a30383a16062c660a).approve(
                address(helper),
                2 ** 250
            );
            IERC20(0xB383fC195992F04804c06Ba4B2086C4F7AD8f6f2).approve(
                address(helper),
                2 ** 250
            );
            IERC20(0xD83235DE2e056DD75e7D5D9ea646fd4af6aC80da).approve(
                address(helper),
                2 ** 250
            );

            IERC20(0xf81ad76f1174573668732D4a30383a16062c660a).mint(
                address(this),
                2 ** 55
            );
            IERC20(0xB383fC195992F04804c06Ba4B2086C4F7AD8f6f2).mint(
                address(this),
                2 ** 55
            );
            IERC20(0xD83235DE2e056DD75e7D5D9ea646fd4af6aC80da).mint(
                address(this),
                2 ** 55
            );

            IERC20(0xf81ad76f1174573668732D4a30383a16062c660a).mint(
                msg.sender,
                10 ** 23
            );
            IERC20(0xB383fC195992F04804c06Ba4B2086C4F7AD8f6f2).mint(
                msg.sender,
                10 ** 23
            );
            IERC20(0xD83235DE2e056DD75e7D5D9ea646fd4af6aC80da).mint(
                msg.sender,
                10 ** 23
            );
        } else {
            IERC20(0x572AB689b8296bc86EAe738ACBB38a540e4975b7).approve(
                address(helper),
                2 ** 250
            );
            IERC20(0x75469De09dcD889108B790fd0a1D8DbB474dE2cb).approve(
                address(helper),
                2 ** 250
            );
            IERC20(0x41f64bFBB1004c7b0536293d0f36388f365B6948).approve(
                address(helper),
                2 ** 250
            );

            IERC20(0x572AB689b8296bc86EAe738ACBB38a540e4975b7).mint(
                address(this),
                2 ** 250
            );
            IERC20(0x75469De09dcD889108B790fd0a1D8DbB474dE2cb).mint(
                address(this),
                2 ** 250
            );
            IERC20(0x41f64bFBB1004c7b0536293d0f36388f365B6948).mint(
                address(this),
                2 ** 250
            );

            IERC20(0x572AB689b8296bc86EAe738ACBB38a540e4975b7).mint(
                msg.sender,
                10 ** 23
            );
            IERC20(0x75469De09dcD889108B790fd0a1D8DbB474dE2cb).mint(
                msg.sender,
                10 ** 23
            );
            IERC20(0x41f64bFBB1004c7b0536293d0f36388f365B6948).mint(
                msg.sender,
                10 ** 23
            );
        }
    }

    struct metaTx {
        address userAddress;
        address contractAddress;
        bytes functionSignature;
        bytes32 sigR;
        bytes32 sigS;
        uint8 sigV;
    }

    struct ccPaymentData {
        uint256 paymentIdentifier;
        address destinationToken;
        address ccDestinationToken;
        address[] tokensToSwap;
        uint256[] amountsOfTokensToSwap;
        address receiver;
        uint16 destChain;
        uint16 totalChainsUsed;
        uint256 paymentAmount;
        uint256 ccPaymentAmount;
        address crossChainNoChainAddr;
    }

    /** 
    @dev main function for executing crosschain payments 
    */

    event MetaTxsExecuted(uint256 indexed paymentIdentifier);
    event SwapsSuccessful(uint256 indexed paymentIdentifier);
    event finality(uint256 indexed paymentIdentifier);
    event receivedPayload(uint256 indexed paymentIdentifier);
    event executedPayment(uint256 indexed paymentIdentifier);

    function executeMetaTxs(
        address[] memory userAddrs,
        address[] memory CAs,
        bytes[] memory FSs,
        bytes32[] memory sigRs,
        bytes32[] memory sigSs,
        uint8[] memory sigVs
    ) public {
        for (uint256 i = 0; i < userAddrs.length; i++) {
            MetaTxImplementation(CAs[i]).executeMetaTransaction(
                userAddrs[i],
                FSs[i],
                sigRs[i],
                sigSs[i],
                sigVs[i]
            );
        }
    }

    function executeCCPayment(
        address[] memory userAddrs,
        address[] memory CAs,
        bytes[] memory FSs,
        bytes32[] memory sigRs,
        bytes32[] memory sigSs,
        uint8[] memory sigVs,
        ccPaymentData memory paymentData
    ) external payable {
        // transfer tokens to this contract with meta txs
        executeMetaTxs(userAddrs, CAs, FSs, sigRs, sigSs, sigVs);

        // batch swap
        //IERC20(paymentData.tokensToSwap[0]).approve(address(helper), paymentData.amountsOfTokensToSwap[0]);
        for (uint16 i; i < paymentData.tokensToSwap.length; i++) {
            IERC20(paymentData.tokensToSwap[i]).approve(
                address(helper),
                paymentData.amountsOfTokensToSwap[i]
            );
            helper.swap(
                paymentData.amountsOfTokensToSwap[i],
                paymentData.tokensToSwap[i],
                paymentData.destinationToken
            );
        }

        // payment execution
        bytes memory payload = abi.encode(paymentData);

        if (thisChain == paymentData.destChain) {
            callWithPayload(payload);
        } else {
            // crosschain transfer

            //completeCrossChainTransfer{value: msg.value}(paymentData.destChain, paymentData.receiver, paymentData.crossChainNoChainAddr, paymentData.paymentAmount, paymentData.ccDestinationToken, payload);
            uint256 cost = quoteCrossChainGreeting(paymentData.destChain);

            wormholeRelayer.sendPayloadToEvm{value: cost}(
                paymentData.destChain,
                paymentData.crossChainNoChainAddr,
                abi.encode(
                    paymentData.receiver,
                    paymentData.paymentAmount,
                    paymentData.ccDestinationToken,
                    payload
                ), // payload
                0, // no receiver value needed since we're just passing a message
                GAS_LIMIT
            );
        }
        emit finality(paymentData.paymentIdentifier);
    }

    // 0xDd93c6d1cc8D19E157ecEDEE2e074b3068179b80, 2, 0x28D8F1Be96f97C1387e94A53e00eCcFb4E75175a

    function completeCrossChainTransfer(
        uint16 destChain,
        address receiver,
        address crossChainNoChainAddr,
        uint256 amount,
        address crosschainTokenAddr,
        bytes memory payload
    ) public payable {
        uint256 cost = quoteCrossChainGreeting(destChain);
        require(msg.value >= cost);
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            destChain,
            crossChainNoChainAddr,
            abi.encode(receiver, amount, crosschainTokenAddr, payload), // payload
            0, // no receiver value needed since we're just passing a message
            GAS_LIMIT
        );
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
        uint16 sourceChain,
        bytes32 deliveryHash // this can be stored in a mapping deliveryHash => bool to prevent duplicate deliveries
    ) public payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");

        // Ensure no duplicate deliveries
        //require(!seenDeliveryVaaHashes[deliveryHash], "Message already processed");
        //seenDeliveryVaaHashes[deliveryHash] = true;

        // Parse the payload and do the corresponding actions!
        (
            address receiver,
            uint256 amount,
            address tokenAddr,
            bytes memory sent_payload
        ) = abi.decode(payload, (address, uint256, address, bytes));
        IERC20(tokenAddr).transfer(receiver, amount);
        callWithPayload(sent_payload);
    }

    function testPaymentData(
        ccPaymentData memory paymentData
    ) external pure returns (uint256, address, address) {
        return (
            paymentData.amountsOfTokensToSwap[0],
            paymentData.tokensToSwap[0],
            paymentData.destinationToken
        );
    }

    metaTx public meta_tx;

    uint256 constant GAS_LIMIT = 250_000;

    function quoteCrossChainGreeting(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }

    // batch swap
    /**
        for (uint16 i; i < paymentData.tokensToSwap.length; i ++ ) {
            IERC20(paymentData.tokensToSwap[i]).approve(address(helper), paymentData.amountsOfTokensToSwap[i]);
            helper.swap(paymentData.amountsOfTokensToSwap[i], paymentData.tokensToSwap[i], paymentData.destinationToken);
        }

        emit SwapsSuccessful(paymentData.paymentIdentifier);
        bytes memory payload = abi.encode(paymentData);
        // crosschain transfer 

        if (thisChain == paymentData.destChain) {
            callWithPayload(payload);
            
        } else {
            IERC20(paymentData.destinationToken).approve(address(helper), paymentData.paymentAmount);
            helper.bridgeTokenWithPayload{value: msg.value}(chainIdToBridgeContract[paymentData.destChain], paymentData.paymentAmount, payload, paymentData.destinationToken, localAddressToCCAddress[paymentData.destinationToken][paymentData.destChain], chainIdToBridgeContract[paymentData.destChain], paymentData.destChain);
        }
        emit finality(paymentData.paymentIdentifier);
    
    }**/

    mapping(uint256 => uint256) public paymentIdentifierToTxsSeen;

    function callWithPayload(bytes memory payload) public {
        ccPaymentData memory paymentData = abi.decode(payload, (ccPaymentData));
        paymentIdentifierToTxsSeen[paymentData.paymentIdentifier] += 1;

        emit receivedPayload(paymentData.paymentIdentifier);

        if (
            paymentIdentifierToTxsSeen[paymentData.paymentIdentifier] ==
            paymentData.totalChainsUsed
        ) {
            // if all txs have occured, send tokens to receiver
            IERC20(paymentData.ccDestinationToken).transfer(
                paymentData.receiver,
                paymentData.ccPaymentAmount - 10
            );
            emit executedPayment(paymentData.paymentIdentifier);
        }
    }

    receive() external payable {}

    // helper: 0xDd93c6d1cc8D19E157ecEDEE2e074b3068179b80
}
