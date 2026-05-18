const models = [
  { name: 'Claude Opus 4.6', provider: 'Anthropic' },
  { name: 'Claude Sonnet 4.6', provider: 'Anthropic' },
  { name: 'GPT-5.3 Codex', provider: 'OpenAI' },
  { name: 'Grok 4.1 Reasoning', provider: 'xAI' },
]

export function Models() {
  return (
    <section
      id="models"
      className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-white border-y border-black/5"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
          Best model for the job
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
          Pick a frontier model. Switch any time.
        </h2>
        <p className="text-[14px] text-gray-500 max-w-xl mb-12">
          SprintBuild routes through the Vercel AI Gateway so you can swap
          between Claude, GPT, and Grok without changing keys or code.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-black/5 bg-[#f7f7f5] p-5 flex flex-col gap-1"
            >
              <span className="text-[11px] uppercase tracking-[0.16em] text-gray-400 font-medium">
                {model.provider}
              </span>
              <span className="text-[15px] font-medium text-gray-900">
                {model.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
