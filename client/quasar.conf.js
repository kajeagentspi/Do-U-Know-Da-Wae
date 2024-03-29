// Configuration for your app

module.exports = function(ctx) {
  return {
    // app plugins (/src/plugins)
    boot: ["leaflet", "vue-fragment", "firebase", "components", "axios"],

    css: ["app.styl"],

    extras: [
      "roboto-font",
      "material-icons", // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      "fontawesome-v5"
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        "QCard",
        "QCardSection",
        "QCardActions",
        "QToolbar",
        "QBtnGroup",
        "QBtn",
        "QSeparator",
        "QItem",
        "QItemSection",
        "QItemLabel",
        "QScrollArea",
        "QAvatar",
        "QInput",
        "QSpace",
        "QPageContainer",
        "QLayout",
        "QPageSticky",
        "QIcon",
        "QExpansionItem",
        "QDialog",
        "QTooltip"
      ],

      directives: ["Ripple", "ClosePopup"],

      // Quasar plugins
      plugins: ["Notify", "Dialog"]

      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      vueRouterMode: "history",
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/
        });
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all' --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      workboxPluginMode: "InjectManifest",
      workboxOptions: {},
      manifest: {
        name: "Do U Know Da Wae",
        short_name: "DUKDW",
        description: "Crowdsourced UPLB Campus Map",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
    },

    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      }
    }
  };
};
