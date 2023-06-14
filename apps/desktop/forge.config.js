module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'davidsdevel',
          name: 'cloud-storage'
        },
        prerelease: true
      }
    }
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'saga-storage',
        authors: "David's Devel",
        iconUrl:
          'https://raw.githubusercontent.com/electron/fiddle/0119f0ce697f5ff7dec4fe51f17620c78cfd488b/assets/icons/fiddle.ico',
        noMsi: true
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux']
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux']
    }
  ],
};
