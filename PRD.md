# Product Requirements Document
**Project:** AI Chat Application
**Author:** Askyturi
**Last Updated:** 2026-05-10
**Status:** Active Development

---

## 1. Overview

A browser-based platform combining an AI chat assistant with a gamified token economy and a full stock market data viewer. The AI side lets users have personalized, multi-turn conversations with a customizable assistant, earn tokens through quests and a Plinko mini-game, and manage their experience through a rich sidebar. The stock market side is a standalone, data-accurate market viewer with real API data, no simulations, and no gamification — just a clean, dense, professional interface for tracking the market.

The entire platform runs client-side. Firebase handles authentication. OpenRouter handles LLM access. Polygon.io handles market data. No custom backend.

---

## 2. Goals

- Deliver a personalized AI chat experience shaped by user-defined personality, constraints, and behavior preferences
- Keep users engaged through a token economy, rotating quests, and a Plinko mini-game
- Build a stock market viewer that shows real, accurate, complete market data — every stock, real prices, real charts
- Keep the architecture simple and extensible: client-side first, easy to add features without restructuring
- Support monetization later through a real payment layer without rebuilding the token system

---

## 3. Users

| Type | Description |
|---|---|
| Guest | No account required. Chat sessions are not saved. Some features are restricted. |
| Authenticated | Signed in via Google OAuth or email/password. Full access to all features. Data persists across sessions. |

---

## 4. Authentication

The app should support three entry paths:

**Google OAuth** — one-click sign-in using Firebase Google provider. Fastest path to full access.

**Email / Password** — standard signup and login form. Includes basic validation (valid email format, password length). No email verification required for initial release.

**Guest Mode** — user can use the chat without signing in. Conversations are not saved. Token balance resets on refresh. The UI should surface a prompt to sign in, but never block the guest from using the core chat.

Sign-out should be accessible from the sidebar at all times.

---

## 5. AI Chat

### 5.1 Core Chat Behavior
The chat should support multi-turn conversations with full message history sent to the model on every request. Messages should render markdown — including code blocks with syntax highlighting, tables, bold/italic, and lists.

Each conversation has an auto-generated title derived from the first user message. Conversations are listed in the sidebar sorted by most recent. Users can create new chats and switch between existing ones.

### 5.2 Streaming
Responses should stream token-by-token so the user sees the reply as it's generated rather than waiting for the full response. The message bubble should update in real time as tokens arrive. A subtle indicator should show when the model is generating.

### 5.3 System Message & Personalization Injection
Every API request should include a system message built from the user's saved profile data:
- Who the user is (name, occupation, expertise level)
- What they want the assistant to keep doing, change, or stop doing (KCD system)
- Their constraints: things that frustrate them, things they're comfortable with
- Their preferred response style and tone

If the user hasn't set up a profile, use a neutral default system message.

### 5.4 Model Selection
The sidebar should include a model selector. Models are split into free and paid sections. Free models cost 0 tokens per message. Paid models deduct tokens from the user's balance before sending. The selected model persists across sessions.

The goal is to support many models. Start with at least one working free model and expand the list over time without changing the underlying architecture.

### 5.5 Input Behavior
- Enter sends the message
- Shift+Enter inserts a newline
- The input should grow vertically with the text up to a max height, then scroll
- Disable send while a response is streaming

---

## 6. Personalization

### 6.1 Assistant Name
The user can rename the assistant from the sidebar. The name appears in the chat header and in message bubbles. Defaults to "Assistant". Persists in localStorage.

### 6.2 User Profile Setup
On first visit (authenticated), show a setup modal with two paths:
- **Quick setup:** just name and preferred response style (2 fields)
- **Detailed setup:** name, age, occupation, industry, expertise level, main use cases, preferred response style, preferred tone

The profile is optional. Users can skip it and set it up later from the sidebar. All fields feed directly into the system message.

### 6.3 User Constraints Modal
A dedicated modal where users define:
- Who they are (free text, injected as context)
- What frustrates them in AI responses
- What they're comfortable with

