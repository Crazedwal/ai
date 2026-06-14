const PROXY = "https://api.allorigins.win/get?url="

export async function fetchStockData(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`
  try {
    const res = await fetch(PROXY + encodeURIComponent(url))
    const outer = await res.json()
    const data = JSON.parse(outer.contents)
    const meta = data?.chart?.result?.[0]?.meta
    if (!meta) return null
    return {
      ticker: ticker.toUpperCase(),
      price: meta.regularMarketPrice?.toFixed(2),
      open: meta.regularMarketOpen?.toFixed(2),
      high: meta.regularMarketDayHigh?.toFixed(2),
      low: meta.regularMarketDayLow?.toFixed(2),
      prevClose: meta.chartPreviousClose?.toFixed(2),
      change: (meta.regularMarketPrice - meta.chartPreviousClose)?.toFixed(2),
      changePct: (((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100)?.toFixed(2),
      currency: meta.currency,
      exchange: meta.exchangeName,
    }
  } catch {
    return null
  }
}

// Pull all tickers mentioned in a message e.g. AAPL, $TSLA, "tesla stock"
const KNOWN = {
  apple: "AAPL", tesla: "TSLA", google: "GOOGL", amazon: "AMZN",
  microsoft: "MSFT", nvidia: "NVDA", meta: "META", netflix: "NFLX",
  disney: "DIS", nike: "NKE", amazon: "AMZN", coinbase: "COIN",
  bitcoin: "BTC-USD", ethereum: "ETH-USD", sp500: "^GSPC"
}

export function extractTickers(text) {
  const found = new Set()
  const upper = text.toUpperCase()
  const lower = text.toLowerCase()

  // Match $AAPL or plain uppercase tickers 2-5 letters
  const explicit = upper.match(/\$?([A-Z]{2,5}(?:-USD)?)/g) || []
  explicit.forEach(t => found.add(t.replace("$", "")))

  // Match company names
  Object.entries(KNOWN).forEach(([name, ticker]) => {
    if (lower.includes(name)) found.add(ticker)
  })

  return [...found].slice(0, 3) // limit to 3 tickers per message
}
