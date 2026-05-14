const slideRenderers = {
  heading: ({ value }) => (
    <h2 className="text-2xl font-bold text-on-surface leading-tight">{value}</h2>
  ),
  text: ({ value }) => (
    <div
      className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed
        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-on-surface [&_h2]:mb-2
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-on-surface [&_h3]:mb-1
        [&_strong]:font-semibold [&_strong]:text-on-surface
        [&_em]:italic
        [&_u]:underline
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
        [&_p]:mb-2 last:[&_p]:mb-0
        [&_[style*='text-align:_center']]:text-center
        [&_[style*='text-align:_right']]:text-right"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  ),
  image: ({ value }) => (
    <img
      src={value}
      alt="Ilustrasi materi"
      className="w-full rounded-xl object-cover max-h-64"
    />
  ),
}

export default function MaterialSlide({ item }) {
  if (!item) {
    return (
      <p className="text-on-surface-variant text-center py-8">Konten belum tersedia</p>
    )
  }

  const Renderer = slideRenderers[item.type]
  if (!Renderer) {
    return <p className="text-on-surface-variant">{item.value}</p>
  }

  return <Renderer value={item.value} />
}
