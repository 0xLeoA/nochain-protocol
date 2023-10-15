import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { useSignMessage , readContract, watchContractEvent, getAccount, prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
import OpeningPage from '@/components/OpeningPage'
import Connected from '@/components/Connected'
import { ethers } from 'ethers'

export default function Home() {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const { chain, chains } = useNetwork()
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  
  return (<>{isConnected ? <Connected/> : < OpeningPage />}</>)

}
