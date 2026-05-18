const steps = [
  {
    n: '01',
    title: 'Describe your app',
    body: 'Type a prompt — "an invoice tracker with auth and CSV export" — and pick a model.',
  },
  {
    n: '02',
    title: 'Agent builds it live',
    body: 'SprintBuild boots a Vercel Sandbox, scaffolds the project, writes files, and starts a dev server while you watch.',
  },
  {
    n: '03',
    title: 'Iterate and deploy',
    body: 'Review the preview, ask for changes, then ship to Vercel when it looks right.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how"
      className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-[#f0f0ee]"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-12">
          Three steps from prompt to product.
        </h2>

        <ol className="grid md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-black/5 bg-white p-6"
            >
              <span className="text-[11px] uppercase tracking-[0.18em] text-blue-500 font-mono font-medium">
                {step.n}
              </span>
              <h3 className="text-[16px] font-medium text-gray-900 mt-3 mb-2">
                {step.title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
