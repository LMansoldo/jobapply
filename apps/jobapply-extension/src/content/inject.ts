import { CLOSE_OVERLAY, OPEN_OVERLAY, type ExtensionMessage } from '../shared/messages'

const HOST_ID = 'jobapply-overlay-host'

let previousOverflow: string | null = null

function mountOverlay(): void {
  if (document.getElementById(HOST_ID)) return
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  const host = document.createElement('div')
  host.id = HOST_ID
  const shadow = host.attachShadow({ mode: 'open' })
  const frame = document.createElement('iframe')
  frame.src = chrome.runtime.getURL('src/overlay/overlay.html')
  frame.title = 'JobApply'
  frame.style.cssText = [
    'position:fixed',
    'inset:0',
    'width:100vw',
    'height:100vh',
    'z-index:2147483647',
    'border:none',
    'background:#f5f3ff'
  ].join(';')
  shadow.appendChild(frame)
  document.body.appendChild(host)
}

function unmountOverlay(): void {
  document.getElementById(HOST_ID)?.remove()
  if (previousOverflow !== null) {
    document.body.style.overflow = previousOverflow
    previousOverflow = null
  }
}

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message?.type === OPEN_OVERLAY) {
    mountOverlay()
  }
  if (message?.type === CLOSE_OVERLAY) {
    unmountOverlay()
  }
})
