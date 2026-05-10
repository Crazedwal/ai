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

## 12. Future Planning

These are directions to explore — not committed, not ordered by priority.

### 12.1 Cloud Data Sync
Move conversations, profile data, watchlists, and alerts from localStorage to Firebase Firestore. This would allow:
- Data to survive clearing the browser
- Access from multiple devices
- Seamless guest-to-authenticated migration

### 12.2 Real Payments
Wire the existing payment modal to Stripe. Define token pack tiers (e.g. 100 / 500 / 1000 tokens). Handle webhook confirmation before crediting the balance.

### 12.3 More LLM Models
Expand the model selector with more free and paid models from OpenRouter. Paid models should require a positive token balance before allowing a message send.

### 12.4 Conversation Management
- Export a conversation as markdown or PDF
- Search across all past conversations by keyword
- Pin or star important conversations so they stay at the top of the list
- Share a read-only conversation via a link

### 12.5 Expanded Quest System
- Separate daily quests from the 30-minute rotating set
- More quest categories tied to model usage, login streaks, and conversation length
- Achievement badges for reaching milestones (e.g. 100 messages sent, 500 tokens earned)
- Quest history log showing past completed quests and rewards

### 12.6 Plinko Improvements
- Animated ball drops with sound effects
- One free drop per day that costs no tokens
- Time-limited board variants with different multiplier layouts
- Session stats: biggest win, total spent, total earned

### 12.7 Personalization Depth
- Multiple saved personas the user can switch between
- Per-conversation persona override (use a different persona for just this chat)
- Ability to import/export persona settings

### 12.8 Progressive Web App
- Make the app installable on desktop and mobile as a PWA
- Responsive layout: sidebar collapses to a bottom nav on small screens
- Offline fallback page

### 12.9 Stock Market Enhancements
- Earnings calendar: which companies are reporting earnings this week and next
- Economic calendar: upcoming Fed meetings, CPI, jobs report dates
- Compare mode on the chart: overlay two tickers on the same graph
- Analyst ratings and price targets per stock
- Options chain viewer per stock (calls and puts, strike prices, expiry dates)
- Portfolio tracker: manually enter holdings and track total value and performance over time

### 12.10 Accessibility
- Full keyboard navigation for all modals, dropdowns, and sidebar
- Screen reader support for chat message list
- High-contrast theme option separate from dark/light toggle
- Focus trap in modals

---

## 13. Constraints & Limitations

- No custom backend — everything is client-side. Firebase for auth, third-party APIs for all data.
- localStorage is the only persistence layer until Firestore is integrated. Data does not sync across devices and is lost if the browser is cleared.
- Polygon.io free tier has rate limits and data delay (15 minutes). Real-time data requires a paid plan.
- Payment processing is not yet live — the UI exists but no transactions are processed.
- No abuse prevention or rate limiting on API calls from the client.

---

## 14. Out of Scope

- Native iOS or Android app
- Self-hosted LLM inference
- Multi-tenant or team accounts
- Automated content moderation
- Server-side rendering
