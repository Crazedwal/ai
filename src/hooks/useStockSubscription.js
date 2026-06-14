import { useState, useEffect } from "react"

const KEY = "syntharix_stock_subscribed"

export function useStockSubscription() {
  const [subscribed, setSubscribed] = useState(() => !!localStorage.getItem(KEY))

  useEffect(() => {
    const handler = () => setSubscribed(!!localStorage.getItem(KEY))
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  function subscribe() {
    localStorage.setItem(KEY, "true")
    setSubscribed(true)
  }

  function unsubscribe() {
    localStorage.removeItem(KEY)
    setSubscribed(false)
  }

  return { subscribed, subscribe, unsubscribe }
}
