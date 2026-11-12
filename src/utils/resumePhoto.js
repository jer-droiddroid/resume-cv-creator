const MAX_PHOTO_BYTES = 10 * 1024 * 1024

// Normalize uploads to a small, PDF-compatible square instead of storing originals.
export async function prepareResumePhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('Choose an image smaller than 10 MB.')
  }

  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const side = Math.min(image.naturalWidth, image.naturalHeight)
    if (!side) throw new Error('Empty image')
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 600
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 600, 600)
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 600, 600)
    return canvas.toDataURL('image/jpeg', 0.9)
  } catch {
    throw new Error('This image could not be opened. Try another JPG, PNG, or WebP image.')
  } finally {
    URL.revokeObjectURL(url)
  }
}
