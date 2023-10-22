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

    let usdc 
    let usdt 
    let dai 

    const [balances, setBalances] = useState({ "USDC": 0, "USDT": 0, "DAI": 0, "TOTAL": 0 })
    const [ccBalances, setCCBalances] = useState()
    const [balDefined, setBalDefined] = useState(false)
    const chains = [84531,5 ]
    const [totalBal, setTotalBal] = useState(0)

    const [preBal, setPreBal] = useState({ "USDC": 0, "USDT": 0, "DAI": 0, "TOTAL": 0, "NETWORK": 0 })
    const defineBalances = async (chainid) => {
        let usdc_bal = parseInt(await usdc.balanceOf(address) / 10 ** 16)/10**2
        let usdt_bal = parseInt(await usdt.balanceOf(address)/10**16)/10**2
        let dai_bal =parseInt(await  dai.balanceOf(address) / 10 ** 16)/10**2
        let total_bal = parseInt((usdc_bal + usdt_bal + dai_bal)*10**2) / 10**2
        if (chainid == network) {

            setPreBal({ "USDC": usdc_bal, "USDT": usdt_bal, "DAI": dai_bal, "TOTAL": total_bal, "NETWORK": chainid })
        }
    }

    useEffect(() => {
        if (preBal["NETWORK"] == network) {
            setBalances(preBal)
            setBalDefined(true)
        }
    }, [preBal])

    async function getBalancesByChain(chainId) {
        const provider = new ethers.providers.JsonRpcProvider(CHAINIDTODATA[chainId].RPC); // Replace with your Ethereum node URL or Infura URL
        const tkns = ["USDC", "USDT", "DAI"]
        let bals = { "USDC": 0, "USDT": 0, "DAI": 0 }

        for (let i = 0; i < 3; i++) {
            const tkn = new ethers.Contract(CHAINIDTODATA[chainId][tkns[i]], MetaTxERC20ABI, provider);
            let balance = parseInt((await tkn.balanceOf(address))/10**16)/10**2
            bals[tkns[i]] = balance - .1
            if (bals[tkns[i]] < 0) {
                bals[tkns[i]] = 0
            }

        }
 

        return bals
    }

    const [ccUSDC, setCCUSDC] = useState(0) 
    const [ccUSDT, setCCUSDT] = useState(0) 
    const [ccDAI, setCCDAI] = useState(0)


    const [ccDefined, setCCDefined] = useState(false)

    async function getMultiChainBalances() {
        setCCDefined(false)
        let bals = {}
        let tb = 0
        let cctUSDC = 0
        let cctUSDT = 0
        let cctDAI = 0

        await chains.forEach(async (chain) => {
            let bal = await getBalancesByChain(chain)
            tb += bal.USDC + bal.USDT + bal.DAI
            cctUSDC += bal.USDC
            cctUSDT += bal.USDT
            cctDAI += bal.DAI

            bals[chain] = bal

            
            setTotalBal(tb)  

            setCCUSDC(cctUSDC) 
            setCCUSDT(cctUSDT)
            setCCDAI(cctDAI)
        })
        
    
        setBalDefined(true)
        setCCBalances(bals)
        setCCDefined(true)
        return bals
    }

    if (networkType !== "multi") {
        usdc = new ethers.Contract(CHAINIDTODATA[String(network)]["USDC"], MetaTxERC20ABI, wallet);
        usdt = new ethers.Contract(CHAINIDTODATA[String(network)]["USDT"], MetaTxERC20ABI, wallet);
        dai = new ethers.Contract(CHAINIDTODATA[String(network)]["DAI"], MetaTxERC20ABI, wallet);
    }

    useEffect(() => {
        if (networkType !== "multi") {
            setBalDefined(false)
            
            setBalances({ "USDC": 0, "USDT": 0, "DAI": 0, "TOTAL": 0 })
            defineBalances(network)    
        } else {
            setBalances(getMultiChainBalances()) 
            

        }
        
    }, [network])

    useEffect(() => { 
        if (networkType == "multi") {
            setNetwork(0)
            getMultiChainBalances()
        }
    }, [networkType])

    useEffect(() => { getMultiChainBalances()}, [])
    

    return <div className={styles.container}>
        <div className={styles.appborder}>
            <div className={styles.networktextdiv}>
                <h className={styles.choosenetworktext}>Try single-chain functionality on <a onClick={async () => { setNetwork(5001); setNetworkType("single")} } className={styles.choosenetworklink}>Mantle</a>, <a className={styles.choosenetworklink}>Scroll</a>, and <a onClick={async () => { setNetwork(1442); setNetworkType("single")} }className={styles.choosenetworklink}>Polygon ZkEVM</a > OR try out <a className={styles.choosenetworklink} onClick={() => {setNetworkType("multi")}}> multi-chain functionality</a> between Base & Goerli</h>
            </div>
            <div className={styles.paymentcompletiondiv}>
               
                <h className={styles.networkname}><div className={styles.networknameheaderimgdiv}><img className={styles.networknameheaderimg} src={ CHAINIDTODATA[String(network)]['LOGO'] } /></div>{CHAINIDTODATA[String(network)]['NAME']}</h>
                <Balances ccDefined={ccDefined}  ccTotalBal={totalBal}  ccBalances={ccBalances} networkType={networkType} loadingBals={!balDefined} usdc={networkType == "multi" ? ccUSDC :balances.USDC} usdt={networkType == "multi" ? ccUSDT :balances.USDT} dai={networkType == "multi" ? ccDAI :balances.DAI} total = {balances.TOTAL} />
                
                <CompletePayment networkType={networkType}  loadingBals={!balDefined} ccBalances={ccBalances} defineBalances={defineBalances}  network={network} usdc={networkType == "multi" ? ccUSDC :balances.USDC} usdt={networkType == "multi" ? ccUSDT :balances.USDT} dai={networkType == "multi" ? ccDAI :balances.DAI} total_bal={networkType == "multi" ? ccUSDC + ccUSDT + ccDAI :balances["TOTAL"]} />
                
            </div> 
        </div>
  </div>
}