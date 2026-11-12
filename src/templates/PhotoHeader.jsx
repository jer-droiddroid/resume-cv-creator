import { Image, View } from '@react-pdf/renderer'

export function PdfResumePhoto({ photo }) {
  return photo ? <Image src={photo} style={{ width: 144, height: 144, objectFit: 'cover', marginBottom: 12 }} /> : null
}

// PDF points are 1/72 inch: keep the photo at 144pt even in compact themes.
export default function PhotoHeader({ photo, children }) {
  if (!photo) return children
  return (
    <View wrap={false} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
      <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
      <PdfResumePhoto photo={photo} />
    </View>
  )
}
