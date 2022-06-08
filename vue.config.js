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
  publicPath: '/events/_PnIG4wSbOt95cdArvYIeHqzlP3fQoTLN1XDxY1SNkQ:mintickt.mintbase1.near'
}
