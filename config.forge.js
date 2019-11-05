config = {
  icon: 'assets/icons/icon.icns',
  appBundleId: 'com.silluron.gifcake',
  osxSign: true
}

config.ignore = (file) => {
  if (!file) return false;

  return !/^[/\\]\.webpack($|[/\\]).*$/.test(file);
}

module.exports = {
  buildIdentifier: 'com.silluron.gifcake',
  packagerConfig: config,
  "mac": {
    "hardenedRuntime": true
  },
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        background: './assets/dmg-background.png',
        format: "ULFO",
        icon: './assets/icons/icon.icns'       
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
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
