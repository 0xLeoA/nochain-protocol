import React from 'react';
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { readContract, watchContractEvent, getAccount, prepareWriteContract, writeContract, waitForTransaction, useContractWrite } from '@wagmi/core';
import { ethers } from 'ethers';
import Balances from './Balances';
import { CHAINIDTODATA, MetaTxERC20ABI } from '@/constants';
import { useState, useEffect } from 'react';
import CompletePaymentButton from './CompletePaymentButton';



export default function CompletePayment(props) {

    const [amountinputwidth, setAmountInputWidth] = useState(`1.7rem`)
    const [receiverInputWidth, setReceiverInputWidth] = useState("4.4rem")
    const [selectedToken, setSelectedToken] = useState("USDC")
    const [selectingToken, setSelectingToken] = useState(false)
    const [amount, setAmount] = useState("")
    const [receiver, setReceiver] = useState("")
    const setSelectingTokenState = () => {
        setSelectingToken(!selectingToken)
    }

    

    const tokenToImg = {
        "USDC": "https://imgs.search.brave.com/HBm9ae2ceecXqJYIThYlcqbAIl3um8SCBKjGzXW5hOI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9ldGhl/cmV1bS5vcmcvc3Rh/dGljLzExMjY4Yzg4/YmM0MDEzOWM3NDIw/NjE5ZWNlMjBiZTFk/LzY3ZDRhL3VzZGMt/bGFyZ2UucG5n", 
        "USDT": "https://imgs.search.brave.com/9eHFxYu1gKGXymLfHZDYoxDP2YYMvn63t2P69h1ljVc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1QvdGV0aGVy/LXVzZHQtbG9nby1G/QTU1QzdGMzk3LXNl/ZWtsb2dvLmNvbS5w/bmc",
        "DAI": "https://imgs.search.brave.com/0K-IIEOWPCPFBwDkvJMpBJ4TY5-YqA73nx2I5hyH03Q/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93dzIu/ZnJlZWxvZ292ZWN0/b3JzLm5ldC93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8xMi9k/YWktbG9nby1mcmVl/bG9nb3ZlY3RvcnMu/bmV0Xy00MDB4NDAw/LnBuZz9sb3NzeT0x/JnNzbD0xJmZpdD00/MDAsNDAw"
    }

    const handleAmountChange = (event) => {
        setAmount(event.target.value)

        if (String(event.target.value).length <=2) {
            setAmountInputWidth("1.7rem")
        } else {
            setAmountInputWidth(`${(String(event.target.value).length * 0.3) + 1.7}rem`)
        }
    };

    const handleReceiverChange = (event) => {
        setReceiver(event.target.value)
        if (String(event.target.value).length == 0) {
            setReceiverInputWidth("4.4rem")
        } else if (String(event.target.value).length == 1) {
            setReceiverInputWidth(`${(1.2)}rem`)
        } else {
            setReceiverInputWidth(`${(String(event.target.value).length * 0.3) + 1.2}rem`)
        }
    };
    //`${inputValue.length * 1}rem`
    
    const amountInputStyle = {
    marginLeft: '0.3rem',
        marginRight: '0.3rem',
        marginTop: '0.1rem',
  height: '1.3rem',
  width: amountinputwidth,
  border: '1px solid #ccc',
  padding: '5px',
  outline: 'none',
  fontFamily: "'Kanit', sans-serif",
        fontSize: '0.8rem',
  maxWidth: "3rem"
    };
    
    const receivertInputStyle = {
        marginLeft: '0.3rem',
        marginTop: '0.1rem',
  height: '1.3rem',
  width: receiverInputWidth,
  border: '1px solid #ccc',
  padding: '5px',
  outline: 'none',
  fontFamily: "'Kanit', sans-serif",
        fontSize: '0.8rem',
  maxWidth: "7rem"
  };
    return (<div className={styles.paymentsettinsdiv}>
        <div className={styles.toppaymentsettingsdiv}>
        <h>Send</h>
        <input
            
      onChange={handleAmountChange}
        type="text"
        id="amountInput"
            placeholder="69"
           style={amountInputStyle}
        />
        <h>$USD to </h>
        <input
            type="text"
            onChange={handleReceiverChange}
            id="receiverInput"
            style={receivertInputStyle}
            placeholder="vitalik.eth"
            className={styles.receiverinput}
            /></div>
        <div className={styles.bottompaymentsettingsdiv}>
            <h>In </h><button onClick={setSelectingTokenState} className={styles.selectedtokenname}><div className={styles.selectedtokenimgdiv}><img className={styles.selectedtokenimg} src={tokenToImg[selectedToken]} /></div>{selectedToken}</button>
            <h>on</h><button className={styles.selectednetworkbutton}><div className={styles.selectedtokenimgdiv}><img className={styles.selectedtokenimg} src={CHAINIDTODATA[props.network]["LOGO"]}/></div>{CHAINIDTODATA[props.network]["NAME"]}</button>
        </div>
        <CompletePaymentButton network={props.network} tokenToImg={tokenToImg} selectedToken={selectedToken} USDC={props.usdc} USDT={props.usdt} DAI={props.dai} amount={amount} receiver={receiver} total_bal={props.total_bal} />
        
        
        {selectingToken ? <div className={styles.modal}>
            <div onClick={setSelectingTokenState} className={styles.overlay} />
            <div className={styles.modalcontent}>
                
                <div>
                    <button onClick={() => {
                        setSelectingToken(false)
                        setSelectedToken("USDC")
                    }} className={styles.modaltokenselectionbutton}><div className={styles.modaltokenselectionimgdiv}><img className={styles.selectedtokenimg} src={tokenToImg["USDC"]} /></div>USDC</button>
                </div>
                    <div>
                <button onClick={() => {
                        setSelectingToken(false)
                        setSelectedToken("USDT")
                    }}  className={styles.modaltokenselectionbutton}><div className={styles.modaltokenselectionimgdiv}><img className={styles.selectedtokenimg} src={tokenToImg["USDT"]} /></div>USDT</button>
                </div>
                <div>
                <button onClick={() => {
                        setSelectingToken(false)
                        setSelectedToken("DAI")
                    }}  className={styles.modaltokenselectionbutton}><div className={styles.modaltokenselectionimgdiv}><img className={styles.selectedtokenimg} src={tokenToImg["DAI"]} /></div>DAI</button>
                </div>
            </div>
        </div>: <></>}
    </div>)
}