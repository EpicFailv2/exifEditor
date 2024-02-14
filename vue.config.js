module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    port: 55000,
    client: {
      webSocketURL: 'ws://localhost:55000/ws',
      logging: 'none',
      // logLevel: 'silent',
    },
  },
  pluginOptions: {
    i18n: {
      locale: "lt",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },
};
