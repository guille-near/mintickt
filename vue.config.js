module.exports = {
  configureWebpack:{
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 500000,
      }
    }
},
  "transpileDependencies": [
    "vuetify"
  ],
  //  publicPath: '/events/dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near'
  publicPath: '/events/dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near'
}
