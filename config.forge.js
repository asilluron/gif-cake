module.exports = {
  packagerConfig: {
    icon: 'assets/icons/icon.icns'
  },
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        background: './assets/dmg-background.png',
        format: "ULFO",
        icon: './assets/icons/icon.icns',
        additionalDMGOptions: {
          "code-sign": {
            "identifier": "com.silluron.gifcake",
            "signing-identity": "REPLACE"
          }
        }
      }
    }
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "html": "./src/index.html",
              "js": "./src/App.tsx",
              "name": "main_window"
            }
          ]
        }
      }
    ]
  ]
}
