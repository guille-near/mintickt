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
  publicPath: '/events/1g69uL5UfbdIZVIajiu3Tpo44ypZY2H88pN5VHpcriE:mintickt.mintbase1.near'
}
