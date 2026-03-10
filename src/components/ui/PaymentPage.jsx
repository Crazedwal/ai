// src/components/ui/PaymentPage.jsx
import { useState } from "react"
import { TOKEN_PACKAGES } from "@/lib/models"

/* ── helpers ──────────────────────────────────────────────── */
function fmtCard(v) { return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim() }
function fmtExpiry(v) { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+" / "+d.slice(2):d }
function cardBrand(v) {
  const n=v.replace(/\s/g,"")
  if(/^4/.test(n)) return "visa"
  if(/^5[1-5]/.test(n)) return "mastercard"
  if(/^3[47]/.test(n)) return "amex"
  if(/^6(?:011|5)/.test(n)) return "discover"
  return null
}
const BrandLogo = ({ brand }) => {
  if(brand==="visa") return <span className="font-extrabold italic text-blue-700 text-xs tracking-tighter">VISA</span>
  if(brand==="mastercard") return <span className="flex"><span className="w-4 h-4 rounded-full bg-red-500 opacity-90"/><span className="w-4 h-4 rounded-full bg-yellow-400 -ml-2 opacity-90"/></span>
  if(brand==="amex") return <span className="font-bold text-blue-500 text-xs">AMEX</span>
  if(brand==="discover") return <span className="font-bold text-orange-500 text-xs">DISC</span>
  return <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2" strokeWidth={1.5}/><path d="M2 10h20" strokeWidth={1.5}/></svg>
}

const SPINNER = (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
)

const TABS = [
  { id:"card",    label:"Card",       icon:"💳" },
  { id:"paypal",  label:"PayPal",     icon:"🅿️" },
  { id:"apple",   label:"Apple Pay",  icon:"" },
  { id:"google",  label:"Google Pay", icon:"G"  },
  { id:"bank",    label:"Bank",       icon:"🏦" },
]

const COUNTRIES = ["United States","United Kingdom","Canada","Australia","Germany","France","Japan","Brazil","India","Other"]

/* ── reusable input builder ───────────────────────────────── */
function useField() {
  const [focus, setFocus] = useState(null)
  const cls = (id) => `w-full px-3 py-2.5 rounded-md border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all ${focus===id?"border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900":"border-gray-300 dark:border-gray-700"}`
  const Inp = ({ id, label, placeholder, value, onChange, type="text", maxLength }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        maxLength={maxLength} onFocus={()=>setFocus(id)} onBlur={()=>setFocus(null)}
        className={cls(id)} autoComplete="off"/>
    </div>
  )
  return { Inp, focus, setFocus, cls }
}

/* ── PayBtn ───────────────────────────────────────────────── */
function PayBtn({ loading, label="Pay now", color="bg-indigo-600 hover:bg-indigo-700" }) {
  return (
    <button type="submit" disabled={loading}
      className={`w-full py-3 ${color} disabled:opacity-60 text-white rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2`}>
      {loading ? <>{SPINNER} Processing…</> : label}
    </button>
  )
}

