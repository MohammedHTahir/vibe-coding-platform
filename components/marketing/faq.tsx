const faqs = [
  {
    q: 'Do I need to install anything?',
    a: 'No. The agent runs the code inside a Vercel Sandbox, and the preview streams back to your browser.',
  },
  {
    q: 'What stack does the agent build with?',
    a: 'SprintBuild defaults to Next.js, TypeScript, and Tailwind, but the agent can scaffold any Node-based stack.',
  },
  {
    q: 'Which models are supported?',
    a: 'Claude Opus 4.6 and Sonnet 4.6, GPT-5.3 Codex, and Grok 4.1 Reasoning. Add more by configuring the Vercel AI Gateway.',
  },
  {
    q: 'Is my code private?',
    a: 'Each session runs in an isolated, ephemeral sandbox. When the session ends, the sandbox is torn down.',
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-white border-t border-black/5"
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
          FAQ
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-10">
          Questions, answered.
        </h2>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-black/5 bg-[#f7f7f5] open:bg-white transition-colors"
            >
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between text-[14px] font-medium text-gray-900">
                {item.q}
                <span className="ml-4 text-blue-500 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 -mt-1 text-[13px] text-gray-500 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
