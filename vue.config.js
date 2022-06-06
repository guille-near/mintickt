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
  publicPath: '/events/vIjQFtDJQDg7EjtCiUSlq-2DuM968am82IoDptKufPc:mintickt.mintbase1.near'
}
