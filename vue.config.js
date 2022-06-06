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
  publicPath: '/events/ubjk1DnkwTzclvue4GhkUkAzW65KbT_fVEf2YkBoBgo:mintickt.mintbase1.near'
}
