import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'dcflbleb',
    dataset: 'production'
  },
  deployment: {
    appId: 'xwphevl2nk0ro4452sdwyb7t', // 👈 加上这行，绑定线上部署的 App ID
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})