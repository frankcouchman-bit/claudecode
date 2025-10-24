export function Features() {
  const items = [
    { title: "SERP Research", desc: "Real-time research and intent mirroring." },
    { title: "Citations & Images", desc: "Inline citations and hero images." },
    { title: "On-Page SEO", desc: "Meta, schema, internal links, and OG." }
  ]
  return (
    <section className="container py-16 grid md:grid-cols-3 gap-6">
      {items.map(i => (
        <div key={i.title} className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg">{i.title}</h3>
          <p className="text-muted-foreground mt-2">{i.desc}</p>
        </div>
      ))}
    </section>
  )
}