These are sent with every message to shape how the model responds.

### 6.4 KCD System
Keep / Change / Delete — a list of specific behaviors the user wants to reinforce or suppress. Examples:
- Keep: "Always give code examples"
- Change: "Be more concise"
- Delete: "Stop adding disclaimers"

The KCD list is injected into the system message alongside constraints.

### 6.5 Language
Support 6 languages for the UI: English, Spanish, French, German, Chinese, Japanese. The language setting changes UI labels and sidebar text. It does not change the model's response language unless the user also specifies that in their constraints. Persists in localStorage.

### 6.6 Theme
Dark and light mode toggle in the chat header. Persists in localStorage. Default to dark.

---

## 7. Token Economy

### 7.1 Balance
Every authenticated user starts with 50 tokens. The current balance is always visible in the sidebar. The all-time peak balance is tracked separately and used for certain quest conditions.

### 7.2 Spending
- Free models: 0 tokens per message
- Paid models: deduct the model's defined cost before sending. If the user's balance is insufficient, show an error and do not send.

### 7.3 Earning
Tokens are earned by completing quests and through Plinko winnings. No other earning mechanisms for now.

### 7.4 Purchasing
A payment modal should be accessible from the sidebar. It should support multiple payment methods in the UI (card, PayPal, Apple Pay, Google Pay, bank transfer). Real payment processing via Stripe is planned for a later phase — for now the UI exists but transactions are not processed.

---

## 8. Plinko

A canvas-based physics game accessible from the sidebar.

### 8.1 Board
- 15-row pyramid of pegs
- 16 outcome slots at the bottom
- Multipliers (left to right): 500x, 20x, 5x, 3x, 0x, 0x, 1x, 1x, 1x, 1x, 0x, 0x, 3x, 5x, 20x, 500x

### 8.2 Betting
User selects how many balls to drop: 5, 10, 25, or 50. Each ball costs 1 token. The total cost is shown before confirming. Tokens are deducted upfront.

### 8.3 Physics
Balls should have realistic gravity and peg bounce behavior. Horizontal velocity should decay on each bounce. Balls should not pass through pegs or walls.

