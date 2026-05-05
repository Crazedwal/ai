import { useState } from "react"

const PROFILE_KEY  = "userProfile"
const DONE_KEY     = "profileSetupDone"

export function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") } catch { return null }
}

export function hasSeenSetup() {
  return localStorage.getItem(DONE_KEY) === "true"
}

function markDone() {
  localStorage.setItem(DONE_KEY, "true")
}

// ─── CHOOSE SCREEN ────────────────────────────────────────────────────────────
function ChooseScreen({ onDetailed, onQuick, onSkip }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-content bg-black/60 backdrop-blur-sm"
         style={{alignItems:"center",justifyContent:"center"}}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Personalize your experience</h2>
          <p className="text-gray-400 text-sm">Help the AI understand who you are so it can give better responses.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Detailed */}
          <button
            onClick={onDetailed}
            className="flex flex-col items-start gap-3 p-5 bg-gray-800 border border-gray-600 rounded-xl hover:border-blue-500 hover:bg-gray-750 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">📋</div>
            <div>
              <div className="font-semibold text-white text-sm">Detailed Profile</div>
              <div className="text-gray-400 text-xs mt-1 leading-relaxed">Full setup for the best personalized AI experience. Takes about 2 minutes.</div>
            </div>
            <div className="text-blue-400 text-xs font-medium mt-auto group-hover:text-blue-300">Recommended →</div>
          </button>

          {/* Quick */}
          <button
            onClick={onQuick}
            className="flex flex-col items-start gap-3 p-5 bg-gray-800 border border-gray-600 rounded-xl hover:border-gray-400 hover:bg-gray-750 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-lg">⚡</div>
            <div>
              <div className="font-semibold text-white text-sm">Quick Setup</div>
              <div className="text-gray-400 text-xs mt-1 leading-relaxed">Just the basics. 30 seconds and you're good to go.</div>
            </div>
            <div className="text-gray-400 text-xs font-medium mt-auto group-hover:text-gray-300">3 questions →</div>
          </button>

          {/* Skip */}
          <button
            onClick={onSkip}
            className="flex flex-col items-start gap-3 p-5 bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-500 transition-all text-left group"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-lg">→</div>
            <div>
              <div className="font-semibold text-white text-sm">Skip for now</div>
              <div className="text-gray-400 text-xs mt-1 leading-relaxed">Jump straight in. You can set up a profile later from the sidebar.</div>
            </div>
            <div className="text-gray-500 text-xs font-medium mt-auto group-hover:text-gray-400">No setup →</div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CHIP SELECT ──────────────────────────────────────────────────────────────
function Chips({ options, value, onChange, multi }) {
  const selected = multi ? value : [value]
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => multi
              ? onChange(active ? value.filter(x => x !== opt) : [...value, opt])
              : onChange(opt)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              active
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide block mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

// ─── DETAILED FORM ────────────────────────────────────────────────────────────
function DetailedForm({ onSave, onBack }) {
  const [form, setForm] = useState({
    name: "", ageRange: "", occupation: "", industry: "",
    expertise: "", uses: [], responseStyle: "", tone: ""
  })
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const canSave = form.name.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-white font-bold text-base">Detailed Profile</h2>
            <p className="text-gray-400 text-xs mt-0.5">Fill in what feels relevant — nothing is required except your name.</p>
          </div>
          <button onClick={onBack} className="text-gray-500 hover:text-gray-300 text-xs border border-gray-700 px-3 py-1 rounded-lg transition-colors">Back</button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-5">

          <Field label="What should we call you?">
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Your name or nickname"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>

          <Field label="Age Range">
            <Chips
              options={["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"]}
              value={form.ageRange}
              onChange={v => set("ageRange", v)}
            />
          </Field>

          <Field label="What do you do?">
            <input
              value={form.occupation}
              onChange={e => set("occupation", e.target.value)}
              placeholder="e.g. Software Engineer, Student, Designer, Writer..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>

          <Field label="Industry">
            <Chips
              options={["Technology", "Finance", "Healthcare", "Education", "Marketing", "Design", "Science", "Law", "Business", "Media", "Other"]}
              value={form.industry}
              onChange={v => set("industry", v)}
            />
          </Field>

          <Field label="Your expertise level with AI">
            <Chips
              options={["Beginner", "Intermediate", "Expert"]}
              value={form.expertise}
              onChange={v => set("expertise", v)}
            />
          </Field>

          <Field label="What do you mainly use AI for?" hint="Select all that apply">
            <Chips
              options={["Coding", "Writing", "Research", "Data Analysis", "Creative Work", "Learning", "Business", "Brainstorming", "Other"]}
              value={form.uses}
              onChange={v => set("uses", v)}
              multi
            />
          </Field>

          <Field label="Preferred response length">
            <Chips
              options={["Concise", "Balanced", "Detailed"]}
              value={form.responseStyle}
              onChange={v => set("responseStyle", v)}
            />
          </Field>

          <Field label="Preferred tone">
            <Chips
              options={["Casual", "Professional", "Technical", "Friendly"]}
              value={form.tone}
              onChange={v => set("tone", v)}
            />
          </Field>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={() => onSave(form)}
            disabled={!canSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── QUICK FORM ───────────────────────────────────────────────────────────────
function QuickForm({ onSave, onBack }) {
  const [name, setName] = useState("")
  const [mainUse, setMainUse] = useState("")
  const [expertise, setExpertise] = useState("")

  const canSave = name.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-white font-bold text-base">Quick Setup</h2>
            <p className="text-gray-400 text-xs mt-0.5">Just the essentials.</p>
          </div>
          <button onClick={onBack} className="text-gray-500 hover:text-gray-300 text-xs border border-gray-700 px-3 py-1 rounded-lg transition-colors">Back</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          <Field label="What should we call you?">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name or nickname"
              autoFocus
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </Field>

          <Field label="What do you mainly use AI for?">
            <Chips
              options={["Coding", "Writing", "Research", "Learning", "Creative Work", "Business", "Other"]}
              value={mainUse}
              onChange={setMainUse}
            />
          </Field>

          <Field label="Your AI expertise level">
            <Chips
              options={["Beginner", "Intermediate", "Expert"]}
              value={expertise}
              onChange={setExpertise}
            />
          </Field>

        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={() => onSave({ name, uses: mainUse ? [mainUse] : [], expertise })}
            disabled={!canSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
function ProfileSetupModal({ onClose }) {
  const [step, setStep] = useState("choose")

  const handleSave = (data) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data))
    markDone()
    onClose()
  }

  const handleSkip = () => {
    markDone()
    onClose()
  }

  if (step === "choose") return <ChooseScreen onDetailed={() => setStep("detailed")} onQuick={() => setStep("quick")} onSkip={handleSkip} />
  if (step === "detailed") return <DetailedForm onSave={handleSave} onBack={() => setStep("choose")} />
  if (step === "quick")    return <QuickForm    onSave={handleSave} onBack={() => setStep("choose")} />
}

export default ProfileSetupModal
