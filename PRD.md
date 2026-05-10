# Product Requirements Document
**Project:** AI Chat Application (temp-project)
**Author:** Askyturi
**Last Updated:** 2026-05-10
**Status:** Active Development

---

## 1. Overview

A browser-based AI chat application with a gamified token economy. Users can have multi-turn conversations with a customizable AI assistant, earn and spend tokens, play a Plinko gambling mini-game, and complete rotating quests. Everything runs client-side — no traditional backend, using Firebase for auth and OpenRouter for LLM access.

---

## 2. Goals

- Provide a personalized AI chat experience shaped by user-defined personality and constraints
- Keep users engaged through gamification (tokens, quests, Plinko)
- Remain easy to extend with new models, features, and monetization layers
- Work fully in-browser with minimal infrastructure cost

---

## 3. Users

| Type | Description |
|---|---|
| Guest | No account, chats not saved, limited features |
| Authenticated | Google OAuth or email/password, full feature access |

---

## 4. What's Built

### 4.1 Authentication
- Google OAuth sign-in
- Email/password signup and login
- Guest mode (ephemeral session, chats not persisted)
- Sign out

### 4.2 AI Chat
- Multi-turn conversation with full message history
- Non-streaming message send via OpenRouter API
- Streaming infrastructure exists (`sendMessageStreaming`) but not wired to UI yet
- Conversation list in sidebar with auto-generated titles from first message
- Per-conversation persistence in localStorage
- Message timestamps and markdown rendering (code highlighting, GFM tables, etc.)

### 4.3 Model Selection
- Dropdown with free and premium sections
- Currently one active free model: `nvidia/nemotron-3-nano-30b-a3b:free`
- Token cost per message defined per model (0 for free models)
- Selected model persisted in localStorage

### 4.4 Personalization
- **Assistant Name:** Editable, defaults to "Assistant"
- **User Profile:** Optional setup modal (name, age, occupation, industry, expertise, use cases, response style, tone) — detailed or quick flow
- **User Constraints:** Who the user is, what frustrates them, what they're comfortable with — injected into every system message
- **KCD System:** Keep / Change / Delete flags to shape AI behavior
- All persona data is sent to the LLM as part of the system message on every request

### 4.5 Token Economy
- Starting balance: 50 tokens
- Peak balance tracked separately
- Free models cost 0 tokens; premium models deduct tokens
- Tokens can be earned through quests and Plinko winnings
- "Buy tokens" UI exists (PaymentPage modal with card, PayPal, Apple Pay, Google Pay, bank transfer tabs) — demo only, no real payments

### 4.6 Plinko
- Canvas-based physics simulation
- 15-row peg pyramid, 16 outcome slots
- Multipliers: 500x, 20x, 5x, 3x, 0x, 0x, 1x, 1x, 1x, 1x, 0x, 0x, 3x, 5x, 20x, 500x
- Bet 5 / 10 / 25 / 50 balls at a time (1 token per ball)
- Winnings paid out after all balls settle

### 4.7 Quests
- 4 active quests, rotated every 30 minutes
- Drawn from a pool of 20+ quest templates
- Seeded random selection per 30-minute window (same quests for everyone in a window)
- Tracks: messages sent, messages in a single chat, chats created, gambles played/won/lost, balls dropped, peak token balance
- Countdown timer to next rotation
- Auto-grants token rewards on completion

### 4.8 UI & Settings
- Dark / light theme toggle (persisted)
- 6 language options: EN, ES, FR, DE, ZH, JA (i18n keys implemented)
- AFK detection: 5-minute idle triggers a 30-second warning popup; blocks chat if dismissed
- DevLog / Changelog / Reflection modal (version history v1.0–v1.7)
- Sidebar: conversation list, new chat, token balance, Plinko, buy tokens, model selector, assistant name, language, devlog, external links, radio (rickroll), sign out

### 4.9 External Pages
- Stock Market Simulator (external HTML, shares API key via localStorage)
- Personality Matchmaker (external HTML)

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript/JSX |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (dark mode via class) |
| UI Components | shadcn/ui |
| Markdown | react-markdown + rehype-highlight + remark-gfm |
| Auth | Firebase Authentication |
| LLM API | OpenRouter |
| Icons | Lucide React |
| State | React Context + localStorage (no external state lib) |

---

## 6. Data Storage

Everything lives in localStorage. There is no database.

