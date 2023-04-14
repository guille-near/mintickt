import { AUTH_PROVIDER, CHAIN,getUser, init, openWallet, sendTransaction, signIn, signOut, THEME, WALLET_PROVIDER } from "@ramper/near";
import {functionCall} from 'near-api-js/lib/transaction'
import Vue from 'vue'

export default function RamperApi() {
  init({
    appName: 'Music Feast',
    chainName: CHAIN.NEAR,
    walletProviders: [],
    theme: THEME.DARK,
    network: process.env.NETWORK,
    logoURI: "https://testnet.musicfeast.io/img/logo.fb7d246.svg",
    authProviders: [
      AUTH_PROVIDER.GOOGLE,
      AUTH_PROVIDER.FACEBOOK,
      AUTH_PROVIDER.EMAIL,
      AUTH_PROVIDER.TWITTER,
      AUTH_PROVIDER.APPLE,
    ]
  })

  const user = getUser()

  const item = {
    getUser,
    getAccountId: () => user ? user.wallets.near.publicKey : null,
    openWallet,
    signIn,
    signOut,
    functionCall,
    sendTransaction
  }

  Vue.prototype.$ramper = item
}

/*   when need buy
// create contract connection
const contract = new Contract(wallet.account(), item.contract_market, {
  changeMethods: ["buy"],
  sender: wallet.account(),
})
*/
