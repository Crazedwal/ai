// src/components/ui/DevLog.jsx

const CHANGELOG = [
  {
    version: "0.4.0",
    date: "2026-03-15",
    changes: [
      "Removed login requirement — app is now open to anyone",
      "Added DeepSeek V3, DeepSeek R1, and Mistral 7B as free models",
      "Fixed streaming to respect selected model instead of always using Nemotron",
      "Removed Stripe/token payment system",
    ]
  },
  {
    version: "0.3.0",
    date: "2026-03-15",
    changes: [
      "Added Google sign-in via Firebase Authentication",
      "Added email/password sign-in",
      "Auth gate — only signed-in users could access the app",
      "User avatar and logout button in sidebar",
      "Deployed to Vercel",
    ]
  },
  {
    version: "0.2.0",
    date: "2026-03-15",
    changes: [
      "Added model selector with free and paid tiers",
      "Added token balance system",
      "Added language selector",
      "Added customizable assistant name",
      "Added dark mode support",
    ]
  },
  {
    version: "0.1.0",
    date: "2026-03-15",
    changes: [
      "Initial build — basic chat UI",
      "OpenRouter API integration",
      "Streaming responses",
      "Conversation history sidebar",
    ]
  }
]

const DEVLOG = [
  {
    date: "2026-03-15",
    title: "Open access & more models",
    body: "Decided to drop the login wall entirely. Anyone with the link can now use the app. Also added more free models from OpenRouter — DeepSeek R1 and V3 are surprisingly good for free. Fixed a bug where the streaming function always defaulted to Nemotron regardless of what model was selected."
  },
  {
    date: "2026-03-15",
    title: "Deploying to Vercel — harder than expected",
    body: "Getting Vercel to build the project took way more effort than it should have. The TypeScript build step was failing because the project mixes .tsx and .jsx files. Fixed it by overriding the build command to just `vite build`. Also had issues with GitHub accounts — the Vercel project was connected to a different account than where the code was being pushed."
  },
  {
    date: "2026-03-15",
    title: "Added Firebase Auth",
    body: "Integrated Google sign-in and email/password auth using Firebase. Initially also added Microsoft OAuth but removed it to keep things simple. The Google popup was closing instantly until I realized I hadn't enabled Google sign-in in the Firebase console and hadn't set a support email."
  },
  {
    date: "2026-03-15",
    title: "Project started",
    body: "Started building an AI chat app using React + Vite. Using OpenRouter as the API layer so I can swap models easily. Got basic chat working with streaming responses on day one."
  }
]

const REFLECTION = `
This project started as a simple chat UI and grew into a full app with auth, model switching, and deployment.

The biggest lessons:

**Keep it simple.** The auth system, token economy, and Stripe integration added a lot of complexity for features that weren't actually needed. Removing login and Stripe made the app more accessible and easier to maintain.

**Deployment is its own beast.** Writing code locally is one thing — getting it to build and run on Vercel with the right environment variables, correct GitHub repo connections, and build command overrides is a whole separate challenge.

**OpenRouter is great for prototyping.** Being able to switch between Llama, DeepSeek, Mistral, and Gemma with just a model ID string is really powerful. Free tier models are good enough for most use cases.

**What I'd do differently:** Start with a clear decision on whether auth is needed before building it. Set up CI/CD from the beginning so deployments are automatic on every push.
`.trim()

export default function DevLog({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-bold">DevLog & Changelog</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-8">

          {/* Changelog */}
          <section>
            <h3 className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">Changelog</h3>
            <div className="space-y-4">
              {CHANGELOG.map(entry => (
                <div key={entry.version}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-white font-semibold">v{entry.version}</span>
                    <span className="text-xs text-gray-500">{entry.date}</span>
                  </div>
                  <ul className="space-y-0.5 pl-3">
                    {entry.changes.map((c, i) => (
                      <li key={i} className="text-sm text-gray-300 before:content-['–'] before:mr-2 before:text-gray-500">{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Devlog */}
          <section>
            <h3 className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">Devlog</h3>
            <div className="space-y-4">
              {DEVLOG.map((entry, i) => (
                <div key={i} className="border-l-2 border-gray-700 pl-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-white">{entry.title}</span>
                    <span className="text-xs text-gray-500">{entry.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{entry.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Reflection */}
          <section>
            <h3 className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">Reflection</h3>
            <div className="text-sm text-gray-400 leading-relaxed space-y-3">
              {REFLECTION.split("\n\n").map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
