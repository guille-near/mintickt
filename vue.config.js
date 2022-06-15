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
  publicPath: '/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near.'
}
