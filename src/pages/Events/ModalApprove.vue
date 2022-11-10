<template>
	<v-dialog v-model="modalApprove" max-width="430px" persistent>
		<v-card id="modalSucess">
			<div class="divcol center">
				<h3 class="p">One final Step!</h3>
				<p class="p mt-3">Approve the transfer for goodies and let me in.</p>
			</div>

			<div class="divcol center">
				<v-btn @click="approve" :loading="loading">Approve</v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import gql from "graphql-tag";
import { Wallet, Chain } from "mintbase";
const mb_views_nft_tokens = gql`
  query MyQuery($_iregex: String!) {
  mb_views_nft_tokens(
    where: {reference_blob: {_cast: {String: {_iregex: $_iregex}}}}
  ) {
    token_id
  }
}
`;
export default {
  name: "ModalApprove",
  data() {
    return {
      modalApprove: false,
      url: '',
      tokens_id: [],
      txs: [],
      arr: [],
      loading: false
    };
  },
  mounted() {
    this.getData();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    ///Mint option
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "approve"
    ) {
      this.gotToEvents();
    }
  },
  methods: {
    async getData() {
      this.$apollo
        .mutate({
          mutation: mb_views_nft_tokens,
          variables: {
            _iregex: localStorage.getItem("metadata_id") === null ? "" : localStorage.getItem("metadata_id").split(":")[1]
          },
        })
        .then((response) => {
          this.tokens_id = response.data.mb_views_nft_tokens;
          for (const prop in this.tokens_id) {
            this.arr.push(this.tokens_id[prop].token_id);
          }
          //console.log(this.arr)
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async approve() {
        //Upload ipfs
        this.getData();
        this.loading = true;
        const mintbase_marketplace = this.$mintbase_marketplace;
        this.txs.push({
              receiverId: mintbase_marketplace,
              functionCalls: [
                {
                  methodName: "nft_batch_approve",
                  receiverId: mintbase_marketplace,
                  gas: "300000000000000",
                  args: {
                    token_ids : this.arr,
                    account_id: this.$owner,
                    msg: ""
                  },
                  deposit: "800000000000000000000"
                },
              ],
            });
        this.executeMultipleTransactions();
    },
    async executeMultipleTransactions() {
      //Gettintg the tokens ID
      //this.getTokensId();
      //Adding metadata for the burn ticket
      let API_KEY = this.$dev_key.toString();
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;

      await wallet.executeMultipleTransactions({
        transactions: this.txs,
        options: {
          callbackUrl: this.$event_page,
          meta: "approve",
        },
      });
    },
    gotToEvents(){
      this.step = 1;
      localStorage.setItem("step", this.step);
      this.$router.push("/events");
      localStorage.removeItem("canvas");
      localStorage.removeItem("canvas_burn");
      localStorage.removeItem("canvas_goodie");
      //localStorage.removeItem("canvas_main_image");
      localStorage.removeItem("dataFormDate");
      localStorage.removeItem("dataFormDescription");
      localStorage.removeItem("dataFormLocation");
      localStorage.removeItem("dataFormLongitude");
      localStorage.removeItem("dataFormLatitude");
      localStorage.removeItem("dataFormPlaceId");
      localStorage.removeItem("dataFormName");
      localStorage.removeItem("dataFormPromoter");
      localStorage.removeItem("dataFormMintAmount");
      localStorage.removeItem("amount_list");
      localStorage.removeItem("price");
      localStorage.removeItem("dataFormAttendees");
      localStorage.removeItem("dataFormGoodies");
      localStorage.removeItem("tempid");
      localStorage.removeItem("mint_amount");
      localStorage.removeItem("mint_tittle");
      localStorage.removeItem("canvas_main_image");
      localStorage.removeItem("total_minted");
      localStorage.removeItem("metadata");
      localStorage.removeItem("total_minted");
      localStorage.removeItem("metadata");
      localStorage.removeItem("IpfsHash");
      localStorage.removeItem("metadata_reference");
      localStorage.removeItem("eventid");
      localStorage.removeItem("event_name");
      //localStorage.removeItem("metadata_id");
    },
  }
};
</script>

<style src="../pages.scss" lang="scss" />
