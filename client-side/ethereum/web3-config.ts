import Web3 from "web3";

let web3: Web3;

// if (typeof window !== "undefined" && typeof window.ethereum! !== "undefined") {
//   // We are in the browser and metamask is running.
//   window.ethereum!.request({ method: "eth_requestAccounts" });
//   web3 = new Web3(window.ethereum!);
// } else {
// We are on the server *OR* the user is not running metamask
// const provider = new Web3.providers.HttpProvider(
//   'https://speedy-nodes-nyc.moralis.io/2c6e94da4d4dabdf417f05a7/bsc/testnet'
// );
// web3 = new Web3(provider);
// }

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  const params = [
    {
      chainId: "0x61", // 56 in decimal
      chainName: "BSC Testnet",
      rpcUrls: [
        "https://speedy-nodes-nyc.moralis.io/2c6e94da4d4dabdf417f05a7/bsc/testnet",
      ],
      nativeCurrency: {
        name: "Binance Coin",
        symbol: "tBNB",
        decimals: 18,
      },
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
  ];
  ethereum.request({
    method: "wallet_addEthereumChain",
    params,
  });
  web3 = new Web3(ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://speedy-nodes-nyc.moralis.io/2c6e94da4d4dabdf417f05a7/bsc/testnet"
  );
  web3 = new Web3(provider);
}

export default web3;
