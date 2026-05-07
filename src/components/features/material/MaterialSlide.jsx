const slideRenderers = {
  heading: ({ value }) => (
    <h2 className="text-2xl font-bold text-on-surface leading-tight">{value}</h2>
  ),
  text: ({ value }) => (
    <p className="text-base text-on-surface-variant leading-relaxed">{value}</p>
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
