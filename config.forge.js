config = {
  icon: 'assets/icons/icon.icns',
}

config.ignore = (file) => {
  if (!file) return false;

  return !/^[/\\]\.webpack($|[/\\]).*$/.test(file);
}

module.exports = {
  packagerConfig: config,
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
            "signing-identity": "02B0BFD2DEDD6F7DE2E912C723267ED7521BF88E"
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
