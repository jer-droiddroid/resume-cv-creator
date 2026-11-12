export function ResumePhoto({ photo }) {
  return photo ? <img src={photo} alt="Resume portrait" className="mb-3 aspect-square w-[157px] max-w-full shrink-0 object-cover" /> : null
}

export default function PhotoHeader({ photo, children }) {
  if (!photo) return children
  return (
    <div className="mb-3 flex items-start gap-4">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="w-[26.5%] shrink-0"><ResumePhoto photo={photo} /></div>
    </div>
  )
}
