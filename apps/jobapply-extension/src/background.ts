import { CLOSE_OVERLAY, OPEN_OVERLAY } from './shared/messages'
import { saveCapturedJob } from './shared/storage'

const MENU_ID = 'jobapply-copy-job-description'

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'Copy Job Description',
      contexts: ['selection']
    })
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id) return
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection()?.toString() ?? ''
  })
  const jdText = results[0]?.result ?? ''
  await saveCapturedJob({
    jdText,
    sourceUrl: info.pageUrl ?? tab.url ?? '',
    capturedAt: new Date().toISOString()
  })
  await openOverlay(tab.id)
})

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === CLOSE_OVERLAY) {
    void relayCloseToActiveTab()
  }
})

async function openOverlay(tabId: number): Promise<void> {
  try {
    await chrome.tabs.sendMessage(tabId, { type: OPEN_OVERLAY })
  } catch {
    await openOverlayInNewTab()
  }
}

function openOverlayInNewTab(): Promise<chrome.tabs.Tab | undefined> {
  return chrome.tabs.create({
    url: `${chrome.runtime.getURL('src/overlay/overlay.html')}?jd=1`
  })
}

async function relayCloseToActiveTab(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  if (!tab?.id) return
  try {
    await chrome.tabs.sendMessage(tab.id, { type: CLOSE_OVERLAY })
  } catch {
    return
  }
}
