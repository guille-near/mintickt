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
  publicPath: '/events/JHAaTXCxCoomlZ2WktgmVHBx2hAPEZfSiDxd1kMxNXc:mintickt.mintbase1.near'
}
