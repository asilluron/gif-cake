const { default: notarize } = require('@electron/notarize');

module.exports = {
  packagerConfig: {
    icon: 'build/icon',
    appBundleId: 'com.silluron.gifcake',
    osxSign: {},
    osxNotarize: process.env.APPLEID
      ? {
          appleId: process.env.APPLEID,
          appleIdPassword: process.env.APPLEIDPASS,
          teamId: process.env.ASCPROVIDER,
        }
      : undefined,
    extraResource: ['./extraResources'],
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './build/background.png',
        format: 'ULFO',
        icon: './build/icon.icns',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main/index.ts',
            config: 'vite.main.config.ts',
            target: 'main',
          },
          {
            entry: 'src/preload.ts',
            config: 'vite.preload.config.ts',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.ts',
          },
        ],
      },
    },
  ],
};

