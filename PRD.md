# Product Requirements Document
**Project:** AI Chat Application
**Author:** Askyturi
**Last Updated:** 2026-05-10
**Status:** Active Development — Full Engineering Spec

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals](#2-goals)
3. [Tech Stack](#3-tech-stack)
4. [Project File Structure](#4-project-file-structure)
5. [Data Architecture](#5-data-architecture)
6. [Authentication](#6-authentication)
7. [App Shell & Layout](#7-app-shell--layout)
8. [Sidebar](#8-sidebar)
9. [AI Chat](#9-ai-chat)
10. [Personalization System](#10-personalization-system)
11. [Token Economy](#11-token-economy)
12. [Plinko](#12-plinko)
13. [Quests](#13-quests)
14. [AFK Detection](#14-afk-detection)
15. [DevLog & Changelog](#15-devlog--changelog)
16. [Stock Market Simulator](#16-stock-market-simulator)
17. [Error Handling](#17-error-handling)
18. [Performance](#18-performance)
19. [Future Planning](#19-future-planning)
20. [Constraints & Limitations](#20-constraints--limitations)
21. [Out of Scope](#21-out-of-scope)

---

## 1. Overview

A browser-based platform with two distinct products under one roof:

**AI Chat** — A personalized multi-turn conversation interface powered by LLMs via OpenRouter. Users define their own assistant name, personality constraints, communication preferences, and behavior rules. The experience is wrapped in a token economy with a Plinko gambling mini-game and a rotating quest system to drive engagement.

**Stock Market Viewer** — A professional-grade, real-data market tracking tool. No simulations. No fake money. Every stock on NYSE, NASDAQ, and AMEX. Accurate OHLCV charts, gainers/losers, sector performance, news feeds, watchlists, and price alerts. Design is strict black/white/grey — dense and functional.

Both products share Firebase Authentication. Everything else is client-side. No custom backend.

---

## 2. Goals

- Deliver a deeply personalized AI chat experience where the model actually adapts to the user's preferences over time
- Keep users returning daily through a well-designed token and quest loop
- Build a stock market viewer that feels like a real professional tool, not a toy
- Maintain a clean, extensible codebase that can grow without rewrites
- Lay the groundwork for real monetization (Stripe payments, premium models) without needing to rearchitect anything

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 19 | App-wide. Hooks-first architecture. |
| Language | TypeScript | Strict mode. All new files `.tsx` or `.ts`. |
| Build Tool | Vite 7 | Dev server + production build. Path alias `@` = `src/`. |
| Styling | Tailwind CSS 4 | Dark mode via `class`. No inline styles. |
| UI Primitives | shadcn/ui | Button, Badge, Card, Dialog, Dropdown, etc. |
| Markdown | react-markdown + rehype-highlight + remark-gfm | Chat message rendering. |
| Auth | Firebase Authentication | Google OAuth + email/password. |
| LLM API | OpenRouter | `https://openrouter.ai/api/v1/chat/completions` |
| Market API | Polygon.io | Full market data. Key in `.env` as `VITE_POLYGON_API_KEY`. |
| Icons | Lucide React | Consistent icon set throughout. |
| State | React Context + localStorage | No Redux or Zustand. One context per domain. |
| Charts | Recharts or lightweight-charts | For stock price charts (OHLCV + line). |
| Routing | React Router v6 | For stock market section multi-page navigation. |

---

## 4. Project File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx           # Full auth screen (Google, email/password, guest)
│   ├── chat/
│   │   ├── ChatArea.tsx            # Root chat container
│   │   ├── ChatHeader.tsx          # Title, theme toggle, model indicator
│   │   ├── ChatInput.tsx           # Textarea, send button, char count
│   │   ├── MessageBubble.tsx       # Single message — user or assistant
│   │   └── MessageList.tsx         # Scrollable list of MessageBubbles
│   ├── sidebar/
│   │   ├── Sidebar.tsx             # Root sidebar layout
│   │   ├── ConversationList.tsx    # Scrollable recent chats
│   │   ├── ModelSelector.tsx       # Free/paid model dropdown
│   │   └── NewChatButton.tsx       # Creates new conversation
│   ├── modals/
│   │   ├── GambleModal.tsx         # Plinko game + betting UI
│   │   ├── QuestsModal.tsx         # Active quests + progress
│   │   ├── ProfileSetupModal.tsx   # First-time profile setup
│   │   ├── UserConstraintsModal.tsx# Constraints + KCD editor
│   │   ├── PaymentPage.tsx         # Token purchase flow
│   │   ├── TokenPurchaseModal.tsx  # Token pack selection
│   │   ├── DevLog.tsx              # Changelog + devlog viewer
│   │   └── AfkCheck.tsx            # AFK warning popup
│   ├── stock/
│   │   ├── StockApp.tsx            # Root of stock market section
│   │   ├── StockNav.tsx            # Top nav (Overview, Screener, Watchlist, Alerts)
│   │   ├── pages/
│   │   │   ├── MarketOverview.tsx  # Home page
│   │   │   ├── Screener.tsx        # Full stock screener
│   │   │   ├── StockDetail.tsx     # Individual stock page
│   │   │   ├── Watchlist.tsx       # Saved stocks
│   │   │   └── Alerts.tsx          # Price alert manager
│   │   └── components/
│   │       ├── IndexBar.tsx        # S&P, NASDAQ, DOW, Russell strip
│   │       ├── StockTable.tsx      # Reusable sortable data table
│   │       ├── PriceChart.tsx      # Line/candlestick chart with time ranges
│   │       ├── SectorHeatmap.tsx   # Sector performance list
│   │       ├── NewsItem.tsx        # Single news headline row
│   │       ├── StatCard.tsx        # Key stat display (P/E, market cap, etc.)
│   │       ├── ScreenerFilters.tsx # Filter panel for screener
│   │       └── AlertBanner.tsx     # Price alert triggered notification
│   └── ui/
│       ├── button.tsx              # shadcn Button
│       ├── badge.tsx               # shadcn Badge
│       ├── card.tsx                # shadcn Card
│       ├── dialog.tsx              # shadcn Dialog
│       └── dropdown-menu.tsx       # shadcn DropdownMenu
├── hooks/
│   ├── useAuth.tsx                 # Firebase auth state, guest mode
│   ├── useChat.ts                  # Conversations, messages, API calls
│   ├── useTokens.tsx               # Balance, spending, earning
│   ├── useTheme.tsx                # Dark/light toggle
│   ├── useLanguage.tsx             # i18n
│   ├── useModel.tsx                # Selected model persistence
│   ├── useAssistantName.tsx        # Assistant name
│   ├── useQuests.tsx               # Quest rotation, stats, completion
│   ├── useAfkCheck.tsx             # Idle detection
│   ├── useWatchlist.ts             # Stock watchlist CRUD
│   ├── useAlerts.ts                # Price alert CRUD + polling
│   └── usePolygon.ts               # Polygon.io API wrapper + caching
├── lib/
│   ├── firebase.ts                 # Firebase app init
│   ├── api.ts                      # OpenRouter send + stream functions
│   ├── polygon.ts                  # Polygon.io fetch functions
│   └── systemMessage.ts            # Builds system message from user profile
├── contexts/
│   ├── AuthContext.tsx
│   ├── TokenContext.tsx
│   ├── QuestContext.tsx
│   └── ThemeContext.tsx
├── types/
│   ├── chat.ts                     # Message, Conversation types
│   ├── stock.ts                    # Ticker, Quote, OHLCV, News types
│   ├── quest.ts                    # Quest, QuestSession types
│   └── user.ts                     # UserProfile, UserConstraints, KCD types
├── constants/
│   ├── models.ts                   # Model definitions (id, name, cost, context)
│   ├── quests.ts                   # Full quest pool definitions
│   └── i18n.ts                     # Translation strings for all 6 languages
├── App.tsx                         # Root — auth gate, layout, routing
├── main.tsx                        # React entry point
└── index.css                       # Tailwind base + global styles
```

---

## 5. Data Architecture

### 5.1 localStorage Keys

All persistence is localStorage until Firestore is added.

| Key | Type | Contents |
|---|---|---|
| `tokenBalance` | number | Current token count |
| `peakBalance` | number | All-time highest balance |
| `selectedModel` | string | Active model ID |
| `assistantName` | string | Custom assistant name |
| `theme` | `"dark" \| "light"` | Current theme |
| `language` | string | Language code (en/es/fr/de/zh/ja) |
| `userProfile` | JSON | Detailed profile fields |
| `userConstraints` | JSON | Who / frustrations / comforts |
| `userKCD` | JSON | Keep / Change / Delete list |
| `profileSetupDone` | boolean | Whether first-time modal was shown |
| `questSession` | JSON | Active quests, stats, seed, completed IDs |
| `conversations` | JSON | Array of all conversations with messages |
| `stock_watchlist` | JSON | Array of watched ticker symbols |
| `stock_alerts` | JSON | Array of price alert objects |
| `openrouter_api_key` | string | Shared with external HTML pages |

### 5.2 Type Definitions

**Message**
```ts
type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  model?: string
}
```

**Conversation**
```ts
type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  model: string
}
```

**UserProfile**
```ts
type UserProfile = {
  name: string
  age?: number
  occupation?: string
  industry?: string
  expertiseLevel: "beginner" | "intermediate" | "expert"
  useCases: string[]
  responseStyle: "concise" | "detailed" | "balanced"
  tone: "formal" | "casual" | "friendly"
}
```

**UserConstraints**
```ts
type UserConstraints = {
  whoIAm: string
  frustrations: string
  comforts: string
}
```

**KCDItem**
```ts
type KCDItem = {
  id: string
  type: "keep" | "change" | "delete"
  text: string
}
```

**Quest**
```ts
type Quest = {
  id: string
  title: string
  description: string
  category: "chat" | "plinko" | "token"
  stat: string
  goal: number
  reward: number
}
```

**QuestSession**
```ts
type QuestSession = {
  windowSeed: number
  activeQuestIds: string[]
  completedIds: string[]
  stats: Record<string, number>
}
```

**StockAlert**
```ts
type StockAlert = {
  id: string
  ticker: string
  direction: "above" | "below"
  targetPrice: number
  createdAt: number
  triggered: boolean
}
```

---

## 6. Authentication

### 6.1 Login Page — `LoginPage.tsx`

This is the full-screen gate shown to unauthenticated users who are not in guest mode.

**Layout**
- Centered card on a dark background
- App name / logo at the top
- Three sections: Google sign-in, email/password, guest

**Google Sign-In Button**
- Full-width button with Google logo icon and text "Continue with Google"
- On click: triggers Firebase `signInWithPopup` with Google provider
- On success: closes login page, loads main app
- On error: shows inline error message below the button ("Sign-in failed. Try again.")

**Email / Password Section**
- Two inputs: Email (type=email), Password (type=password, with show/hide toggle)
- Two buttons: "Sign In" and "Create Account" — both use the same form fields
- Sign In: calls `signInWithEmailAndPassword`. On error: show specific message ("No account with that email" or "Incorrect password")
- Create Account: calls `createUserWithEmailAndPassword`. Requires password length ≥ 8 characters. On error: show specific message ("Email already in use")
- Inline validation: email format check on blur, password length check on blur
- Loading spinner on the active button while request is in flight. Disable both buttons during request.

**Guest Mode**
- Text link: "Continue as guest"
- On click: sets a `isGuest` flag in context, skips Firebase auth entirely, loads main app
- Guest banner: a non-dismissable strip at the top of the app reading "You're in guest mode — chats won't be saved. [Sign in]"

**States to handle**
- Default (no input)
- Loading (request in flight)
- Error (message displayed inline, form re-enabled)
- Success (transition to main app)

---

## 7. App Shell & Layout

### 7.1 Root Layout — `App.tsx`

The root component handles:
1. Auth gate: if no user and not guest, render `LoginPage`. Otherwise render main app.
2. First-time profile setup: if authenticated and `profileSetupDone` is false, show `ProfileSetupModal` on top of everything.
3. AFK check: mount `AfkCheck` at root level so it works across all screens.
4. Theme: apply `dark` or `light` class to the `html` element based on theme context.
5. Main layout: a horizontal flex container — `Sidebar` on the left, `ChatArea` on the right.

**Routing**
The stock market section uses React Router. Routes:
- `/` — main chat app (Sidebar + ChatArea)
- `/stock` — redirects to `/stock/overview`
- `/stock/overview` — MarketOverview page
- `/stock/screener` — Screener page
- `/stock/screener/:ticker` — StockDetail page
- `/stock/watchlist` — Watchlist page
- `/stock/alerts` — Alerts page

### 7.2 Guest Banner
Rendered below the top of the screen when `isGuest` is true. Fixed position, full width, subtle but visible. Contains a "Sign in" link that opens the login flow without losing any current conversation state.

---

## 8. Sidebar

### 8.1 Root — `Sidebar.tsx`

Fixed-width left panel. Flex column layout with three zones: top, middle (scrollable), bottom.

**Width:** 260px on desktop. Collapsible to icon-only (48px) on screens under 768px — icon-only mode shows tooltips on hover.

**Top Zone (fixed)**
- App name / branding
- `NewChatButton` — always at the top
- `ConversationList` — fills available space, scrollable

**Middle Zone (scrollable if needed)**
- Token balance display
- Model selector
- Plinko button
- Quests button
- Buy Tokens button

**Bottom Zone (fixed)**
- Assistant name editor
- Language selector
- Theme toggle
- DevLog button
- Stock Market link
- Sign out button (or "Sign in" for guests)

### 8.2 Conversation List — `ConversationList.tsx`

**Display**
- Each conversation shown as a row: title (truncated to 1 line with ellipsis) + relative timestamp ("2h ago", "Yesterday", date if older)
- Active conversation highlighted with a background color
- Hover state shows a delete icon (trash) on the right side of the row

**Behavior**
- Clicking a row switches the active conversation — loads its messages into ChatArea
- Clicking the trash icon shows a small confirmation popover ("Delete this chat?") with Confirm and Cancel. On confirm, removes the conversation from localStorage and from the list.
- List is sorted by `updatedAt` descending (most recently active first)
- If there are no conversations, show a subtle empty state: "No chats yet. Start one above."

**Performance**
- If the list exceeds 100 conversations, paginate or virtualize — do not render all at once

### 8.3 New Chat Button — `NewChatButton.tsx`

- Full-width button at top of sidebar
- On click: creates a new empty `Conversation` object, saves it to localStorage, sets it as active, clears ChatArea messages
- The new conversation title defaults to "New Chat" until the first message is sent

### 8.4 Model Selector — `ModelSelector.tsx`

- Dropdown trigger shows currently selected model name
- Dropdown opens a list grouped into "Free" and "Premium" sections
- Each model row shows: model name, context window size, cost per message (or "Free")
- Selecting a model closes the dropdown and updates the active model in context and localStorage
- If a premium model is selected and the user has 0 tokens, show a warning badge next to the model name in the trigger ("Insufficient tokens")

**Model object shape**
```ts
type Model = {
  id: string
  name: string
  provider: string
  contextWindow: number
  costPerMessage: number  // in tokens; 0 = free
  description: string
  isPremium: boolean
}
```

### 8.5 Token Balance Display

- Shows the current token count as a number with a coin icon
- Updates in real time as tokens are spent or earned
- Clicking opens the `TokenPurchaseModal`

### 8.6 Assistant Name Editor

- An editable text field showing the current assistant name
- Clicking it or pressing Enter makes it editable inline
- On blur or Enter: saves the new name to localStorage and updates context
- Empty input is not allowed — reverts to previous value if submitted empty
- Max length: 30 characters

### 8.7 Language Selector

- Dropdown with 6 options: English, Español, Français, Deutsch, 中文, 日本語
- Selecting a language updates all UI labels immediately (no page reload)
- Persists in localStorage

### 8.8 Theme Toggle

- A single icon button that toggles between dark and light
- Moon icon in dark mode, sun icon in light mode
- Updates the `html` class immediately
- Persists in localStorage

---

## 9. AI Chat

### 9.1 Chat Area Root — `ChatArea.tsx`

The main content area to the right of the sidebar. Flex column layout:
- `ChatHeader` at the top (fixed height)
- `MessageList` in the middle (fills space, scrollable)
- `ChatInput` at the bottom (fixed height, grows with content)

Receives the active conversation ID as a prop. Reads messages from that conversation out of context/localStorage.

### 9.2 Chat Header — `ChatHeader.tsx`

**Contents (left to right)**
- Hamburger icon to toggle sidebar (on mobile)
- Conversation title (editable — clicking opens an inline text input, Enter saves, Escape cancels)
- Model indicator badge (shows the currently active model name, pill-shaped)
- Theme toggle button

**Conversation title editing**
- Default title: auto-generated from the first user message (first 50 characters, truncated cleanly at a word boundary)
- User can click the title to rename it manually
- Changes saved to localStorage immediately on blur or Enter

### 9.3 Message List — `MessageList.tsx`

**Layout**
- Vertically scrollable container
- Messages are rendered in chronological order
- Auto-scrolls to the bottom when a new message is added or while streaming
- If the user scrolls up (manual scroll), stop auto-scroll. Resume auto-scroll when they scroll back to the bottom.
- Show a "Jump to bottom" floating button when the user is scrolled up and a new message arrives

**Empty state**
- When a conversation has no messages, show a centered welcome prompt: assistant name, a short tagline, and 3–4 suggested starter prompts that the user can click to auto-fill the input

**Loading state**
- While awaiting the first token of a streaming response, show a typing indicator (three animated dots in an assistant bubble)

### 9.4 Message Bubble — `MessageBubble.tsx`

**User messages**
- Right-aligned
- Plain text background (no markdown rendering needed for user messages)
- Timestamp shown on hover below the bubble
- No avatar

**Assistant messages**
- Left-aligned
- Avatar: a circle with the first letter of the assistant name
- Markdown rendered: headings, bold, italic, code blocks (syntax highlighted), inline code, tables, lists, blockquotes, links (open in new tab)
- Timestamp shown on hover
- Copy button appears on hover — copies the full message text to clipboard
- Model name shown in small text below the bubble (which model generated this response)

**Streaming state**
- While streaming, the bubble grows token-by-token
- A blinking cursor appears at the end of the last token
- No copy button shown while streaming

### 9.5 Chat Input — `ChatInput.tsx`

**Layout**
- Full-width textarea at the bottom of ChatArea
- Send button on the right
- Character / token count hint below (optional, shows when message is long)

**Behavior**
- Enter submits the message
- Shift+Enter inserts a newline
- Textarea starts at 1 row height and grows up to 6 rows, then becomes scrollable
- While streaming: textarea is disabled, send button is disabled and shows a stop/cancel icon
- Cancel button: if the user clicks stop during streaming, abort the fetch and finalize the partial response as-is
- Empty message: send button disabled when input is empty or whitespace-only
- After sending: clear the input, reset textarea height to 1 row

### 9.6 Message Sending Flow

1. User types message and hits Enter (or clicks send)
2. Validate: not empty, not currently streaming, model selected, sufficient token balance if paid model
3. If paid model: deduct token cost immediately from balance. If insufficient balance: show inline error, do not send.
4. Add user message to conversation in state and localStorage immediately (optimistic)
5. Build the API request:
   - Model ID from selected model
   - Messages array: system message + last N messages from conversation (rolling window of 20)
   - System message built from `buildSystemMessage(userProfile, userConstraints, userKCD, assistantName)`
6. Start streaming fetch to OpenRouter
7. Show typing indicator while waiting for first token
8. As tokens arrive: update the assistant message bubble in real time
9. On stream complete: finalize the message, save to localStorage, update conversation `updatedAt`, update quest stats (`messagesSent`, `messagesInChat`)
10. On error: remove the optimistic user message, refund tokens if deducted, show inline error in ChatArea

### 9.7 System Message Builder — `lib/systemMessage.ts`

Builds the system message string from all user data:

```
You are [assistantName], a helpful AI assistant.

About the user:
[userConstraints.whoIAm]

The user prefers responses that are [responseStyle] and [tone].
They are a [expertiseLevel] in [occupation] in the [industry] industry.

Please:
[KCD keep items]

Please change:
[KCD change items]

Do not:
[KCD delete items]

Things that frustrate the user:
[userConstraints.frustrations]

Things the user is comfortable with:
[userConstraints.comforts]
```

If any section is empty or the user hasn't set up a profile, omit that section from the message entirely. Never send empty headings.

### 9.8 API Layer — `lib/api.ts`

**`sendMessage(messages, model, apiKey)`**
- Standard fetch to OpenRouter, no streaming
- Returns the full response text

**`sendMessageStreaming(messages, model, apiKey, onToken, onComplete, onError)`**
- Fetch with `stream: true`
- Parses SSE chunks as they arrive
- Calls `onToken(chunk)` for each token
- Calls `onComplete()` when stream ends
- Calls `onError(err)` on failure
- Returns an abort controller so the caller can cancel

Both functions include headers: `Authorization: Bearer {key}`, `HTTP-Referer`, `X-Title`.

---

## 10. Personalization System

### 10.1 Profile Setup Modal — `ProfileSetupModal.tsx`

Shown on first authenticated visit. Three-screen flow.

**Screen 1 — Choose path**
- Heading: "Let's set up your experience"
- Two large cards: "Quick Setup (1 minute)" and "Detailed Setup (3 minutes)"
- Skip link at bottom: "Skip for now"
- Skip sets `profileSetupDone = true` without saving any profile data

**Screen 2A — Quick Setup**
- Field: Your name (text input, required)
- Field: Preferred response style (radio: Concise / Balanced / Detailed)
- "Finish" button — saves profile, sets `profileSetupDone = true`, closes modal

**Screen 2B — Detailed Setup (multi-step within the modal)**

Step 1 of 3 — Who are you?
- Name (required)
- Age (optional, number)
- Occupation (text)
- Industry (text)
- Expertise level (radio: Beginner / Intermediate / Expert)

Step 2 of 3 — How do you work?
- Main use cases (multi-select checkboxes: Coding, Writing, Research, Learning, Brainstorming, Other)
- Preferred response style (radio: Concise / Balanced / Detailed)
- Preferred tone (radio: Formal / Casual / Friendly)

Step 3 of 3 — Customize the assistant
- What should the assistant always do? (free text — feeds into KCD "keep")
- What should the assistant never do? (free text — feeds into KCD "delete")

Back and Next buttons between steps. Progress bar (1/3, 2/3, 3/3). "Finish" on last step.

After finishing: save all data to their respective localStorage keys, set `profileSetupDone = true`, close modal.

### 10.2 User Constraints Modal — `UserConstraintsModal.tsx`

Accessible from the sidebar at any time. Full-screen modal.

**Fields**
- "Who I am" — large textarea. This is injected as raw context into every system message. Example: "I'm a senior backend engineer who works mostly in Python and Go."
- "What frustrates me" — large textarea. Examples: overly verbose answers, explaining things I already know, unnecessary caveats.
- "What I'm comfortable with" — large textarea. Examples: technical jargon, blunt feedback, code-heavy answers.

**Behavior**
- Auto-saves on blur of each field (no save button required, but show a subtle "Saved" indicator)
- Changes take effect on the next message sent
- "Reset to blank" link at the bottom — clears all three fields with a confirmation step

### 10.3 KCD System — part of `UserConstraintsModal.tsx` or a dedicated tab

Keep / Change / Delete — a structured list of behavior rules.

**UI**
- Three sections: Keep, Change, Delete — each as a vertical list
- Each item is a pill/chip with the rule text and a remove (×) button
- An "Add" input at the bottom of each section — type a rule and press Enter or click Add
- Drag to reorder within a section (optional enhancement)

**Storage**
Saved as an array of `KCDItem` objects in localStorage under `userKCD`.

**Examples shown as placeholder text**
- Keep: "Always show working code, not pseudocode"
- Change: "Make responses shorter"
- Delete: "Stop adding 'I hope this helps'"

### 10.4 Language System — `hooks/useLanguage.tsx`

All UI strings live in `constants/i18n.ts` as a nested object keyed by language code. The `useLanguage` hook returns a `t(key)` function that looks up the string in the active language and falls back to English if the key is missing.

Languages supported: `en`, `es`, `fr`, `de`, `zh`, `ja`.

Every user-facing label, button, and placeholder in the app must use `t()` — no hardcoded English strings in components.

---

## 11. Token Economy

### 11.1 Balance Hook — `hooks/useTokens.tsx`

Exposes:
- `balance: number` — current token count
- `peakBalance: number` — all-time highest
- `spend(amount: number): boolean` — deducts tokens. Returns false if insufficient. Updates peak if new balance would be higher (it wouldn't, but check is there for edge cases).
- `earn(amount: number): void` — adds tokens, updates peak if new balance is higher
- `reset(): void` — resets to 0 (for testing/dev only)

All changes persist to localStorage immediately. Context wraps the whole app so any component can call these.

### 11.2 Spending Rules

| Action | Cost |
|---|---|
| Message on a free model | 0 tokens |
| Message on a paid model | Defined per model in `constants/models.ts` |
| Plinko ball | 1 token each |

Spending must be validated before the action happens. If the user can't afford it, block the action and show why.

### 11.3 Earning Rules

| Action | Reward |
|---|---|
| Quest completion | Defined per quest in `constants/quests.ts` |
| Plinko payout | Bet × slot multiplier |

### 11.4 Token Purchase Modal — `PaymentPage.tsx` + `TokenPurchaseModal.tsx`

**Step 1 — Pack Selection (`TokenPurchaseModal.tsx`)**
- Three token packs displayed as cards:
  - Starter: 100 tokens — $0.99
  - Popular: 500 tokens — $3.99 (highlighted as "Best Value")
  - Pro: 1000 tokens — $6.99
- Each card shows the pack name, token count, price, and a "Select" button
- Selecting a pack advances to Step 2

**Step 2 — Checkout (`PaymentPage.tsx`)**
- Tabbed interface: Card, PayPal, Apple Pay, Google Pay, Bank Transfer
- Card tab: Number (masked input), Expiry (MM/YY), CVV, Name on card
- PayPal tab: "Continue to PayPal" button (placeholder)
- Apple Pay / Google Pay: browser payment request API buttons (placeholder)
- Bank Transfer: routing/account number fields (placeholder)
- Order summary panel on the right: pack name, token count, price, "Complete Purchase" button
- All tabs: currently UI-only. Stripe integration is planned for a later phase. For now, clicking "Complete Purchase" shows a success message and does NOT credit tokens.
- A note in the UI: "Payment processing coming soon — purchases are not yet active."

---

## 12. Plinko

### 12.1 Modal — `GambleModal.tsx`

Full-screen modal containing the Plinko board and betting controls.

**Layout**
- Canvas occupies the top 70% of the modal
- Betting controls occupy the bottom 30%
- Close button (×) in the top right — only active when no balls are currently dropping

### 12.2 Canvas Board

**Dimensions**
- Canvas element sized to fill available width, fixed height (e.g. 500px)
- Board is responsive — peg positions scale with canvas width

**Pegs**
- 15 rows of pegs arranged in a pyramid (row 1 has 3 pegs, row 15 has 17 pegs)
- Pegs are drawn as small filled circles
- Peg radius: 5px, spacing calculated to fit canvas width

**Slots**
- 16 slots at the bottom of the board
- Each slot shows its multiplier label: 500×, 20×, 5×, 3×, 0×, 0×, 1×, 1×, 1×, 1×, 0×, 0×, 3×, 5×, 20×, 500×
- When a ball lands in a slot, highlight that slot for 1.5 seconds

**Ball Physics**
- Each ball has: `x`, `y`, `vx`, `vy` (velocity components)
- Each frame: apply gravity to `vy`, update position by velocity
- On peg collision: reverse `vy`, apply random horizontal deflection (±30–60% of impact speed), reduce horizontal velocity slightly
- On wall collision: reverse `vx`
- Ball stops when it reaches a slot row and its `vy` is near zero
- Balls run in parallel using `requestAnimationFrame`

### 12.3 Betting Controls

**Bet size selector**
- Four buttons: 5 balls, 10 balls, 25 balls, 50 balls
- Shows total token cost next to each (5, 10, 25, 50 tokens)
- Buttons that would exceed the user's balance are disabled and greyed out
- Selected bet size is highlighted

**Drop button**
- "Drop Balls" — triggers the round
- Disabled while balls are in flight
- Shows the total cost: "Cost: N tokens"

**Stats display**
- Round result: "You spent N tokens. You won M tokens. Net: +/- X tokens."
- Shown after all balls have settled
- Token balance updates in real time as each ball lands

### 12.4 Quest Stat Tracking

After each round completes, update quest stats:
- `gamblesPlayed += 1`
- `gamblesWon += 1` if payout > cost
- `gamblesLost += 1` if payout < cost
- `ballsDropped += betSize`

---

## 13. Quests

### 13.1 Rotation Logic — `hooks/useQuests.tsx`

Every 30 minutes on a fixed schedule (e.g. 00:00, 00:30, 01:00...), a new set of 4 quests is selected.

**Window calculation**
```ts
const now = Date.now()
const windowMs = 30 * 60 * 1000
const windowSeed = Math.floor(now / windowMs)
```

`windowSeed` is a number that increments every 30 minutes. Use it as the seed for a deterministic pseudo-random shuffle of the quest pool. Take the first 4 from the shuffled result. Everyone with the same `windowSeed` gets the same 4 quests.

**State**
Stored in `questSession` localStorage key. On mount, check if the stored `windowSeed` matches the current window. If not, it's a new window — reset stats, generate new active quests, clear completed IDs.

### 13.2 Quest Pool — `constants/quests.ts`

Full pool of 20+ quest templates:

**Chat category**
- Send 5 messages
- Send 10 messages
- Send 25 messages
- Send 5 messages in a single conversation
- Create 3 new conversations
- Send a message longer than 200 characters
- Have a conversation with more than 10 back-and-forth exchanges

**Plinko category**
- Play 3 Plinko rounds
- Play 5 Plinko rounds
- Win 2 Plinko rounds (payout > cost)
- Lose 3 Plinko rounds
- Drop 50 balls total
- Drop 100 balls total
- Hit a 20× or higher multiplier at least once
- Earn 30 tokens from a single Plinko session

**Token category**
- Reach a peak balance of 100 tokens
- Reach a peak balance of 200 tokens
- Earn 50 tokens total in one session

Each quest definition includes: `id`, `title`, `description`, `category`, `stat` (the key in questStats to check), `goal` (the number to reach), `reward` (tokens to grant on completion).

### 13.3 Stat Tracking

Quest stats are tracked globally via `useQuests`. Other hooks call into it when actions happen:

- `useChat` calls `incrementStat("messagesSent")` on each sent message
- `useChat` calls `incrementStat("messagesInChat")` on each message in the current chat
- `useChat` calls `incrementStat("chatsCreated")` on new chat creation
- `useTokens` calls `checkPeakBalance()` whenever balance updates
- `GambleModal` calls `incrementStat("gamblesPlayed")`, etc. after each round

On every stat increment, check all active quests to see if any have been completed. If a quest's `stat >= goal` and it's not already in `completedIds`: grant reward tokens, add to `completedIds`, show a completion toast notification.

### 13.4 Quests Modal — `QuestsModal.tsx`

Full-screen modal triggered from the sidebar.

**Contents**
- Header: "Active Quests" + countdown timer to next rotation (MM:SS format)
- 4 quest cards, each showing:
  - Quest title
  - Description
  - Progress bar: filled % = current stat / goal
  - Progress label: "7 / 10 messages sent"
  - Reward badge: "+15 tokens"
  - Completed checkmark overlay if done
- Footer: "Quests reset in [countdown]"

**Toast notification**
When a quest completes (anywhere in the app), show a toast in the bottom-right corner:
- "Quest Complete! [Quest Title] — +N tokens"
- Auto-dismisses after 4 seconds
- Can be manually dismissed

---

## 14. AFK Detection

### 14.1 Hook — `hooks/useAfkCheck.tsx`

**Idle detection**
Listen for: `mousemove`, `mousedown`, `keydown`, `touchstart`, `scroll`. Any of these resets the idle timer.

If 5 minutes pass with no activity: trigger the AFK state.

**AFK state**
Set a boolean `isAfk = true`. This causes the `AfkCheck` modal to render.

### 14.2 AFK Modal — `AfkCheck.tsx`

Rendered at the root level (`App.tsx`) when `isAfk` is true.

**Contents**
- Heading: "Are you still there?"
- Body: "You've been inactive for a while."
- Countdown: "This will close in 30 seconds" — counts down live
- "I'm here" button — resets the idle timer, closes the modal, re-enables chat

**If countdown reaches 0**
- Close the modal
- Set `chatBlocked = true`
- Overlay the ChatInput with a full-width message: "Session paused due to inactivity. Click anywhere to resume."
- Clicking anywhere resumes the session (resets timer, clears blocked state)

---

## 15. DevLog & Changelog

### 15.1 DevLog Modal — `DevLog.tsx`

Full-screen modal accessible from the sidebar.

**Three tabs**

**Changelog tab**
- Version history listed in reverse chronological order (newest first)
- Each entry: version number, date, bulleted list of changes
- Versions: v1.0.0 through current
- Styled like a traditional changelog — monospace version numbers, clean list formatting

**DevLog tab**
- Developer journal entries — less formal than changelog
- Each entry: date, title, body text explaining decisions, what was tried, what failed, what was kept
- Intended to document the reasoning behind technical choices

**Reflection tab**
- Freeform section for lessons learned, things that went well, things to do differently next time
- Not versioned — just a running document

**Search**
- A search bar at the top filters all entries across all tabs by keyword in real time

---

## 16. Stock Market Simulator

### 16.1 Entry Point — `StockApp.tsx`

A self-contained React subtree mounted at `/stock`. Has its own React Router `<Routes>` inside it. Shares the Firebase auth context but otherwise completely separate from the chat app.

All components inside `src/components/stock/` follow the same design rules:
- Colors: `#0a0a0a` background, `#1a1a1a` surfaces, `#2a2a2a` borders, `#f0f0f0` text, `#888` secondary text
- Gains: `#00c853`, Losses: `#ff1744`
- Monospace font for all numbers (`font-mono`)
- No gradients, no rounded corners beyond 2px, no shadows, no decorative elements

### 16.2 Navigation — `StockNav.tsx`

Sticky top bar, full width, `#111` background, `#2a2a2a` bottom border.

**Left side**
- "← Back to Chat" link — navigates to `/`

**Center / Right**
- Nav links: Market Overview, Screener, Watchlist, Alerts
- Active link: underline only. No bold, no color change.
- On mobile: links collapse into a hamburger dropdown

**Far right**
- Market status indicator: a small dot + text ("Market Open", "Market Closed", "Pre-Market", "After-Hours")
- Status determined by current time vs NYSE trading hours (9:30 AM – 4:00 PM ET on weekdays, accounting for holidays is optional)

### 16.3 Polygon.io API Wrapper — `lib/polygon.ts`

All Polygon.io API calls go through this file. The key is read from `import.meta.env.VITE_POLYGON_API_KEY`.

**Functions to implement**
```ts
getTickers(page, limit): Promise<TickerListResponse>
getQuote(ticker): Promise<Quote>
getQuotes(tickers: string[]): Promise<Record<string, Quote>>
getOHLCV(ticker, from, to, multiplier, timespan): Promise<OHLCVBar[]>
getCompanyDetails(ticker): Promise<CompanyDetails>
getTickerNews(ticker, limit): Promise<NewsItem[]>
getMarketNews(limit): Promise<NewsItem[]>
getMarketStatus(): Promise<MarketStatus>
getGainersLosers(direction): Promise<Quote[]>
getMostActive(): Promise<Quote[]>
```

**Caching**
- `getTickers()` result is cached in memory for the session — only fetched once
- `getQuote()` results are cached for 60 seconds
- `getCompanyDetails()` results are cached for 24 hours (session-level)
- `getTickerNews()` results are cached for 5 minutes

Implement a simple in-memory cache with TTL: a `Map<string, { data: any, expiry: number }>`.

### 16.4 Market Overview Page — `pages/MarketOverview.tsx`

The default page when visiting `/stock`.

**Index Bar — `IndexBar.tsx`**
Always at the top, full width. Four index cards side by side (or 2×2 on mobile):
- S&P 500 (SPY or SPX)
- NASDAQ Composite (QQQ or COMP)
- DOW Jones (DIA or DJIA)
- Russell 2000 (IWM or RUT)

Each card shows:
- Index name
- Current value (monospace, large font)
- Point change (+ or −, colored green/red)
- % change (colored green/red)
- Small sparkline (last 5 trading days)

Data refreshed every 60 seconds while the page is visible.

**Three-Column Tables Section**

Three equal-width tables side by side (stack vertically on mobile):

*Top Gainers — ranked by % change descending*
Columns: #, Ticker, Company Name, Price, % Change, Volume

*Top Losers — ranked by % change ascending*
Same columns.

*Most Active — ranked by volume descending*
Same columns.

Each table shows 10 rows. Clicking any row navigates to `/stock/screener/:ticker`.

**Sector Performance — `SectorHeatmap.tsx`**

A ranked list of all 11 GICS sectors:
- Technology
- Health Care
- Financials
- Consumer Discretionary
- Communication Services
- Industrials
- Consumer Staples
- Energy
- Utilities
- Real Estate
- Materials

Each row: sector name, average % change for the day (colored), a small horizontal bar showing relative magnitude.
Sorted by % change descending. Data sourced from Polygon.io sector aggregate data.

**Market News Feed**

Below the tables. A vertical list of the 20 most recent market-wide news headlines.

Each `NewsItem` shows:
- Headline (bold, clickable — opens article URL in new tab)
- Source name (e.g. "Reuters", "Bloomberg")
- Published time (relative: "3 minutes ago", "2 hours ago")
- Ticker tags if the article is related to specific stocks (pill badges)

News refreshes every 5 minutes.

### 16.5 Stock Screener Page — `pages/Screener.tsx`

**Layout**
- Filter panel on the left (fixed width 240px, collapsible)
- Results table on the right (takes remaining width)

**Filter Panel — `ScreenerFilters.tsx`**

All filters are applied client-side after the full ticker list is loaded.

| Filter | UI Control |
|---|---|
| Search | Text input — filters ticker symbol OR company name, debounced 200ms |
| Exchange | Checkboxes: NYSE, NASDAQ, AMEX |
| Sector | Dropdown multi-select (all 11 GICS sectors) |
| Market Cap | Preset buttons: All, Mega (>200B), Large (10B–200B), Mid (2B–10B), Small (300M–2B), Micro (<300M) |
| Price Range | Two number inputs: Min Price, Max Price |
| % Change Range | Two number inputs: Min %, Max % |
| Volume Min | Number input |

"Reset All Filters" button at the bottom of the filter panel.

**Results Table — `StockTable.tsx`**

Reusable sortable table component. Props: `columns`, `data`, `onRowClick`.

Columns for screener: #, Ticker, Company Name, Price, Change ($), % Change, Volume, Market Cap, Sector, Exchange.

**Sorting**
- Click any column header to sort by that column (ascending). Click again to sort descending. Arrow indicator shows current sort direction.
- Default sort: Market Cap descending.

**Pagination**
- Show 50 rows per page
- Page controls at the bottom: "Showing 1–50 of 8,432 stocks" + Previous / Next buttons + page number input
- All data is in memory — pagination is purely rendering-side

**Loading state**
- On first load: skeleton rows (grey pulsing bars in each cell)
- While filters are being applied: no spinner — filtering is fast enough client-side

**Row click**
Navigates to `/stock/screener/:ticker`

### 16.6 Stock Detail Page — `pages/StockDetail.tsx`

Route: `/stock/screener/:ticker`

**Header**
- Ticker symbol (large, bold, monospace)
- Company full name (smaller, secondary color)
- Current price (large, monospace)
- Change dollar amount and % (colored, with + or − prefix)
- Market status badge (Open / Closed / Pre-Market / After-Hours)
- Watchlist button: "Add to Watchlist" / "Remove from Watchlist" (toggles based on watchlist state)

**Key Stats Row — `StatCard.tsx`**

A horizontal row of stat cards. Each card shows a label and a value.

| Stat | Source |
|---|---|
| Market Cap | Polygon company details |
| P/E Ratio | Polygon financials |
| EPS | Polygon financials |
| 52-Week High | Polygon aggregates |
| 52-Week Low | Polygon aggregates |
| Avg Daily Volume | Polygon aggregates |
| Dividend Yield | Polygon details (show "—" if none) |
| Beta | Polygon details |
| Shares Outstanding | Polygon details |

**Price Chart — `PriceChart.tsx`**

Time range buttons: 1D, 5D, 1M, 3M, 6M, 1Y, 5Y. Default: 1D.

Chart type toggle: Line / Candlestick. Default: Line.

On time range change: fetch new OHLCV data from Polygon.io for that range. Cancel previous in-flight request if it hasn't completed. Show a loading state while fetching.

Line chart: draws closing price over time. X-axis: time labels appropriate for the range (hours for 1D, dates for longer). Y-axis: price range with gridlines.

Candlestick chart: standard OHLC candles. Green for up days (close > open), red for down days. Wicks for high/low.

Hover tooltip: shows date/time, open, high, low, close, volume.

**About Section**
- Company description (full text, no truncation)
- Sector and Industry (with link to screener filtered by that sector)
- Website (external link)
- Employee count (formatted: "84,200 employees")
- Headquarters

**News Feed**
- Latest 10 headlines specific to this ticker
- Same format as market overview news feed (headline, source, time, link)
- "Load more" button to fetch 10 more

**Data Refresh**
- Quote (price, change) refreshes every 60 seconds while the page is visible
- News refreshes every 5 minutes
- Company details and stats: once per session (cached)

### 16.7 Watchlist Page — `pages/Watchlist.tsx`

**Empty state**
Centered message: "Your watchlist is empty." with a "Browse stocks" button that links to the screener.

**Populated state**
A table with the same columns as the screener (Ticker, Company Name, Price, % Change, Volume, Market Cap) plus a Remove column (trash icon button on each row).

Each row is clickable — navigates to the stock detail page.

Quotes refresh every 60 seconds while the page is visible.

Watchlist is persisted in localStorage under `stock_watchlist` as an array of ticker symbols. Adding/removing from the watchlist (via the detail page button or this page's remove button) updates the array immediately.

### 16.8 Alerts Page — `pages/Alerts.tsx`

**Add Alert Form**
At the top of the page.
- Ticker input: typeahead search (type 2+ characters, shows a dropdown of matching tickers from the cached ticker list)
- Direction: radio buttons — "Above" / "Below"
- Target price: number input
- "Add Alert" button — validates that ticker is valid, price is a positive number, then saves to `stock_alerts` in localStorage

**Alerts Table**
Columns: Ticker, Company Name, Direction, Target Price, Current Price, Status, Delete.

- Status: "Active" (grey pill) or "Triggered" (green or red pill depending on direction)
- Current price column updates every 60 seconds while the page is open
- When a price crosses the threshold: mark the alert as triggered in state, show the `AlertBanner`

**Alert Banner — `AlertBanner.tsx`**
A fixed banner at the top of the page (below the nav).
- "Price Alert: [TICKER] crossed [above/below] $[target]. Current price: $[current]."
- Green background for above-threshold alerts, red for below-threshold alerts
- Dismiss (×) button. Auto-dismisses after 10 seconds.
- Multiple alerts can trigger simultaneously — stack banners vertically.

**Polling**
While the Alerts page is mounted, poll quotes for all tickers that have active alerts every 60 seconds. Do not poll on other pages.

---

## 17. Error Handling

### 17.1 API Errors

**OpenRouter**
- Network failure: show inline message in ChatArea below the message list: "Failed to connect. Check your connection and try again." with a "Retry" button that resends the last message.
- Rate limit (429): "Rate limit reached. Wait a moment before sending another message."
- Invalid API key (401): "API key error. Check your OpenRouter configuration."
- Model error (4xx other): show the raw error message from the API response.
- In all error cases: do not save the assistant message, refund any tokens that were deducted.

**Polygon.io**
- Rate limit: show a non-blocking notice on the affected section: "Data temporarily unavailable (rate limit). Retrying in 60 seconds."
- Network failure: show "Failed to load data. Check your connection." with a manual retry button.
- Missing data for a ticker: show "No data available for this ticker" in the relevant section rather than crashing.

### 17.2 Empty and Error States Per Page

Every page and every data section must have three states explicitly designed: Loading, Error, and Empty.

| Section | Loading | Error | Empty |
|---|---|---|---|
| Chat message list | Skeleton bubbles | N/A (no initial load) | Welcome prompt with starter suggestions |
| Conversation list | Skeleton rows | N/A | "No chats yet. Start one above." |
| Market Overview tables | Skeleton rows | "Failed to load" + retry | N/A (gainers/losers always have data if market is open) |
| Screener | Skeleton rows | "Failed to load" + retry | "No stocks match your filters" + reset button |
| Stock Detail chart | Spinner overlay on chart area | "Chart data unavailable" | N/A |
| Stock Detail stats | Skeleton stat cards | Individual "—" for unavailable stats | N/A |
| Watchlist | N/A | "Failed to refresh prices" | "Your watchlist is empty" + browse link |
| Alerts | N/A | "Failed to check prices" | "No alerts set" + add prompt |
| News feed | Skeleton news items | "News unavailable" | "No recent news" |

### 17.3 React Error Boundary

Wrap the entire app in an error boundary. If an unhandled render error occurs anywhere:
- Show a full-screen fallback: "Something went wrong. [Reload the page]"
- Log the error to the console with full stack trace
- Do not show a blank white screen

### 17.4 localStorage Corruption

On startup, wrap all `JSON.parse` calls from localStorage in try/catch. If parsing fails, reset that key to its default value and continue. Never crash on corrupt storage data.

---

## 18. Performance

### 18.1 Chat

- Rolling message window: send only the last 20 messages to the API. Not the full conversation history.
- If a conversation has more than 200 messages, virtualize the message list. Only render messages within the current viewport plus a buffer of 10 above and below.
- Cancel streaming fetch on conversation switch. Do not continue receiving tokens for a conversation the user has navigated away from.
- Debounce conversation title saves — wait 500ms after the user stops typing before writing to localStorage.

### 18.2 Stock Market

- Ticker list: fetch once per session on first visit to any stock page. Cache in a module-level variable. Do not re-fetch on navigation between stock pages.
- Screener filtering: runs client-side on the cached ticker list. Debounce the search input 200ms. All other filters apply immediately on change.
- Screener virtualization: render only visible rows using a virtual scroll implementation. The full dataset may be 10,000+ rows — never render all at once.
- Quote polling: only poll when the page is visible (`document.visibilityState === "visible"`). Pause polling when the tab is backgrounded.
- Chart data: cancel in-flight OHLCV requests when the user changes the time range before the previous request completes (use `AbortController`).
- News: cache news responses for 5 minutes. Do not re-fetch if the cached data is fresh.

### 18.3 General

- Lazy load the stock market section. The `StockApp` component and all its children should be dynamically imported with `React.lazy()` so they are not included in the initial bundle.
- All modal content should be conditionally rendered (not just hidden with CSS) — only mount them when open, unmount when closed.
- Images (company logos, if added later): lazy load with the `loading="lazy"` attribute.

---

## 19. Future Planning

### 19.1 Cloud Data Sync (Firebase Firestore)

Move all localStorage persistence to Firestore. Schema:

```
/users/{uid}/
  profile: UserProfile
  constraints: UserConstraints
  kcd: KCDItem[]
  settings: { theme, language, assistantName, selectedModel }
  tokenBalance: number
  peakBalance: number

/users/{uid}/conversations/{conversationId}
  title: string
  model: string
  createdAt: Timestamp
  updatedAt: Timestamp

/users/{uid}/conversations/{conversationId}/messages/{messageId}
  role: string
  content: string
  timestamp: Timestamp
  model: string

/users/{uid}/questSession
  windowSeed: number
  activeQuestIds: string[]
  completedIds: string[]
  stats: map

/users/{uid}/stock
  watchlist: string[]
  alerts: StockAlert[]
```

Guest-to-authenticated migration: when a guest signs in, offer to import their current localStorage conversations into Firestore.

### 19.2 Real Payments (Stripe)

Replace demo payment UI with Stripe:
- Stripe Elements for the card input (PCI compliance)
- Create a Firebase Cloud Function (or Cloudflare Worker) as a thin backend: accepts payment intent creation requests, returns a client secret
- On successful payment intent confirmation client-side, write token credit to Firestore via another Cloud Function (never trust the client to credit itself)
- Store transaction history in `/users/{uid}/transactions/`

### 19.3 Expanded Model Roster

Add to `constants/models.ts`:
- More free models from OpenRouter (llama, mistral, etc.)
- Premium models: GPT-4o, Claude Sonnet, Gemini Pro — each with appropriate token costs
- Model capability tags: "Great for coding", "Great for writing", "Fast", "Long context"
- Model comparison view in the model selector: show a side-by-side feature table

### 19.4 Conversation Management

- **Export:** render the conversation as clean HTML, then use the browser print API to save as PDF. Or serialize to markdown for download.
- **Search:** a full-text search bar in the conversation list. Searches message content across all conversations. Results show matching excerpts.
- **Pin:** a pin icon on each conversation row. Pinned conversations appear in a separate "Pinned" section at the top of the list regardless of recency.
- **Share:** generate a public read-only URL for a conversation. Requires a backend endpoint or Firebase Hosting Function to store the serialized conversation.
- **Bulk delete:** a "Manage" mode for the conversation list with checkboxes and a "Delete selected" button.
- **Folders / Tags:** organize conversations into user-defined folders or with custom tags.

### 19.5 Expanded Quest System

- **Daily quests:** reset at midnight UTC. 3 daily quests with higher rewards than the 30-minute rotation.
- **Weekly challenges:** one big challenge per week with a large token reward. Example: "Have 5 conversations totaling 100+ messages this week."
- **Achievements:** permanent one-time milestones. Examples:
  - "First Message" — send your first message (reward: 10 tokens)
  - "Century" — send 100 messages total (reward: 50 tokens)
  - "High Roller" — reach a peak balance of 500 tokens
  - "Lucky Drop" — hit a 500× multiplier in Plinko
  - "Dedicated" — log in 7 days in a row
- **Quest history log:** a scrollable list of all previously completed quests with timestamp and reward earned.
- **Streak tracking:** display a "N day streak" counter. Reset to 0 if the user doesn't complete at least one quest in a 24-hour window.

### 19.6 Plinko Enhancements

- **Sound effects:** toggle-able. Satisfying click sounds on peg hits, a distinct sound per slot tier (higher multiplier = more dramatic sound).
- **Animations:** ball trail effect, slot flash animation when ball lands, confetti burst on 500× hit.
- **Daily free drop:** one free 5-ball drop per day that costs no tokens.
- **Special boards:** time-limited variants with different multiplier layouts. Example: "Weekend Board" with higher middle multipliers, "Risky Board" with all multipliers being either 0× or 100×.
- **Session stats panel:** always visible during a Plinko session. Shows: balls dropped, total spent, total won, net gain/loss, biggest single-ball win this session.
- **All-time stats:** stored in localStorage. Total balls ever dropped, total tokens won, biggest single session win.

### 19.7 Personalization Depth

- **Multiple personas:** user can save up to 5 named personas (e.g. "Work Mode", "Casual Mode"). A persona contains all profile fields, constraints, and KCD items. Switch between personas from the sidebar.
- **Per-conversation persona:** when creating a new chat, optionally pick which persona to use for that conversation. Locked in for that conversation — doesn't change if the user switches the global default.
- **Persona import/export:** download your active persona as a JSON file. Upload a JSON file to import a persona. Useful for backing up settings or sharing configurations.

### 19.8 Progressive Web App

- Add `manifest.json` with app name, icons, theme color, background color, display mode (`standalone`)
- Register a service worker that caches the app shell (HTML, CSS, JS bundles) so the app loads instantly on repeat visits
- Offline fallback: when offline, the app loads but shows a full-screen banner explaining network is required. Do not silently fail on API calls.
- Responsive layout for mobile:
  - Sidebar hidden by default, toggled by hamburger button in chat header
  - Sidebar becomes a full-screen overlay on mobile rather than a side panel
  - Touch-friendly targets (min 44×44px tap targets)

### 19.9 Stock Market Enhancements

- **Earnings calendar:** a calendar view of upcoming earnings announcements. Each entry: company name, ticker, date, estimated EPS, estimated revenue. After the announcement: actual vs. expected, beat/miss indicator.
- **Economic calendar:** upcoming macroeconomic events — Fed rate decisions, CPI, PPI, jobs report, GDP. Each entry: event name, date/time, previous value, forecast, actual (after release).
- **Chart comparison mode:** add a second ticker to overlay on the same chart. Normalize both to the same starting value (100) to compare relative performance. Support up to 3 tickers.
- **Analyst consensus:** for each stock on the detail page, show the consensus rating (Strong Buy / Buy / Hold / Sell / Strong Sell), average price target, number of analysts.
- **Options chain viewer:** for a given stock, show available expiry dates. For a selected expiry, show the full chain: calls on the left, puts on the right. Columns: Strike, Last, Bid, Ask, Volume, Open Interest, Implied Volatility, Delta.
- **Portfolio tracker:** a manual holdings tracker (no brokerage integration). User enters: ticker, number of shares, average cost basis. App shows: current value, total cost, total gain/loss ($), total gain/loss (%), today's change in value. Persisted in localStorage.
- **Pre-market / After-hours data:** show extended-hours quote and % change on the detail page header when the market is closed.
- **Heatmap visualization:** a proper market heatmap where each stock is a rectangle sized by market cap and colored by % change. Grouped by sector.

### 19.10 Accessibility

- All interactive elements must be keyboard reachable and operable (Tab, Enter, Space, Escape, Arrow keys)
- All modals must trap focus — Tab and Shift+Tab cycle only within the open modal
- All icon-only buttons must have `aria-label`
- Chat message list: use `role="log"` and `aria-live="polite"` so screen readers announce new messages
- All form inputs must have associated `<label>` elements (not just placeholders)
- Color is never the only indicator of meaning (e.g. gain/loss must also have +/− prefix, not just green/red color)
- Respect `prefers-reduced-motion`: disable Plinko ball animations, canvas physics, and CSS transitions when this preference is set. Show a static result instead.
- High-contrast theme: a third theme option (alongside dark and light) that uses pure white/black with higher-contrast borders

### 19.11 Developer Infrastructure

- **Error reporting:** integrate Sentry for unhandled error tracking. Capture: error type, message, stack trace, user ID (anonymized), current route, browser/OS.
- **Conventional commits:** enforce a commit message format (type: description). Auto-generate changelog entries from commit history using a script.
- **CI:** a GitHub Actions workflow that runs `npm run type-check` and `npm run lint` on every pull request. Block merges that fail.
- **Environment management:** `.env` for shared defaults, `.env.local` for developer overrides. Document all required keys in a `README.md`. No hardcoded keys anywhere.
- **Bundle analysis:** run `vite-bundle-analyzer` periodically to catch unexpected bundle size growth from new dependencies.

---

## 20. Constraints & Limitations

- **No custom backend.** Everything is client-side. This is a deliberate architectural choice for simplicity. Firebase handles auth. Third-party APIs handle all data. This means API keys are exposed in the client bundle — acceptable for a personal project, not for a production multi-user app at scale.
- **localStorage only (until Firestore).** Data does not sync across devices. Clearing browser storage loses everything. No data backup.
- **Polygon.io free tier.** 15-minute delayed data. Rate limited to 5 API calls per minute on the free plan. Real-time data and higher rate limits require a paid Polygon subscription.
- **OpenRouter free model availability.** Free models may have slow response times, high latency, or occasional downtime. This is outside our control.
- **No server-side rate limiting.** All API calls originate from the client. There is no protection against a user (or script) making excessive API calls and exhausting the Polygon rate limit or OpenRouter credits.
- **Streaming requires a CORS-permissive API.** OpenRouter supports this. If we add other LLM providers in the future, they must also support streaming from the browser.
- **Payment processing is not live.** The payment UI exists but no real transactions occur. No tokens are credited from purchases.

---

## 21. Out of Scope

- Native iOS or Android application
- Self-hosted LLM inference (no Ollama, no local models)
- Multi-tenant architecture or team/organization accounts
- Automated content moderation pipeline
- Server-side rendering (Next.js, Remix, etc.)
- Real brokerage integration — no actual stock trading, ever
- Email notifications or SMS-based price alerts
- Social features (following other users, sharing portfolios publicly)
- Algorithmic trading tools or backtesting
- Cryptocurrency data (stocks only)
