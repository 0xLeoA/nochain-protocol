import React from 'react';
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { readContract, watchContractEvent, getAccount, prepareWriteContract, writeContract, waitForTransaction, useContractWrite } from '@wagmi/core';
import { ethers } from 'ethers';
import Balances from './Balances';
import { CHAINIDTODATA, MetaTxERC20ABI } from '@/constants';
import { useState, useEffect } from 'react';
import CompletePayment from './CompletePayment';

export default function Connected() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount()
    const key = "bec85bb9afa5dec2749e4d9e5eb5184a3434dddd336cee7f9bb6b17fbbceaaa9"
    
    // polygon zkevm default network
    const [network, setNetwork] = useState(1442)

    const provider = new ethers.providers.JsonRpcProvider(CHAINIDTODATA[String(network)]["RPC"])
    const wallet = new ethers.Wallet(key, provider); 

    const usdc = new ethers.Contract(CHAINIDTODATA[String(network)]["USDC"], MetaTxERC20ABI, wallet);
    const usdt = new ethers.Contract(CHAINIDTODATA[String(network)]["USDT"], MetaTxERC20ABI, wallet);
    const dai = new ethers.Contract(CHAINIDTODATA[String(network)]["DAI"], MetaTxERC20ABI, wallet);

    const [balances, setBalances] = useState({ "USDC": 0, "USDT": 0, "DAI": 0, "TOTAL": 0 })
    const [balDefined, setBalDefined] = useState(false)
    async function defineBalances() {
        let usdc_bal = await usdc.balanceOf(address) / 10 ** 18
        let usdt_bal = await usdt.balanceOf(address)/10**18
        let dai_bal =await  dai.balanceOf(address) / 10 ** 18
        let total_bal = usdc_bal + usdt_bal + dai_bal 
        setBalances({ "USDC": usdc_bal, "USDT": usdt_bal, "DAI": dai_bal, "TOTAL": total_bal })
        setBalDefined(true)
    }

    if (balDefined == false) {
        defineBalances()
    }
    

    return <div className={styles.container}>
        <div className={styles.appborder}>
            <div className={styles.networktextdiv}>
                <h className={styles.choosenetworktext}>Try single-chain functionality on <a className={styles.choosenetworklink}>Mantle</a>, <a className={styles.choosenetworklink}>Scroll</a>, and <a className={styles.choosenetworklink}>Polygon ZkEVM</a > OR try out <a className={styles.choosenetworklink}> cross-chain functionality</a> between Arbitrum, Goerli, and Optimism</h>
            </div>
            <div className={styles.paymentcompletiondiv}>
               
                <h className={styles.networkname}>Selected Network: {CHAINIDTODATA[String(network)]['NAME']}</h>
                <Balances usdc={balances.USDC} usdt={balances.USDT} dai={balances.DAI} total = {balances.TOTAL} />
                    
                <CompletePayment network={network} usdc={balances.USDC} usdt={balances.USDT} dai={balances.DAI} network={network} total_bal={balances["TOTAL"]} />
                
            </div>
        </div>
  </div>
}