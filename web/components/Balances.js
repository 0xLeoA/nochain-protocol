import React from 'react';
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { readContract, watchContractEvent, getAccount, prepareWriteContract, writeContract, waitForTransaction, useContractWrite } from '@wagmi/core';
import { ethers } from 'ethers';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'
import LoadingIcons from 'react-loading-icons'
import { CHAINIDTODATA } from '@/constants';
import { FaTimes } from 'react-icons/fa';

export default function Balances(props) {



    

    const [dropdownStatus, setDropdownStatus] = useState(false)
    const [dropdownSrc, setSrc] = useState("https://static.thenounproject.com/png/551749-200.png")
    
    const [isOpen, setIsOpen] = useState(false);

    const [ccBalOpen, setCCBaLOpen] = useState(false)
    const [usdcOpen, setUSDCOpen] = useState(false)
    const [usdtOpen, setUSDTOpen] = useState(false)
    const [daiOpen, setDAIOpen] = useState(false)


    function isOpenByName(name) {
        if (name == "USDC") {
            return usdcOpen
        } else if (name == "USDT") {
            return usdtOpen
        } else if (name == "DAI") {
            return daiOpen
        }
    }

    function changeItemByName(name) {
        if (name == "USDC") {
            setUSDCOpen(!usdcOpen)
            setUSDTOpen(false)
            setDAIOpen(false)

        } else if (name == "USDT") {
            setUSDTOpen(!usdtOpen)
            setUSDCOpen(false)
            setDAIOpen(false)
        } else if (name == "DAI") {
            setDAIOpen(!daiOpen)
            setUSDCOpen(false)
            setUSDTOpen(false)
        }
    }

    let list = [
        {
            "img": "https://imgs.search.brave.com/HBm9ae2ceecXqJYIThYlcqbAIl3um8SCBKjGzXW5hOI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9ldGhl/cmV1bS5vcmcvc3Rh/dGljLzExMjY4Yzg4/YmM0MDEzOWM3NDIw/NjE5ZWNlMjBiZTFk/LzY3ZDRhL3VzZGMt/bGFyZ2UucG5n",
            "amount": props.usdc, 
            "name": "USDC", 
            "func": () => { setUSDCOpen(!usdcOpen) }
        }, 
        {
            "img": "https://imgs.search.brave.com/9eHFxYu1gKGXymLfHZDYoxDP2YYMvn63t2P69h1ljVc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1QvdGV0aGVy/LXVzZHQtbG9nby1G/QTU1QzdGMzk3LXNl/ZWtsb2dvLmNvbS5w/bmc",
            "amount": props.usdt, 
            "name": "USDT", 
            "func": () => {setUSDTOpen(!usdtOpen)}
        }, 
        {
            "img": "https://imgs.search.brave.com/0K-IIEOWPCPFBwDkvJMpBJ4TY5-YqA73nx2I5hyH03Q/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93dzIu/ZnJlZWxvZ292ZWN0/b3JzLm5ldC93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8xMi9k/YWktbG9nby1mcmVl/bG9nb3ZlY3RvcnMu/bmV0Xy00MDB4NDAw/LnBuZz9sb3NzeT0x/JnNzbD0xJmZpdD00/MDAsNDAw",
            "amount": props.dai, 
            "name": "DAI", 
            "func": () => {setDAIOpen(!daiOpen)}
        }
    ]


    const [balances, setBalances] = useState()
    const chains = [5, 84531]


    useEffect(() => {
        if (props.networkType == "multi"){
            try {
                let a
                props.ccBalances.then((result) => {
                    setBalances(result)
                })
                
            } catch (e) {
                setBalances(props.ccBalances)
            }
        
    }
    }, [props.ccBalances]) 

    const [totalBal, setTotalBal] = useState(0)

    useEffect(() => {
         setUSDCOpen(false)
        setDAIOpen(false)
        setUSDTOpen(false)
    }, [ccBalOpen])


    return (
        
        <div className={styles.balancediv}>
            {props.networkType !== "multi" ?
        <><button className={isOpen == false ? styles.ccbalbutton : styles.ccbalbuttonopen}
            onClick={() => setIsOpen((prev) => !prev)}>
                Fetched Wallet Value: {props.loadingBals ? <LoadingIcons.Bars className={styles.totalbalbars} fill="rgb(44,44,44)" width="13" height="13" speed={1.5} /> : <> {props.total }</>} $USD
            <div className={styles.caretsdiv}>{!isOpen ? <FaCaretDown className={styles.caretsccbal} /> : <FaCaretUp className={styles.caretsccbal} />}</div> 
        </button>
        {isOpen && <div className={styles.ccdropdownitemscontainer}>
            {list.map((item, i) => (
                <div className={styles.ccindividualbalancetokendiv}>
                    <h className={styles.balancetokenamount}>{item.amount}</h>
                    <div className={styles.cctokennameandimgdiv}><div className={styles.ccdropdowntokenimgsdiv}><img className={styles.ccdropdowntokenimgs} src={item.img} />
                    <h className={styles.balancetokenname}> {item.name} </h></div></div>
                    
                </div>
            ))}
                    </div>}</> : props.ccDefined ? 
                <>
                    <button onClick={() => { setCCBaLOpen(!ccBalOpen) }} className={!ccBalOpen ? styles.ccbalbutton : styles.ccbalbuttonopen}> Total Wallet Value: {props.ccTotalBal} $USD
                        <div className={styles.caretsccbaldiv}>{!ccBalOpen ? <FaCaretDown className={styles.caretsccbal} /> : <FaCaretUp className={styles.caretsccbal} />} </div></button>
                    {ccBalOpen && <div className={styles.ccdropdownitemscontainer}>
            {list.map((item, i) => (
                <><div className={styles.ccindividualbalancetokendiv}>
                    <h className={styles.balancetokenamount}>{props[String(item.name).toLowerCase()]}</h>
                    <div className={styles.cctokennameandimgdiv}> <div className={styles.ccdropdowntokenimgsdiv}><img className={styles.ccdropdowntokenimgs} src={item.img} /></div>
                        <h className={styles.balancetokenname}> {item.name} </h>
                        <div className={styles.caretsccbaldiv}><button onClick={() => { changeItemByName(item.name) }} className={styles.ccinditokenbalancearrow}>{!isOpenByName(item.name) ? <FaCaretDown className={styles.caretsccbal} /> : <FaCaretUp className={styles.caretsccbal} />}</button> </div>
                    </div>
                   
                </div>
                    <div >{isOpenByName(item.name) ? 
                        chains.map((chain, i) => (
                            <div className={styles.ccdropdownadditionaltokendatadiv}>{balances[chain] ? balances[chain][item.name] : <>0</>}
                                <div className={styles.ccdropdownrightportion}><div className={styles.ccdropdownimgdiv}><img className={styles.ccdropdownimg} src={CHAINIDTODATA[chain]["LOGO"]} /></div>
                                    <div className={styles.ccdropdownimgdiv}><img className={styles.ccdropdownimg} src={item["img"]} /></div><h className={styles.ccdropdownadditionaltknname}>{item.name}</h></div></div>
                    ))
                    : <></>}</div>
                    
                    </> 

            ))}
                    </div>}
                </>: <></>}</div>
        )

}