| Key | Contents |
|---|---|
| `tokenBalance` | Current token count |
| `peakBalance` | All-time highest balance |
| `selectedModel` | Active model ID |
| `assistantName` | Custom name for the assistant |
| `theme` | "dark" or "light" |
| `language` | Language code |
| `userPersona` | Personality matchmaker data |
| `userConstraints` | Who / frustrations / comforts |
| `userKCD` | Keep / Change / Delete flags |
| `userProfile` | Detailed profile fields |
| `profileSetupDone` | First-time setup flag |
| `questSession` | Active quest stats, completed IDs, seed |
| `openrouter_api_key` | Shared with external HTML pages |

---

## 6.5 Stock Market Simulator (Rebuild)

**Status:** Planned — replace the current external HTML page

### Requirements

**Data**
- Use a real financial API with a proper API key — **Polygon.io** (free tier gives real-time delayed quotes, full ticker list, company details, OHLCV history)
- Show **every stock** — not a 20% sample or filtered list. Full market coverage: NYSE, NASDAQ, AMEX
- Real ticker symbols and company names only
- Accurate price movements: realistic volatility based on market cap, sector-based correlation, no random walk to zero or infinity

**UI — Black, White, and Grey only**
- No colors except red for loss and green for gain (standard market convention)
- Clean, dense, data-first layout — no decorative elements
- Font-heavy, tabular design like a real terminal or Bloomberg-lite

**Charts & Sections every real stock market site has**
- Top Gainers table (% change, price, volume)
- Top Losers table (% change, price, volume)
- Most Active / Highest Volume table
- Market overview bar (indices: S&P 500, NASDAQ, DOW, Russell 2000)
- Individual stock chart: candlestick or line, switchable between 1D / 5D / 1M / 6M / 1Y / 5Y
- Sector performance heatmap (which sectors are up/down today)
- Stock screener: filter by price, volume, % change, market cap, sector
- Search bar: type ticker or company name to jump to stock detail page
- Stock detail page: price, change, market cap, P/E, 52-week high/low, volume, description, chart

**API Key**
- Replace the current hardcoded or shared key with a proper Polygon.io key stored in `.env` as `VITE_POLYGON_API_KEY`

---

## 7. Future Planning

These are features that may be built. Not committed, not ordered — just directions.

### 7.1 Message Streaming
Wire up `sendMessageStreaming()` to the chat UI so responses appear token-by-token instead of all at once. Already implemented in `api.js`, just needs to be connected in `useChat.js` and rendered progressively in `MessageBubble`.

### 7.2 Cloud Persistence (Firebase Firestore)
Move conversations and user data from localStorage to Firestore so:
- Chat history syncs across devices
- Guest → authenticated migration preserves history
- Data survives clearing the browser

### 7.3 More Models
Add more models to the model selector — both free (OpenRouter has many) and paid. Paid models would actually gate behind token balance.

### 7.4 Real Payments
Replace the demo PaymentPage with actual Stripe integration. Connect purchase to token balance increment. Consider token pack tiers (e.g., 100 / 500 / 1000 tokens).

### 7.5 Expanded Quest System
- More quest categories (model usage, streaks, social)
- Daily quests separate from the 30-minute rotating set
- Achievement badges for milestone completions
- Quest history log

### 7.6 Conversation Features
- Export conversation as markdown or PDF
- Search across all conversations
- Pin / star important conversations
- Share a conversation via link

### 7.7 Plinko Improvements
- Animated ball drop with sound
- Daily free drops (no token cost)
- Jackpot events or time-limited high-multiplier boards
- Leaderboard for biggest single-session wins

### 7.8 Personalization Depth
- Multiple saved personas (switch between them)
- Per-conversation persona override
- AI-suggested KCD tweaks based on conversation history

### 7.9 Social / Multiplayer
- Public chat rooms powered by the same LLM (multiple users, one AI)
- Challenge a friend to a Plinko run
- Shared quests or co-op goals

### 7.10 Mobile / PWA
- Make the app installable as a PWA
- Responsive sidebar that collapses to a bottom nav on small screens
- Push notifications for quest resets

### 7.11 Analytics & DevLog Automation
- Auto-generate changelog entries from git commits
- Usage stats dashboard for the developer (messages sent, models used, token flows)
- Error reporting (Sentry or similar)

### 7.12 Accessibility
- Full keyboard navigation for modals and sidebar
- Screen reader support for chat messages
- High-contrast theme option

---

## 8. Known Limitations

- All data is localStorage — cleared on browser wipe, not cross-device
- Payments are demo UI only — no real transactions
- Only one active LLM model (free tier)
- Streaming not connected to UI
- No error recovery if OpenRouter API is down
- No rate limiting or abuse prevention on the client

---

## 9. Out of Scope (for now)

- Native mobile app
- Self-hosted LLM inference
- Multi-tenant / team accounts
- Content moderation pipeline