/* ── Card form ────────────────────────────────────────────── */
function CardForm({ onSubmit, loading }) {
  const [f,setF] = useState({email:"",number:"",expiry:"",cvv:"",name:"",country:"United States",zip:""})
  const {Inp,focus,setFocus,cls} = useField()
  const set = k => e => { let v=e.target.value; if(k==="number") v=fmtCard(v); if(k==="expiry") v=fmtExpiry(v); if(k==="cvv") v=v.replace(/\D/g,"").slice(0,4); setF(p=>({...p,[k]:v})) }
  const brand = cardBrand(f.number)

  return (
    <form onSubmit={e=>{e.preventDefault();onSubmit()}} className="space-y-4">
      <Inp id="email" label="Email" placeholder="jane@example.com" type="email" value={f.email} onChange={set("email")}/>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Card information</label>
        <div className={`flex items-center px-3 py-2.5 rounded-t-md border-x border-t text-sm bg-white dark:bg-gray-900 transition-all ${focus==="number"?"border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900":"border-gray-300 dark:border-gray-700"}`}>
          <input value={f.number} onChange={set("number")} placeholder="1234 1234 1234 1234"
            onFocus={()=>setFocus("number")} onBlur={()=>setFocus(null)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"/>
          <BrandLogo brand={brand}/>
        </div>
        <div className="flex">
          <div className={`flex-1 flex items-center px-3 py-2.5 border-x border-b border-r-0 rounded-bl-md text-sm bg-white dark:bg-gray-900 transition-all ${focus==="expiry"?"border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900":"border-gray-300 dark:border-gray-700"}`}>
            <input value={f.expiry} onChange={set("expiry")} placeholder="MM / YY"
              onFocus={()=>setFocus("expiry")} onBlur={()=>setFocus(null)}
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"/>
          </div>
          <div className={`flex-1 flex items-center px-3 py-2.5 border rounded-br-md -ml-px text-sm bg-white dark:bg-gray-900 transition-all ${focus==="cvv"?"border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900":"border-gray-300 dark:border-gray-700"}`}>
            <input value={f.cvv} onChange={set("cvv")} placeholder="CVV"
              onFocus={()=>setFocus("cvv")} onBlur={()=>setFocus(null)}
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"/>
            <svg className="w-4 h-4 text-gray-400 ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2" strokeWidth={1.5}/><path d="M2 10h20" strokeWidth={1.5}/></svg>
          </div>
        </div>
      </div>
      <Inp id="name" label="Name on card" placeholder="Jane Doe" value={f.name} onChange={set("name")}/>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Billing address</label>
        <select value={f.country} onChange={e=>setF(p=>({...p,country:e.target.value}))}
          className="w-full px-3 py-2.5 rounded-t-md border border-b-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none">
          {COUNTRIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <input value={f.zip} onChange={set("zip")} placeholder="ZIP / Postal code"
          onFocus={()=>setFocus("zip")} onBlur={()=>setFocus(null)}
          className={`w-full px-3 py-2.5 rounded-b-md border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all ${focus==="zip"?"border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900":"border-gray-300 dark:border-gray-700"}`}/>
      </div>
      <PayBtn loading={loading}/>
    </form>
  )
}

/* ── PayPal form ──────────────────────────────────────────── */
function PayPalForm({ onSubmit, loading }) {
  const [f,setF] = useState({email:"",password:""})
  const {Inp} = useField()
  const set = k => e => setF(p=>({...p,[k]:e.target.value}))
  return (
    <form onSubmit={e=>{e.preventDefault();onSubmit()}} className="space-y-4">
      <div className="flex items-center justify-center py-3">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-extrabold text-[#003087]">Pay</span>
          <span className="text-2xl font-extrabold text-[#009cde]">Pal</span>
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 text-center">
        You'll be redirected to PayPal to complete your purchase.
      </div>
      <Inp id="email" label="PayPal email or mobile" placeholder="jane@example.com" type="email" value={f.email} onChange={set("email")}/>
      <Inp id="password" label="Password" placeholder="••••••••" type="password" value={f.password} onChange={set("password")}/>
      <PayBtn loading={loading} label="Continue with PayPal" color="bg-[#0070ba] hover:bg-[#005ea6]"/>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500">
        Don't have an account? <span className="text-[#0070ba] underline cursor-pointer">Sign Up</span>
      </p>
    </form>
  )
}

/* ── Apple Pay form ───────────────────────────────────────── */
function ApplePayForm({ pkg, onSubmit, loading }) {
  return (
    <form onSubmit={e=>{e.preventDefault();onSubmit()}} className="space-y-5">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.23.73 3 .79.98-.2 1.91-.79 3-.87 2.02.17 3.55 1.01 4.36 2.55-3.98 2.49-3.25 7.63.64 9.39zm-3.9-13.3c-.15 2.16-2.06 3.8-4.04 3.62-.2-2.04 1.81-3.87 4.04-3.62z"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">Apple Pay</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Use Touch ID or Face ID to pay</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Amount</span>
          <span className="font-semibold text-gray-900 dark:text-white">${pkg.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Merchant</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">AI Chat Pro</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-700">
          <span>Card ending in</span>
          <span>•••• 4242</span>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-black hover:bg-gray-900 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
        {loading ? <>{SPINNER} Authenticating…</> : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.32.07 2.23.73 3 .79.98-.2 1.91-.79 3-.87 2.02.17 3.55 1.01 4.36 2.55-3.98 2.49-3.25 7.63.64 9.39zm-3.9-13.3c-.15 2.16-2.06 3.8-4.04 3.62-.2-2.04 1.81-3.87 4.04-3.62z"/>
            </svg>
            Pay with Touch ID
          </>
        )}
      </button>
    </form>
  )
}

/* ── Google Pay form ──────────────────────────────────────── */
function GooglePayForm({ pkg, onSubmit, loading }) {
  const [selected, setSelected] = useState(0)
  const cards = [
    { label:"Visa", last:"4242", color:"bg-blue-600" },
    { label:"Mastercard", last:"5555", color:"bg-red-500" },
  ]
  return (
    <form onSubmit={e=>{e.preventDefault();onSubmit()}} className="space-y-4">
      <div className="flex items-center justify-center py-2 gap-1">
        <span className="text-2xl font-bold text-[#4285F4]">G</span>
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">oogle Pay</span>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Pay with saved card</p>
        <div className="space-y-2">
          {cards.map((c,i)=>(
            <button type="button" key={i} onClick={()=>setSelected(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selected===i?"border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20":"border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"}`}>
              <div className={`w-8 h-5 rounded ${c.color} flex items-center justify-center`}>
                <span className="text-white text-[9px] font-bold">{c.label.slice(0,2).toUpperCase()}</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{c.label} ···· {c.last}</span>
              {selected===i && <svg className="w-4 h-4 text-indigo-500 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8 15.414l-4.707-4.707a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Total</span>
        <span className="font-semibold text-gray-900 dark:text-white">${pkg.price.toFixed(2)} USD</span>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 text-white disabled:opacity-60"
        style={{background:"linear-gradient(90deg,#4285F4,#34A853,#FBBC05,#EA4335)"}}>
        {loading ? <>{SPINNER} Processing…</> : "Pay with Google Pay"}
      </button>
    </form>
  )
}

/* ── Bank form ────────────────────────────────────────────── */
function BankForm({ onSubmit, loading }) {
  const [f,setF] = useState({email:"",name:"",routing:"",account:""})
  const {Inp} = useField()
  const set = k => e => setF(p=>({...p,[k]:e.target.value}))
  return (
    <form onSubmit={e=>{e.preventDefault();onSubmit()}} className="space-y-4">
      <Inp id="email" label="Email" placeholder="jane@example.com" type="email" value={f.email} onChange={set("email")}/>
      <Inp id="name" label="Account holder name" placeholder="Jane Doe" value={f.name} onChange={set("name")}/>
      <Inp id="routing" label="Routing number" placeholder="110000000" value={f.routing} onChange={set("routing")}/>
      <Inp id="account" label="Account number" placeholder="000123456789" value={f.account} onChange={set("account")}/>
      <PayBtn loading={loading}/>
    </form>
  )
}

/* ── Declined ─────────────────────────────────────────────── */
function Declined({ onRetry, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-8 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment declined</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        Your payment could not be processed. The issuer has declined this transaction.
      </p>
      <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-left space-y-1">
        <p className="text-xs font-semibold text-red-700 dark:text-red-400">Decline code</p>
        <p className="text-xs font-mono text-red-600 dark:text-red-300">do_not_honor</p>
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">This merchant is not set up to accept payments at this time.</p>
      </div>
      <div className="flex gap-3 w-full pt-2">
        <button onClick={onRetry}
          className="flex-1 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Try again
        </button>
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
          Close
        </button>
      </div>
    </div>
  )
}

/* ── Summary (left panel) ─────────────────────────────────── */
function Summary({ pkg }) {
  return (
    <div className="bg-[#f6f9fc] dark:bg-gray-800 p-8 flex flex-col min-h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <span className="font-semibold text-gray-800 dark:text-white text-sm">AI Chat Pro</span>
      </div>
      <div className="mb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total due today</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">${pkg.price.toFixed(2)}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">USD</p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-3 flex-1">
        <div className="flex justify-between text-sm">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">{pkg.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{pkg.tokens.toLocaleString()} tokens · one-time</p>
          </div>
          <span className="text-gray-800 dark:text-gray-200 font-medium">${pkg.price.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between"><span>Subtotal</span><span>${pkg.price.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>$0.00</span></div>
          <div className="flex justify-between font-semibold text-sm text-gray-800 dark:text-gray-200 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span><span>${pkg.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        Secured · 256-bit TLS encryption
      </div>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
export default function PaymentPage({ onClose }) {
  const [pkg, setPkg]         = useState(null)
  const [tab, setTab]         = useState("card")
  const [loading, setLoading] = useState(false)
  const [declined, setDeclined] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDeclined(true) }, 2400)
  }

  // Package picker
  if (!pkg) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-white">Choose a plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          {TOKEN_PACKAGES.map(p=>(
            <button key={p.id} onClick={()=>setPkg(p)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-left">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{p.label}</p>
                <p className="text-xs text-indigo-500 mt-0.5">{p.tokens.toLocaleString()} tokens</p>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">${p.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Checkout
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex" style={{minHeight:560}}>

        {/* Left */}
        <div className="w-72 shrink-0 hidden md:block">
          <Summary pkg={pkg}/>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <p className="text-sm text-gray-400 dark:text-gray-500">Secure checkout</p>
            <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">×</button>
          </div>

          {declined ? (
            <Declined onRetry={()=>setDeclined(false)} onClose={onClose}/>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {/* Arrow nav */}
              {(() => {
                const idx = TABS.findIndex(t => t.id === tab)
                const prev = TABS[idx - 1]
                const next = TABS[idx + 1]
                return (
                  <div className="flex items-center justify-between mb-5">
                    <button
                      type="button"
                      onClick={() => prev && setTab(prev.id)}
                      disabled={!prev}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                      </svg>
                      {prev && <span>{prev.icon} {prev.label}</span>}
                    </button>

                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-200 dark:border-indigo-700">
                      <span className="text-base leading-none">{TABS[idx].icon}</span>
                      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{TABS[idx].label}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => next && setTab(next.id)}
                      disabled={!next}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                      {next && <span>{next.icon} {next.label}</span>}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                )
              })()}

              {/* Dot indicators */}
              <div className="flex justify-center gap-1.5 mb-5">
                {TABS.map(t => (
                  <button key={t.id} type="button" onClick={() => setTab(t.id)}
                    className={`rounded-full transition-all ${tab===t.id ? "w-4 h-2 bg-indigo-600" : "w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-300"}`}/>
                ))}
              </div>

              {tab==="card"   && <CardForm      onSubmit={handleSubmit} loading={loading}/>}
              {tab==="paypal" && <PayPalForm    onSubmit={handleSubmit} loading={loading}/>}
              {tab==="apple"  && <ApplePayForm  pkg={pkg} onSubmit={handleSubmit} loading={loading}/>}
              {tab==="google" && <GooglePayForm pkg={pkg} onSubmit={handleSubmit} loading={loading}/>}
              {tab==="bank"   && <BankForm      onSubmit={handleSubmit} loading={loading}/>}

              <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-5 flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Demo only — no real charge is made
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