### 8.4 Payout
After all balls have settled, calculate total payout (sum of each ball's slot multiplier × 1 token). Add the payout to the user's token balance. Show a results summary.

### 8.5 Quest Integration
Track: total gambles played, gambles won (payout > cost), gambles lost, total balls dropped. These stats feed the quest system.

---

## 9. Quests

### 9.1 Rotation
4 quests are active at any given time. They rotate every 30 minutes on a fixed schedule. The selection is seeded by the current 30-minute window so everyone sees the same 4 quests at the same time.

### 9.2 Quest Pool
Quests are drawn from a pool of 20+ templates across categories:
- **Chat:** send N messages, send N messages in a single conversation, create N new chats
- **Plinko:** play N rounds, win N rounds, lose N rounds, drop N balls
- **Token:** reach a peak balance of N

### 9.3 Progress & Completion
Each quest shows a progress bar based on the tracked stat vs. the goal. When a quest is completed, tokens are awarded automatically. Completed quests are marked and not re-awarded if the window resets before the user refreshes.

### 9.4 UI
The quests modal shows: all 4 active quests with their progress bars, token reward per quest, and a countdown timer to the next rotation.

---

## 10. AFK Detection

After 5 minutes of no user activity (no mouse movement, keyboard input, or clicks), show a modal warning. The user has 30 seconds to confirm they're still there. If they don't, block the chat input until they interact. Reset the timer on any activity.

---

## 11. Stock Market Simulator

### 11.1 Purpose
A standalone market data viewer integrated into the app. No fake money, no tokens, no gamification. Real data only. The design is strict black, white, and grey — functional and data-dense.

### 11.2 API
Use **Polygon.io** as the sole data source. API key stored in `.env` as `VITE_POLYGON_API_KEY`. Use it for:
- Full ticker list: every stock on NYSE, NASDAQ, and AMEX — no sampling, no filtering by popularity
- Real-time delayed quotes
- OHLCV historical data for charts
- Company details: name, description, sector, industry, market cap, employee count, website, headquarters
- News headlines per ticker and market-wide

Do not generate, mock, or simulate any price data.

### 11.3 Design
- Background: `#0a0a0a`
- Surface / cards: `#1a1a1a`
- Borders: `#2a2a2a`
- Primary text: `#f0f0f0`
- Secondary text: `#888`
- Positive change: `#00c853`
- Negative change: `#ff1744`
- Monospace font for all numbers
- No gradients, no accent colors, no decorative elements
- Dense tabular layout — maximize data per screen

### 11.4 Navigation
Sticky top nav with four links: Market Overview, Screener, Watchlist, Alerts. Active route is underlined. No animations.

### 11.5 Market Overview Page
The home page of the stock market section.

**Index bar** — always visible at the top: S&P 500, NASDAQ Composite, DOW Jones, Russell 2000. Each shows current value, point change, and % change.

**Top Gainers table** — columns: rank, ticker, company name, price, % change, volume. Sorted by % change descending.

**Top Losers table** — same columns. Sorted by % change ascending.

**Most Active table** — same columns. Sorted by volume descending.

**Sector performance** — all 11 GICS sectors listed with their average % change for the day, sorted by performance. Shows at a glance which sectors are leading and which are lagging.

**Market news feed** — latest market-wide headlines. Each entry shows: headline text, source name, published time, and a link to the full article.

### 11.6 Stock Screener Page
Shows every stock. Default sort: market cap descending.

**Columns:** ticker, company name, price, change ($), % change, volume, market cap, sector, exchange.

**Filters:**
- Price range (min / max)
- % change range (e.g. only show stocks up more than 5%)
- Minimum volume
- Market cap range with preset buckets (Mega, Large, Mid, Small, Micro)
- Sector dropdown (all 11 GICS sectors)
- Exchange dropdown (NYSE, NASDAQ, AMEX)

**Search bar** — filters by ticker symbol or company name in real time as the user types.

Pagination is acceptable for performance but all data must be available — no hard cap on results. Clicking any row navigates to the stock detail page.

### 11.7 Stock Detail Page
Route: `/stock/:ticker`

**Header:** ticker symbol, full company name, current price, change in dollars, % change, market status badge (Open / Closed / Pre-market / After-hours).

**Key stats row:** market cap, P/E ratio, EPS, 52-week high, 52-week low, average daily volume, dividend yield (show "—" if none), beta.

**Price chart:** line chart by default. Toggle to candlestick. Time range buttons: 1D, 5D, 1M, 3M, 6M, 1Y, 5Y. Chart updates when time range changes.

**About section:** company description (full text), sector, industry, website, employee count, headquarters city/state.

**Ticker news feed:** latest headlines specific to this stock. Each entry: headline, source, published time, link.

**Watchlist button:** add or remove this stock from the watchlist. Shows current state (added / not added).

### 11.8 Watchlist Page
Lists all stocks the user has saved.

Columns: ticker, company name, price, % change, volume, market cap. Remove button on each row. Persists in localStorage. If empty, show a prompt with a link to the screener.

### 11.9 Price Alerts Page
User sets alerts on individual stocks.

**Creating an alert:** pick a ticker (typeahead search), set a target price, choose "above" or "below". Save to list.

**Alert list:** ticker, direction, target price, current price, delete button.

**Triggering:** while the page is open and data is being polled, if any alert condition is met, show a banner at the top of the page with the ticker and the triggered condition. Alerts persist in localStorage.

---

## 12. Sidebar & Navigation Planning

The sidebar is the primary navigation hub. It needs to stay organized as features grow. Planned structure:

**Top section**
- App logo / name
- New Chat button
- Conversation list (scrollable, sorted by most recent, shows title and relative timestamp)

**Middle section**
- Token balance display (always visible)
- Model selector dropdown
- Plinko button
- Quests button
- Buy tokens button

**Bottom section**
- Assistant name editor
- Language selector
- Theme toggle
- DevLog / Changelog viewer
- Stock Market link
- Sign out

The sidebar should be collapsible on smaller screens. When collapsed it should show icon-only shortcuts for the most important actions: new chat, quests, Plinko, and sign out.

---

## 13. Error Handling & Edge Cases

These are states the app needs to handle gracefully — not ignore.

**API failures**
- If OpenRouter returns an error, show the error message inline in the chat rather than silently failing. Do not add a failed message to the conversation history.
- If Polygon.io returns an error or rate limit response, show a visible notice on the affected page (e.g. "Data unavailable — rate limit reached. Try again in 60 seconds."). Do not show stale data without labeling it as stale.

**Empty states**
- New user with no conversations: show a welcome message with a prompt to start chatting
- Watchlist with no stocks: show a clear empty state with a link to the screener
- Screener with no results matching filters: show "No stocks match your filters" with a reset filters button
- Alerts page with no alerts: show a prompt to add one

**Token balance edge cases**
- User tries to send a message with a paid model but has 0 tokens: block the send, show an inline message explaining why, offer the buy tokens button
- User tries to start a Plinko round with fewer tokens than the minimum bet: show the minimum bet requirement and disable all bet options they can't afford

**Authentication edge cases**
- Session expires mid-conversation: show a re-authentication prompt without losing the current chat history
- Guest user tries to access a feature that requires sign-in: show a prompt explaining what they'd get by signing in, with a sign-in button

**Network**
- If the user goes offline mid-stream, stop the stream and show a reconnect notice
- Do not retry API calls automatically — let the user decide when to resend

---

## 14. Performance Considerations

**Chat**
- Only send the last N messages in the conversation history to the API (not the full history). A rolling window of the last 20 messages is a reasonable default. This prevents hitting model context limits and keeps request size manageable.
- Virtualize the message list if a conversation gets very long (500+ messages). Do not render all messages in the DOM at once.

**Stock Market**
- The full ticker list from Polygon.io is large. Fetch it once per session and cache it in memory. Do not re-fetch it on every page navigation.
- The screener should render rows lazily — only render what's visible in the viewport, not all 10,000+ rows at once.
- Poll for quote updates on the Market Overview page every 60 seconds. Do not poll on pages the user isn't viewing.
- Cancel in-flight chart data requests when the user switches time range before the previous request completes.

**General**
- Debounce the screener search bar — do not filter on every keystroke, wait for the user to stop typing (200ms).
- Do not block the main thread with synchronous localStorage reads on startup. Load defaults immediately, then hydrate from storage.

---

## 15. Future Planning

These are directions to explore — not committed, not ordered by priority.

### 15.1 Cloud Data Sync
Move conversations, profile data, watchlists, and alerts from localStorage to Firebase Firestore. This would allow:
- Data to survive clearing the browser
- Access from multiple devices
- Seamless guest-to-authenticated migration that preserves existing data

Schema would need: a `users` collection with subcollections for `conversations`, `messages`, `quests`, `watchlist`, and `alerts`.

### 15.2 Real Payments
Wire the existing payment modal to Stripe. Token pack tiers to consider: 100 / 500 / 1000 / 5000. Use a Stripe webhook to confirm payment before crediting the balance — never credit on the client alone. Store transaction history in Firestore.

### 15.3 More LLM Models
Expand the model selector with more free and paid models from OpenRouter. Each model entry should define: display name, model ID, cost per message, context window size, and a short description of what it's good at. Paid models gate on token balance before sending.

### 15.4 Conversation Management
- Export a conversation as markdown or PDF
- Full-text search across all past conversations
- Pin important conversations so they stay at the top of the list regardless of recency
- Share a read-only conversation via a generated link (requires backend or Firebase hosting)
- Delete individual conversations or bulk-delete all

### 15.5 Expanded Quest System
- Separate daily quests (reset at midnight) from the 30-minute rotating set
- Weekly challenge quests with larger token rewards
- Achievement badges for permanent milestones: first message sent, 100 messages sent, 1000 tokens earned, first Plinko win, first 500x hit
- Quest history log: see what you completed and when
- Streak tracking: consecutive days with at least one completed quest

### 15.6 Plinko Improvements
- Animated ball drops with satisfying bounce physics and sound effects (toggle-able)
- One free drop per day — no token cost
- Time-limited special boards with different peg layouts and multiplier distributions
- Per-session stats panel: balls dropped, total spent, total earned, net gain/loss, biggest single-ball win
- Historical stats across all sessions stored in localStorage (or Firestore if synced)

### 15.7 Personalization Depth
- Multiple saved personas the user can name and switch between
- Per-conversation persona override: pick a different persona for just this chat without changing the global default
- Import and export persona settings as JSON so users can share or back them up

### 15.8 Progressive Web App
- Manifest and service worker so the app is installable on desktop and mobile
- Responsive layout: sidebar collapses to a bottom navigation bar on screens narrower than 768px
- Offline fallback page that explains the app needs a connection
- Cache static assets so the shell loads instantly even on slow connections

### 15.9 Stock Market Enhancements
- **Earnings calendar:** which companies are reporting earnings this week and next, with estimated EPS and revenue, and whether they beat/missed after the fact
- **Economic calendar:** upcoming macro events — Fed meetings, CPI release, jobs report, GDP — with expected vs. actual values after release
- **Compare mode:** overlay two or more tickers on the same chart with a shared time axis
- **Analyst ratings:** consensus buy/hold/sell rating and average price target per stock, sourced from Polygon.io or similar
- **Options chain viewer:** calls and puts for a given ticker, organized by expiry date, showing strike, bid, ask, volume, open interest, and implied volatility
- **Portfolio tracker:** user manually enters holdings (ticker, shares, average cost), app calculates current value, total gain/loss, and % return. No real brokerage integration.
- **Pre-market and after-hours data:** show extended-hours price and change where available

### 15.10 Accessibility
- Full keyboard navigation for all modals, dropdowns, and sidebar links
- Logical focus order — tab should move through interactive elements in a sensible sequence
- Screen reader support: ARIA labels on icon buttons, live region announcements for new chat messages
- High-contrast theme option as a third choice alongside dark and light
- Respect `prefers-reduced-motion` — disable canvas animations and transitions for users who have set this system preference

### 15.11 Developer Experience
- Error boundary that catches React render errors and shows a "something went wrong" screen with a reload button instead of a blank page
- Error reporting via Sentry or a similar service — capture unhandled errors and API failures with context
- Auto-generated changelog entries from git commit messages (conventional commits format)
- Local dev environment should work with a `.env.local` file — no hardcoded keys anywhere in the codebase

---

## 16. Constraints & Limitations

- No custom backend — everything is client-side. Firebase for auth, third-party APIs for all data.
- localStorage is the only persistence layer until Firestore is integrated. Data does not sync across devices and is lost if the browser storage is cleared.
- Polygon.io free tier has rate limits and a 15-minute data delay. Real-time data requires a paid Polygon plan.
- Payment processing is not yet live — the UI exists but no transactions are processed.
- No server-side rate limiting or abuse prevention. All API keys are exposed to the client via environment variables — this is acceptable for a personal project but not production-safe at scale.
- OpenRouter free models may have slow response times or availability issues — this is outside our control.

---

## 17. Out of Scope

- Native iOS or Android app
- Self-hosted LLM inference
- Multi-tenant or team accounts
- Automated content moderation pipeline
- Server-side rendering or SSR framework (Next.js, Remix, etc.)
- Real brokerage integration (no actual trading, ever)
- Email notifications or SMS alerts
