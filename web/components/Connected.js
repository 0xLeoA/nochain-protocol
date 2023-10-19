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
import LoadingIcons from 'react-loading-icons'


export default function Connected() {
    const { address, isConnecting, isDisconnected, isConnected } = useAccount()
    const key = "bec85bb9afa5dec2749e4d9e5eb5184a3434dddd336cee7f9bb6b17fbbceaaa9"
    
    // polygon zkevm default network
    const [network, setNetwork] = useState(1442)
    const [networkType, setNetworkType] = useState("single")

    const provider = new ethers.providers.JsonRpcProvider(CHAINIDTODATA[String(network)]["RPC"])
    const wallet = new ethers.Wallet(key, provider); 

    const usdc = new ethers.Contract(CHAINIDTODATA[String(network)]["USDC"], MetaTxERC20ABI, wallet);
    const usdt = new ethers.Contract(CHAINIDTODATA[String(network)]["USDT"], MetaTxERC20ABI, wallet);
    const dai = new ethers.Contract(CHAINIDTODATA[String(network)]["DAI"], MetaTxERC20ABI, wallet);

    const [balances, setBalances] = useState({ "USDC": 0, "USDT": 0, "DAI": 0, "TOTAL": 0 })
    const [balDefined, setBalDefined] = useState(false)
    const defineBalances = async () => {
        let usdc_bal = parseInt(await usdc.balanceOf(address) / 10 ** 16)/10**2
        let usdt_bal = parseInt(await usdt.balanceOf(address)/10**16)/10**2
        let dai_bal =parseInt(await  dai.balanceOf(address) / 10 ** 16)/10**2
        let total_bal = usdc_bal + usdt_bal + dai_bal 
        setBalances({ "USDC": usdc_bal, "USDT": usdt_bal, "DAI": dai_bal, "TOTAL": total_bal })
        setBalDefined(true)
    }


    const getMultiChainBalances = async () => {

    }

    useEffect(() => {
        setBalDefined(false)
        setBalances({ "USDC": 0, "USDT": 0, "DAI": 0, "TOTAL": 0 })
        defineBalances()
    }, [network])

    useEffect(() => { 
        if (networkType == "multi") {
            setNetwork(0)
        }
    }, [networkType])

   
    

    return <div className={styles.container}>
        <div className={styles.appborder}>
            <div className={styles.networktextdiv}>
                <h className={styles.choosenetworktext}>Try single-chain functionality on <a onClick={async () => { setNetwork(5001)} } className={styles.choosenetworklink}>Mantle</a>, <a className={styles.choosenetworklink}>Scroll</a>, and <a onClick={async () => { setNetwork(1442)} }className={styles.choosenetworklink}>Polygon ZkEVM</a > OR try out <a className={styles.choosenetworklink} onClick={() => {setNetworkType("multi")}}> cross-chain functionality</a> between Base & Goerli</h>
            </div>
            <div className={styles.paymentcompletiondiv}>
               
                <h className={styles.networkname}><div className={styles.networknameheaderimgdiv}><img className={styles.networknameheaderimg} src={ CHAINIDTODATA[String(network)]['LOGO'] } /></div>{CHAINIDTODATA[String(network)]['NAME']}</h>
                <Balances loadingBals={!balDefined} usdc={balances.USDC} usdt={balances.USDT} dai={balances.DAI} total = {balances.TOTAL} />
                
                <CompletePayment  defineBalances={defineBalances}  network={network} usdc={balances.USDC} usdt={balances.USDT} dai={balances.DAI} total_bal={balances["TOTAL"]} />
                
            </div>
        </div>
  </div>
}