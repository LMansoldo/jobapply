import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'JobApply',
  version: '0.1.0',
  description: 'Capture a descrição da vaga e prepare seu CV para o ATS.',
  action: {},
  background: {
    service_worker: 'src/background.ts',
    type: 'module'
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/inject.ts'],
      run_at: 'document_idle'
    }
  ],
  permissions: ['contextMenus', 'storage', 'scripting', 'activeTab'],
  host_permissions: ['http://localhost:3030/*'],
  web_accessible_resources: [
    {
      matches: ['<all_urls>'],
      resources: ['src/overlay/overlay.html']
    }
  ]
})
