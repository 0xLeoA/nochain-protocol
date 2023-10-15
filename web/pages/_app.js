import '@/styles/globals.css'
import { MoralisProvider } from "react-moralis";
import NoSSR from 'react-no-ssr';
import { NotificationProvider } from 'web3uikit';


import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider, darkTheme, lightTheme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, gnosisChiado } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const avalancheChain = {
  id: 43114,
  name: 'Avalanche',
  network: 'avalanche',
  iconUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  testnet: false,
};

const goerliChain = {
  id: 5,
  name: 'Goerli',
  network: 'Ethereum Goerli Testnet',
  iconUrl: 'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    },
  },
  blockExplorers: {
    default: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io' },
    etherscan: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io' },
  },
  testnet: true,
};

const lineaChain = {
  id: 59140,
  name: ' Linea',
  network: 'Linea Goerli test network',
  iconUrl: 'https://pbs.twimg.com/profile_images/1639402103486521344/erDLnbwE_400x400.jpg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'LineaETH',
    symbol: 'LineaETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.goerli.linea.build/'],
    },
  },
  blockExplorers: {
    default: { name: 'Linea Explorer', url: 'https://explorer.goerli.linea.build/' },
    etherscan: { name: 'Linea Explorer', url: 'https://explorer.goerli.linea.build/' },
  },
  testnet: true,
};
const chiadoChain = {
  id: 10200,
  name: 'Gnosis',
  network: 'Gnosis Chiado Testnet',
  iconUrl: 'https://cryptologos.cc/logos/gnosis-gno-gno-logo.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'XDai',
    symbol: 'XDAI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.chiadochain.net'],
    },
  },
  blockExplorers: {
    default: { name: 'Chiado Explorer', url: 'https://blockscout.com/gnosis/chiado' },
    etherscan: { name: 'Chiado Explorer', url: 'https://blockscout.com/gnosis/chiado' },
  },
  testnet: true,
};

const mumbaiChain = {
  id: 80001,
  name: 'Polygon Mumbai',
  network: 'Polygon Mumbai Testnet',
  iconUrl: 'https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: {
      http: ['https://matic-mumbai.chainstacklabs.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Mumbai Explorer', url: 'https://mumbai.polygonscan.com' },
    etherscan: { name: 'Mumbai Explorer', url: 'https://mumbai.polygonscan.com' },
  },
  testnet: true,
};
const polygonZkEVM = {
  id: 1442,
  name: 'Polygon ZkEVM',
  network: 'Polygon zkEVM Testnet',
  iconUrl: 'https://static.vecteezy.com/system/resources/previews/005/597/229/non_2x/polygon-logo-crypto-currency-symbol-isolated-vector.jpg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.public.zkevm-test.net'],
    },
  },
  blockExplorers: {
    default: { name: 'Polygon zkEVM Testnet Explorer', url: 'https://explorer.public.zkevm-test.net' },
    etherscan: { name: 'Polygon zkEVM Testnet Explorer', url: 'https://explorer.public.zkevm-test.net' },
  },
  testnet: true,
};
const optimismGoerliChain = {
  id: 420,
  name: 'Optimism',
  network: 'Optimism Goerli Testnet',
  iconUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://goerli.optimism.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Optimism Goerli Explorer', url: 'https://goerli-optimism.etherscan.io/' },
    etherscan: { name: 'Optimism Goerli Explorer', url: 'https://goerli-optimism.etherscan.io/' },
  },
  testnet: true,
};
const arbitrumGoerliChain = {
  id: 421613,
  name: 'Arbitrum',
  network: 'Arbitrum Goerli Testnet',
  iconUrl: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1680097630',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.goerli.arbitrum.gateway.fm'],
    },
  },
  blockExplorers: {
    default: { name: 'Arbitrum Goerli Explorer', url: 'https://goerli.arbiscan.io' },
    etherscan: { name: 'Arbitrum Goerli Explorer', url: 'https://goerli.arbiscan.io' },
  },
  testnet: true,
}
const scrollSepolia = {
  id: 534351,
  name: 'Scroll',
  network: 'Scroll Sepolia Testnet',
  iconUrl: 'https://img.foresightnews.pro/202302/842-1676968867373.png?x-oss-process=style/article_avatar',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://scroll-sepolia.blockpi.network/v1/rpc/public'],
    },
  },
  blockExplorers: {
    default: { name: 'Scroll Sepolia Explorer', url: 'https://sepolia-blockscout.scroll.io/' },
    etherscan: { name: 'Scroll Sepolia Explorer', url: 'https://sepolia-blockscout.scroll.io/' },
  },
  testnet: true,
}
const celoChain = {
  id: 44787,
  name: 'Celo',
  network: 'Celo Alfajores Testnet',
  iconUrl: 'https://pbs.twimg.com/profile_images/1613170131491848195/InjXBNx9_400x400.jpg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://alfajores-forno.celo-testnet.org	'],
    },
  },
  blockExplorers: {
    default: { name: 'Celo Alfajores Explorer', url: 'https://alfajores.celoscan.io' },
    etherscan: { name: 'Celo Alfajores Explorer', url: 'https://alfajores.celoscan.io' },
  },
  testnet: true,
};
const mantleChain = {
  id: 5001,
  name: 'Mantle',
  network: 'Mantle Testnet',
  iconUrl: 'https://pbs.twimg.com/profile_images/1597775748580134914/bLhE1aY1_400x400.jpg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Mantle Explorer', url: 'https://testnet.mantlescan.org' },
    etherscan: { name: 'Mantle Explorer', url: 'https://testnet.mantlescan.org' },
  },
  testnet: true,
};
const baseChain = {
  id: 84531,
  name: 'Base',
  network: 'Base Testnet',
  iconUrl: 'data:image/jpeg;base64,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',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'bETH',
    symbol: 'bETH',
  },
  rpcUrls: {
    default: {
      http: ['https://base-goerli.blockpi.network/v1/rpc/public'],
    },
  },
  blockExplorers: {
    default: { name: 'Base Explorer', url: 'https://testnet.mantlescan.org' },
    etherscan: { name: 'Base Explorer', url: 'https://testnet.mantlescan.org' },
  },
  testnet: true,
};
const neonEVM = {
  id: 245022926,
  name: 'Neon EVM ',
  network: 'Neon EVM DevNet',
  iconUrl: 'data:image/jpeg;base64,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',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'NEON',
    symbol: 'NEON',
  },
  rpcUrls: {
    default: {
      http: ['https://proxy.devnet.neonlabs.org/solana'],
    },
  },
  blockExplorers: {
    default: { name: 'Neon EVM DevNet Explorer', url: 'https://devnet.neonscan.org/' },
    etherscan: { name: 'Neon EVM DevNet Explorer', url: 'https://devnet.neonscan.org/' },
  },
  testnet: true,
};
const xcd = {
  id: 51,
  name: 'XDC',
  network: 'XDC Testnet',
  iconUrl: "https://xinfin.org/assets/images/brand-assets/xdc-icon.png",
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'XCD',
    symbol: 'XCD',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.apothem.network	'],
    },
  },
  blockExplorers: {
    default: { name: 'Neon EVM DevNet Explorer', url: 'https://devnet.neonscan.org/' },
    etherscan: { name: 'Neon EVM DevNet Explorer', url: 'https://devnet.neonscan.org/' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [goerliChain],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})
export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <NoSSR><NotificationProvider><Component {...pageProps} /></NotificationProvider></NoSSR></RainbowKitProvider></WagmiConfig>
  );
}
