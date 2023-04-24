import * as nearAPI from 'near-api-js'
import Vue from 'vue'

export default async function NearApi() {
  const{ connect, keyStores, WalletConnection, utils, Contract } = nearAPI,
  keyStore = new keyStores.BrowserLocalStorageKeyStore()
  let config
  if (process.env.VUE_APP_NETWORK === "mainnet") {
    config = {
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
      keyStore,
      walletUrl: "https://wallet.near.org", 
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    }
  } else {
    config = {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      keyStore,
      walletUrl: "https://wallet.testnet.near.org", 
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }
  }
  
  // connect to NEAR
  const near = await connect(config)
  // create wallet connection
  const wallet = new WalletConnection(near)
  
  Vue.prototype.$wallet = wallet
  Vue.prototype.$contract = Contract
  Vue.prototype.$utils = utils
  Vue.prototype.$near = near
}

/*   when need buy
// create contract connection
const contract = new Contract(wallet.account(), item.contract_market, {
  changeMethods: ["buy"],
  sender: wallet.account(),
})
*/
