export function base64ToBlob(base64: string): Blob {
  const base64Split = base64.split(',')
  const type = base64Split[0]
  const mime = type.match(/:(.*?);/)![1]
  const buffer = window.atob(base64Split[1])
  let length = buffer.length
  const uint8Array = new Uint8Array(length)
  while (length--) {
    uint8Array[length] = buffer.charCodeAt(length)
  }
  return new Blob([uint8Array], { type: mime })
}

export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>
    const context = canvas!.getContext('2d')

    const image = new Image()
    image.crossOrigin = ''
    image.onload = function () {
      if (!canvas || !context) {
        return reject()
      }
      canvas.height = image.height
      canvas.width = image.width
      context.drawImage(image, 0, 0)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    }
    image.src = url
  })
}
