import { urlToBase64, base64ToBlob } from './base64'

export function windowOpenByUrl(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

export function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  blobPart?: BlobPart,
) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, blobPart)
  })
}

export function downloadByBase64(
  buffer: string,
  filename: string,
  mime?: string,
  blobPart?: BlobPart,
) {
  const base64Buf = base64ToBlob(buffer)
  downloadByData(base64Buf, filename, mime, blobPart)
}

export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  blobPart?: BlobPart,
) {
  const blobData = typeof blobPart !== 'undefined' ? [blobPart, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: TargetContext
  fileName?: string
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    // const event = document.createEvent('MouseEvent')
    // event.initEvent('resize', true, true)
    const mouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    link.dispatchEvent(mouseEvent)
    return true
  }
  if (url.indexOf('?') === -1) {
    url += '?download'
  }
  windowOpenByUrl(url, { target })
  return true
}
