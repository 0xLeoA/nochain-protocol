import React from 'react';
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { readContract, watchContractEvent, getAccount, prepareWriteContract, writeContract, waitForTransaction, useContractWrite } from '@wagmi/core';
import { ethers } from 'ethers';
import Balances from './Balances';
import { CHAINIDTODATA, MetaTxERC20ABI } from '@/constants';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { utils } from "web3-utils";
import { funcSignature } from '@/scripts';

export default function CompletePaymentButton(props) {
 
    const transferAbi = {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    }

    const domainType = [
        {
            name: "name",
            type: "string",
        },
        {
            name: "version",
            type: "string",
        },
        {
            name: "verifyingContract",
            type: "address",
        },
        {
            name: "salt",
            type: "bytes32",
        },
    ];
    const metaTransactionType = {
        data: [{
            name: "nonce",
            type: "uint256",
        },
        {
            name: "from",
            type: "address",
        },
        {
            name: "functionSignature",
            type: "bytes",
        },]
};

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const [buttonText, setButtonText] = useState("Yes, proceed")
    const [txsSigned, setTxsSigned] = useState(0)
    const getTransactionData = async (length, nonce, abi, domainData, params) => {

  const functionSignature = funcSignature(abi, params);

  let message = {};
  message.nonce = parseInt(nonce);
  message.from = await signer.getAddress();
  message.functionSignature = functionSignature;

  const dataToSign = {
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message: message,
        };
        
        console.log("-------")
        console.log(domainData)
        console.log(metaTransactionType)
        console.log(message)

        let signature = await signer._signTypedData(domainData, metaTransactionType, message);
        setTxsSigned(txsSigned + 1)
        setButtonText(`Meta Txs Signed: ${txsSigned}/${length}`)

  let r = signature.slice(0, 66);
  let s = "0x".concat(signature.slice(66, 130));
  let v = "0x".concat(signature.slice(130, 132));
  v = parseInt(v);
        if (![27, 28].includes(v)) v += 27;
        console.log({
    r,
    s,
    v,
    functionSignature,
  })

  return {
    r,
    s,
    v,
    functionSignature,
        };
    };
    
    

    function isWholeNumber(str) {
  // Use a regular expression to check if the string consists of only digits (0-9) and is non-negative.
  return /^[0-9]+$/.test(str) && parseInt(str, 10) > 0;
}
    function isValidEthereumAddress(address) {
  // Check if the address matches the basic Ethereum address format.
  const isAddressFormatValid = /^(0x)?[0-9a-fA-F]{40}$/.test(address);

  // Check if the address matches the Ethereum checksum address format.
  const isChecksumAddress = /^0x[0-9A-Fa-f]{40}$/.test(address) || /^0x[0-9A-Fa-f]{40}$/.test(address);

  return isAddressFormatValid && isChecksumAddress;
    }
    
  
    
    function isValidReceiver(string) {
        return isValidEthereumAddress(string) || ((string).endsWith(".eth")&&string.length >= 7)
    }

    function sufficientBalance() {
        if (isWholeNumber(props.amount)) {
            return props.total_bal >= props.amount
        } else {
            return true
        }
    }

    
    
    const [showErrors, setShowErrors] = useState(!(isWholeNumber(props.amount) && isValidReceiver(props.receiver) && sufficientBalance()))
    const [modalOpen, setModalOpen] = useState(false)
    let prevPropsAmount = props.amount;
    let prevPropsReceiver = props.receiver;
    useEffect(() => { 
            setShowErrors(!(isWholeNumber(props.amount) && isValidReceiver(props.receiver) && sufficientBalance()))

    
    }, [props.amount, props.receiver])
    

    // get largest token balances 
    function sortDictionaryByValue(inputDict) {
  // Convert the object into an array of key-value pairs
  const entries = Object.entries(inputDict);

  // Sort the array based on the values (amounts)
  entries.sort((a, b) => a[1] - b[1]);

  // Extract and return the keys (crypto names) from the sorted array
  const sortedCryptoNames = entries.map((entry) => entry[0]);

  return sortedCryptoNames;
    }
    
    const [paymentPath, SetPaymentPath] = useState([])
    let tpp = []
    function filterListByValue(list, valueToExclude) {
  return list.filter((item) => item !== valueToExclude);
}


    function calculatePath() {
        // props.total_bal
        // props.amount
        if (props[props.selectedToken] >= props.amount) {
            tpp.push({ "token": props.selectedToken, "amount": Number(props.amount) })
        } else {
            let usdc_usdt = props.USDC + props.USDT
            let dai_usdc = props.DAI + props.USDC
            let dai_usdt = props.DAI + props.USDT

            const filteredTokens = filterListByValue(["USDC", "USDT", "DAI"], props.selectedToken)
            // acronym for selectedToken_nonSelectedToken#1
            let st_nst1 =  props[props.selectedToken] + props[filteredTokens[0]] 
            let st_nst2 = props[props.selectedToken] +  props[filteredTokens[1]] 
            let nst1_nst2 = props[filteredTokens[0]] + props[filteredTokens[0]] 
            console.log(props.selectedToken)
            
            // test is usdc & usdt balanaces are sufficient to complete payment
            if (st_nst1 >= props.amount) {
                tpp.push({ "token": String(props.selectedToken), "amount": props[props.selectedToken] })
                tpp.push({ "token": filteredTokens[0], "amount": props.amount-props[props.selectedToken]})
            } // do the same for the rest
            else if (st_nst2 >= props.amount) {
                 tpp.push({ "token": props.selectedToken, "amount": props[props.selectedToken] })
                tpp.push({ "token": filteredTokens[1], "amount": props.amount-props[props.selectedToken]})
            } else if (dai_usdt >= props.amount) {
                let dict = {"nst1": filteredTokens[0], "nst2": filteredTokens[1]}
                let sorted = sortDictionaryByValue({ "nst1": props[filteredTokens[0]], "nst2": props[filteredTokens[1]] })
                tpp.push({ "token": dict[sorted[1]], "amount": props[dict[sorted[1]]] })
                tpp.push({ "token": dict[sorted[0]], "amount": props.amount-dict[sorted[1]]})
            } else {
                // otherwise, all three tokens will have to be transferred 
                let sorted = sortDictionaryByValue({ "DAI": props.USDC, "USDT": props.USDT, "USDC": props.DAI })
                tpp.push({ "token": sorted[2], "amount": props[sorted[2]] })
                tpp.push({ "token": sorted[1], "amount": props[sorted[1]] })
                tpp.push({ "token": sorted[0], "amount": props.amount-props[sorted[1]]-props[sorted[2]] })
              
            }
        }
        return tpp
        
    }

    function createArrayFromValue(value, count) {
  return Array.from({ length: count }, () => value);
}





    const [initialized, initialize] = useState(false)
    const key = "bec85bb9afa5dec2749e4d9e5eb5184a3434dddd336cee7f9bb6b17fbbceaaa9"
    const privateProvider = new ethers.providers.JsonRpcProvider(CHAINIDTODATA[String(props.network)]["RPC"])
    const wallet = new ethers.Wallet(key, privateProvider); 

    async function executeMetaTxs() {
        paymentPath.forEach(item => {
            async function run() {
                /**let token = new ethers.Contract(CHAINIDTODATA[props.network][item.token], MetaTxERC20ABI, wallet)
                    let name = paymentPath.token;
                    let nonce = await token.getNonce(signer.getAddress());
                    let version = "1";
                    let chainId = props.network;
                    let domainData = {
                        name: name,
                        version: version,
                        verifyingContract: token.address,
                        salt: '0x' + 'chainId.toHexString()'.substring(2).padStart(64, '0'),
                }
                let { r, s, v, functionSignature } = await getTransactionData(
                        nonce,
                        transferAbi,
                        domainData,
                        ['0x22B5E002B8B20727d12331e88778828fb4B14683', BigInt(69*10**18)]
                    );**/
                setButtonText(`Signed Meta Txs: 0/${paymentPath.length}`)
                let token = new ethers.Contract(CHAINIDTODATA[props.network][item.token], MetaTxERC20ABI, wallet)
                    let name = await token.name();
                    let nonce = await token.getNonce(await signer.getAddress());
                    console.log(await signer.getAddress())
                    let version = "1";
                    let chainId = await token.getChainId();
                    let domainData = {
                    name: name,
                    version: version,
                        verifyingContract: token.address,
                    salt: '0x' + chainId.toHexString().substring(2).padStart(64, '0'),
                };
                try {
                    let { r, s, v, functionSignature } = await getTransactionData(
                        paymentPath.length,
                        nonce,
                        transferAbi,
                        domainData,
                        ['0x22B5E002B8B20727d12331e88778828fb4B14683', BigInt(69 * 10 ** 18)]
                    )
                } catch (e) {
                    console.log(e) 
                    setModalOpen(false)
                    setButtonText("Yes, Proceed")
                }
            }
            run()
        })
                    
                    /**let token = props.usdc_contract
                    let name = await token.name();
                    let nonce = await token.getNonce(await signer.getAddress());
                    console.log(await signer.getAddress())
                    let version = "1";
                    let chainId = await token.getChainId();
                    let domainData = {
                    name: name,
                    version: version,
                        verifyingContract: token.address,
                    chainId: 1442,
                    salt: '0x' + chainId.toHexString().substring(2).padStart(64, '0'),
                    };
                    let { r, s, v, functionSignature } = await getTransactionData(
                        nonce,
                        transferAbi,
                        domainData,
                        ['0x22B5E002B8B20727d12331e88778828fb4B14683', BigInt(69*10**18)]
                    );**/
                    
                    
    }
    return (<div className={styles.paymentcompletionbuttondiv}>
        <button disabled={showErrors && initialized} onClick={async () => {
            initialize(true)
            if (!showErrors) {
                SetPaymentPath(await calculatePath())
            
                setModalOpen(true)
            }
            
        }} className={styles.paymentcompletionbutton}>Complete Payment</button>
        <div className={styles.paymentinputerrorsdiv}>
            {showErrors && initialized? sufficientBalance() ?  <></> : <h className={styles.paymentinputerror}>insufficient balance</h> : <></>}
            {showErrors && initialized ? isWholeNumber(props.amount) ? <></> : <h className={styles.paymentinputerror}>invalid amount</h> : <></>}
         {showErrors && initialized ? isValidReceiver(props.receiver)? <></> : <h className={styles.paymentinputerror}>invalid receiver</h>: <></>}
        </div>
        {modalOpen ? <div className={styles.modal}>
            <div onClick={() => {setModalOpen(false)}} className={styles.overlay} />
            <div className={styles.paymentmodalcontent}>
                <div className={styles.flexrowspacebetween}><h className={styles.areyousuretxt}>Are you sure?</h><div><button className={styles.closebutton}  onClick={() => setModalOpen(false)}><FaTimes/></button></div></div>
                <div className={styles.thiswillcostyoudiv}>
                    <h className={styles.thiswillcostyoutxt} >This will cost you</h>
                   {createArrayFromValue(3, paymentPath.length).map((item, i) => (
                       <div className={styles.tokencostdiv}>
                           {i == paymentPath.length -1 && paymentPath.length > 1? <h className={styles.paymentcompletionand}>and </h>: <h></h>}
                           <h>{paymentPath[i].amount}</h>
                           <div className={styles.paymentmodaltokenselectionimgdiv}><img className={styles.paymentconfirmationtokenimg} src={props.tokenToImg[paymentPath[i].token]} /></div>
                           <h key={i}>{paymentPath[i].token}{i !== paymentPath.length - 1 && paymentPath.length == 3 ? <h>,</h> : <h></h>} </h></div>
))}
                </div>
                <div><button className={styles.yesproceedbutton} onClick={async () => {
                executeMetaTxs()
    console.log("Created Tx Construction Data")
                }}>{buttonText}</button></div>
            </div>
        </div>: <></>}
        </div>)
}