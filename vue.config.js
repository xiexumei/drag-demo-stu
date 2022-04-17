const { defineConfig } = require('@vue/cli-service')

const isProd = process.env.NODE_ENV === 'production'
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: isProd ? '/visual-drag-demo/' : './'
})
