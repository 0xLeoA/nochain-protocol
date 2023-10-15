import React from 'react';
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { readContract, watchContractEvent, getAccount, prepareWriteContract, writeContract, waitForTransaction, useContractWrite } from '@wagmi/core';
import { ethers } from 'ethers';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

export default function Balances(props) {



    

    const [dropdownStatus, setDropdownStatus] = useState(false)
    const [dropdownSrc, setSrc] = useState("https://static.thenounproject.com/png/551749-200.png")
    
    const [isOpen, setIsOpen] = useState(false);

    const list = [
        {
            "img": "https://imgs.search.brave.com/HBm9ae2ceecXqJYIThYlcqbAIl3um8SCBKjGzXW5hOI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9ldGhl/cmV1bS5vcmcvc3Rh/dGljLzExMjY4Yzg4/YmM0MDEzOWM3NDIw/NjE5ZWNlMjBiZTFk/LzY3ZDRhL3VzZGMt/bGFyZ2UucG5n",
            "amount": props.usdc, 
            "name": "USDC"
        }, 
        {
            "img": "https://imgs.search.brave.com/9eHFxYu1gKGXymLfHZDYoxDP2YYMvn63t2P69h1ljVc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1QvdGV0aGVy/LXVzZHQtbG9nby1G/QTU1QzdGMzk3LXNl/ZWtsb2dvLmNvbS5w/bmc",
            "amount": props.usdt, 
            "name": "USDT"
        }, 
        {
            "img": "https://imgs.search.brave.com/0K-IIEOWPCPFBwDkvJMpBJ4TY5-YqA73nx2I5hyH03Q/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93dzIu/ZnJlZWxvZ292ZWN0/b3JzLm5ldC93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8xMi9k/YWktbG9nby1mcmVl/bG9nb3ZlY3RvcnMu/bmV0Xy00MDB4NDAw/LnBuZz9sb3NzeT0x/JnNzbD0xJmZpdD00/MDAsNDAw",
            "amount": props.dai, 
            "name": "DAI"
        }
    ]

    
    return (
        <div className={styles.balancediv}>
        <button className={isOpen == false ? styles.dropdownbutton : styles.dropdownbuttonopen}
            onClick={() => setIsOpen((prev) => !prev)}>
            Fetched Wallet Value: {props.total} $USD
            {!isOpen ? <FaCaretDown className={styles.carets} /> : <FaCaretUp className={styles.carets} />}
        </button>
        {isOpen && <div className={styles.dropdownitemscontainer}>
            {list.map((item, i) => (
                <div className={styles.individualbalancetokendiv}>
                    <h className={styles.balancetokenamount}> {item.amount}</h>
                    <div><img className={styles.dropdowntokenimgs} src={item.img} />
                    <h className={styles.balancetokenname}> {item.name} </h></div>
                    
                </div>
            ))}
        </div>}</div>
        )

}