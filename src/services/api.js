//Cross-domain proxy prefix
// const API_PROXY_PREFIX='/api'
//const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const network = process.env.VUE_APP_NETWORK
const enviroment = false
const NETWORK = (enviroment) ? network : network;

function CONFIG(keyStores) {
  switch (NETWORK) {
    case "mainnet":
      return {
        networkId: "mainnet",
        keyStore: keyStores,
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://app.mynearwallet.com/",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
      };
    case "testnet":
      return {
        networkId: "testnet",
        keyStore: keyStores,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    default:
      throw Error(`Unconfigured environment '${NETWORK}'`);
  }
}

module.exports = {
  CONFIG,
};
