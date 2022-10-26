<template>
	<div id="burn" class="center" style="margin-block: 140px 80px">
		<ModalSuccess ref="modal"></ModalSuccess>
		<v-sheet
			color="transparent"
			class="tcenter divcol center"
			style="gap: 1em"
			max-width="max-content"
		>
			<h3 class="p">Token # {{ token }}</h3>
			<img src="@/assets/img/burn-ticket.jpg" alt="burn ticket" />
			<div class="divcol" style="gap: 0.5em">
				<h3 class="p">{{ title }} ({{ extra }})</h3>
				<p>Burn this NFT so event staff let you in at the venue.</p>
			</div>
			<v-btn
				class="fill-w mt-n3"
				:disabled="disable"
				:loading="loading"
				@click="burn"
				>Burn it</v-btn
			>
		</v-sheet>
	</div>
</template>

<script>
import gql from "graphql-tag";
import ModalSuccess from "./ModalSuccess";
import { Wallet, Chain, Network, MetadataField } from "mintbase";
const mb_views_nft_tokens = gql`
  query MyQuery($_iregex: String!, $owner: String!, $extra: String!) {
  mb_views_nft_tokens(
    where: {owner: {_eq: $owner}
      , reference_blob: {_cast: {String: {_iregex: $_iregex}}}
      , extra: {_eq: $extra} , burned_receipt_id: {_is_null: true}}
    order_by: {token_id: asc}  
  ) {
    token_id
    title
    extra
  }
}
`;
const goodies = gql`
  query MyQuery($_iregex: String!, $owner: String!) {
  mb_views_nft_tokens(
    where: {owner: {_lte: $owner}
      , reference_blob: {_cast: {String: {_iregex: $_iregex}}}
      , extra: {_eq: "redeemed"} , burned_receipt_id: {_is_null: true}}
    order_by: {token_id: asc}
  ) {
    token_id
    title
    extra
  }
}
`;
export default {
  name: "Burn",
  components: {
    ModalSuccess
  },
  data() {
    return {
      token: "",
      token_goodie: "",
      title: "",
      extra: "", 
      disable: true,
      loading: false,
      meta: ""
    };
  },
  mounted() {
    this.getData();
    //Show the modal and send the goodie if the result is goodie
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
    const user = datos.accountId;
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "goodie"
    ) {
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url = this.$explorer + "/accounts/" + user;
      this.sendTicket();
      // history.replaceState(
      //   null,
      //   location.href.split("?")[0],
      //   "/mintickt/#/events/register"
      // );
    }
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "last"
    ) {
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url = this.$explorer + "/accounts/" + user;
      // history.replaceState(
      //   null,
      //   location.href.split("?")[0],
      //   "/mintickt/#/events/register"
      // );
    }
  },
  methods: {
    async getData() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      this.$apollo
        .query({
          query: mb_views_nft_tokens,
          variables: {
            _iregex: this.$route.query._iregex.toLowerCase(),
            owner: user,
            extra: this.$route.query.extra,
          },
        })
        .then((response) => {
          response.data.mb_views_nft_tokens.length > 0 ? this.disable = false : this.disable = true;
          var extra = response.data.mb_views_nft_tokens[0].extra;
          const str2 = extra.charAt(0).toUpperCase() + extra.slice(1);
          this.token = response.data.mb_views_nft_tokens[0].token_id;
          this.title = response.data.mb_views_nft_tokens[0].title;
          this.extra = str2;
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    //Getting the goodies to send the first token found
    async sendTicket() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      this.$apollo
        .query({
          query: goodies,
          variables: {
            _iregex: this.$route.query._iregex.toLowerCase(),
            owner: user
          },
        })
        .then((response) => {
          response.data.mb_views_nft_tokens.length > 0 ? this.disable = false : this.disable = true;
          const url =  this.$node_url + "/nft-transfer";
          let datos = JSON.parse(
            localStorage.getItem("Mintbase.js_wallet_auth_key")
          );
          const user = datos.accountId;
          //console.log(url)
          let item = {
            receiver_id: user,
            token_id: response.data.mb_views_nft_tokens[0].token_id,
          };
          console.log(item)
          this.axios
            .post(url, item)
            .then(() => {
              console.log('Hash up')
            })
            .catch((error) => {
              console.log(error);
            });
              console.log(this.token_goodie)
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async burn() {
        // console.log(this.dataTickets.attendees);
        this.loading = true;
        //Api key an data
        var meta = this.$route.query.extra === "ticketing" ? "goodie" : "last"
        let API_KEY = this.$dev_key.toString();
        let networkName = this.$networkName.toString();
        const { data: walletData } = await new Wallet().init({
          networkName: networkName,
          chain: Chain.near,
          apiKey: API_KEY,
        });
        const { wallet } = walletData;

        var tokens = [];
        tokens.push(this.token)

        await wallet.burn(
          tokens,
          this.$store_mintbase,
          {
            meta: meta
          }
        );
    },
  },
};
</script>

<style scoped lang="scss">
	img {
		max-width: clamp(208px, 20vw, 265px);
		background: linear-gradient(338.88deg, #efe1d4 28.41%, #ffffff 101.9%),
			linear-gradient(180deg, #000000 0%, #272727 100%);
	}
	h3 {
		font-family: sans-serif;
		font-weight: 600;
		font-size: 25px;
		line-height: 25px;
		letter-spacing: -0.03em;
		color: #ffffff !important;
	}
	p {
		font-family: "SF Pro", sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 13px;
		line-height: 16px;
		color: rgba(255, 255, 255, 0.5) !important;
	}
	.v-btn {
		margin-top: 1.5em;
		min-height: 39px !important;
		color: #ffffff !important;
		background: linear-gradient(0deg, #000000 -42.31%, rgba(0, 0, 0, 0) 50%),
			#cc00b7 !important;
		border-radius: 10px;
		span {
			font-family: "Proxima Nova", sans-serif;
			font-weight: 700;
			font-size: 15px;
			line-height: 15px;
			letter-spacing: -0.03em;
		}
	}
</style>
