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
      config: {},
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "linux"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    }
  ],
};
