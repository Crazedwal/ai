// src/components/ui/TokenPurchaseModal.jsx
import { useState } from "react"
import { TOKEN_PACKAGES } from "@/lib/models"

const PAYMENT_METHODS = [
  { id: "card",    label: "Credit / Debit Card",  icon: "💳" },
  { id: "paypal",  label: "PayPal",               icon: "🅿️" },
  { id: "apple",   label: "Apple Pay",            icon: "🍎" },
  { id: "google",  label: "Google Pay",           icon: "G"  },
  { id: "crypto",  label: "Crypto (BTC / ETH)",   icon: "₿"  },
  { id: "bank",    label: "Bank Transfer",        icon: "🏦" },
  { id: "klarna",  label: "Klarna",               icon: "🛍️" },
  { id: "afterpay",label: "Afterpay",             icon: "⚡" },
]

// Step 1 – pick a package
function PackageStep({ onSelect }) {
  return (
    <div className="p-6 space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Choose a token package to continue.</p>
      {TOKEN_PACKAGES.map((pkg) => (
        <button
          key={pkg.id}
          onClick={() => onSelect(pkg)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
        >
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{pkg.label}</div>
            <div className="text-sm text-blue-500 font-medium">{pkg.tokens.toLocaleString()} tokens</div>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">${pkg.price.toFixed(2)}</span>
        </button>
      ))}
    </div>
  )
}

// Step 2 – pick a payment method
function MethodStep({ pkg, onSelect, onBack }) {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Paying <span className="font-semibold text-gray-800 dark:text-gray-200">${pkg.price.toFixed(2)}</span> — choose how to pay:
      </p>
      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <span className="text-2xl">{m.icon}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{m.label}</span>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">
        ← Back
      </button>
    </div>
  )
}

// Step 3 – fill in payment details
function DetailsStep({ pkg, method, onSubmit, onBack, loading }) {
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvv: "", email: "", address: "" })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const field = (label, key, placeholder, extra = {}) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        {...extra}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  )

  const renderForm = () => {
    switch (method.id) {
      case "card":
        return (
          <>
            {field("Cardholder Name", "name", "Jane Doe")}
            {field("Card Number", "number", "1234 5678 9012 3456", { maxLength: 19 })}
            <div className="grid grid-cols-2 gap-3">
              {field("Expiry", "expiry", "MM / YY")}
              {field("CVV", "cvv", "123", { maxLength: 4 })}
            </div>
          </>
        )
      case "paypal":
        return field("PayPal Email", "email", "you@example.com", { type: "email" })
      case "apple":
      case "google":
        return (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {method.icon} {method.label} will open in a new window to authenticate.
          </p>
        )
      case "crypto":
        return (
          <>
            {field("Your Wallet Address", "address", "0x... or bc1...")}
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Send exactly <strong>${pkg.price.toFixed(2)}</strong> worth of BTC or ETH to the address above.
            </p>
          </>
        )
      case "bank":
        return (
          <>
            {field("Account Holder Name", "name", "Jane Doe")}
            {field("IBAN / Account Number", "number", "GB00 0000 0000 0000 00")}
          </>
        )
      case "klarna":
      case "afterpay":
        return (
          <>
            {field("Email", "email", "you@example.com", { type: "email" })}
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Pay in 4 interest-free instalments of <strong>${(pkg.price / 4).toFixed(2)}</strong>.
            </p>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="text-xl">{method.icon}</span>
        <span>{method.label}</span>
        <span className="ml-auto text-blue-500 font-semibold">${pkg.price.toFixed(2)}</span>
      </div>

      <div className="space-y-3">{renderForm()}</div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        {loading ? "Processing…" : `Pay $${pkg.price.toFixed(2)}`}
      </button>

      <button onClick={onBack} className="w-full text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">
        ← Change payment method
      </button>
    </div>
  )
}

// Step 4 – declined
function DeclinedStep({ method, onRetry, onClose }) {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="text-5xl">❌</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Declined</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Your {method.label} payment could not be processed.<br />
        Please check your details and try again.
      </p>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-left">
        <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Reason</p>
        <p className="text-xs text-red-600 dark:text-red-300">
          TRANSACTION_DECLINED — This merchant is not currently accepting payments. (Code: ERR_4291)
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRetry}
          className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// Main modal
function TokenPurchaseModal({ onClose }) {
  const [step, setStep]     = useState("package")   // package | method | details | declined
  const [pkg, setPkg]       = useState(null)
  const [method, setMethod] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("declined")
    }, 2200)
  }

  const stepTitle = {
    package:  "Buy Tokens",
    method:   "Payment Method",
    details:  "Enter Details",
    declined: "Payment Failed",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{stepTitle[step]}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Steps */}
        {step === "package"  && <PackageStep onSelect={(p) => { setPkg(p); setStep("method") }} />}
        {step === "method"   && <MethodStep pkg={pkg} onSelect={(m) => { setMethod(m); setStep("details") }} onBack={() => setStep("package")} />}
        {step === "details"  && <DetailsStep pkg={pkg} method={method} onSubmit={handleSubmit} onBack={() => setStep("method")} loading={loading} />}
        {step === "declined" && <DeclinedStep method={method} onRetry={() => setStep("details")} onClose={onClose} />}

        {/* Footer */}
        {step !== "declined" && (
          <div className="px-6 pb-5 pt-1">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              🔒 Demo only — no real payment is processed.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenPurchaseModal
