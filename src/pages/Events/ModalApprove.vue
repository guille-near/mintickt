<template>
	<v-dialog v-model="modalApprove" max-width="450px" persistent>
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
import * as nearAPI from "near-api-js";
const { utils } = nearAPI;
const mb_views_nft_tokens = gql`
  query MyQuery($_iregex: String!) {
  mb_views_nft_tokens(
    where: {reference_blob: {_cast: {String: {_iregex: $_iregex}}}
      , burned_receipt_id: {_is_null: true}}
    order_by: {token_id: asc}
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
      length: 0,
      loading: false,
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
      localStorage.removeItem('to_approve')
      this.gotToEvents();
    }
    //  if (urlParams.get("errorCode") !== null) {
    //   localStorage.removeItem('to_approve')
    //   this.gotToEvents();
    // }
  },
  methods: {
    async getData() {
      this.$apollo
        .mutate({
          mutation: mb_views_nft_tokens,
          variables: {
            _iregex: localStorage.getItem("metadata_id").split(":")[1]
          },
        })
        .then((response) => {
          //get all the tokens to be approve
          this.tokens_id = response.data.mb_views_nft_tokens;
          //this.length = response.data.mb_views_nft_tokens.length * 0.0008;
          //then loop it and filter using a node service, this service
          //return null if it does not have approval id
          //if it's null then we build the array with the number's needed
          //all this to avoid pay extra fee's
          for (const prop in this.tokens_id) {
            //console.log(this.tokens_id[prop].token_id)
            const url =  this.$node_url + "/nft-get-tokens";
            let item = {
                token_id: this.tokens_id[prop].token_id,
                account_id: "andresdom.near"
            };
            this.axios
                .post(url, item)
                .then((res) => {
                  //console.log(res.data)
                  if(res.data === null){
                    this.arr.push(this.tokens_id[prop].token_id);
                    localStorage.setItem('to_approve', this.tokens_id[prop].token_id)
                  } else {
                    localStorage.removeItem('to_approve');
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async approve() {
        //Upload ipfs
        this.getData();
        this.loading = true;
        this.length = this.arr.length *  0.0008;
        this.txs.push({
            receiverId: this.$store_mintbase,
             functionCalls: [
              {
               methodName: "nft_batch_approve",
               receiverId: this.$store_mintbase,
               gas: "300000000000000",
               args: {
                 token_ids : this.arr,
                 account_id: this.$owner,
               },
              deposit: utils.format.parseNearAmount(this.length.toString())
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
