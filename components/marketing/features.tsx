import {
  BoxIcon,
  EyeIcon,
  FolderTreeIcon,
  RocketIcon,
  ShieldCheckIcon,
  WandSparklesIcon,
} from 'lucide-react'

const features = [
  {
    icon: WandSparklesIcon,
    title: 'Prompt to full-stack',
    body: 'Describe an app in plain English and SprintBuild scaffolds the project, writes the code, and runs it for you.',
  },
  {
    icon: BoxIcon,
    title: 'Vercel Sandbox execution',
    body: 'Each session spins up an ephemeral Vercel Sandbox so the agent can install packages, run scripts, and test the app safely.',
  },
  {
    icon: EyeIcon,
    title: 'Live preview',
    body: 'A built-in preview pane shows your app the moment the agent boots a dev server. No copy-paste, no local setup.',
  },
  {
    icon: FolderTreeIcon,
    title: 'File explorer',
    body: 'Browse the generated source tree, read any file, and follow the agent as it edits and refactors.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Auto-fix on errors',
    body: 'Build failures and runtime errors stream back to the agent so it can patch issues without you babysitting the loop.',
  },
  {
    icon: RocketIcon,
    title: 'One-click deploy',
    body: 'When you like what you see, deploy the project to Vercel and keep iterating from there.',
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-[#f0f0ee]"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
          What you get
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
          A coding agent that actually ships.
        </h2>
        <p className="text-[14px] text-gray-500 max-w-xl mb-12">
          SprintBuild combines a frontier-model agent with real execution and a
          live preview so you can go from idea to working app without ever
          leaving the browser.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-black/5 bg-white/70 backdrop-blur p-6 hover:bg-white transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EDEDED] flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-gray-700" />
              </div>
              <h3 className="text-[15px] font-medium text-gray-900 mb-1.5">
                {title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
