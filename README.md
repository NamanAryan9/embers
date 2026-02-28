# 🕯️ Embers

> *Give your memories a place to live.*

**Embers** is a grief memorial web app that lets you have one last conversation with someone you've lost — and receive a final letter written in their voice.

Built for the Microsoft Agents League 2026 — Creative Apps Track using GitHub Copilot + GitHub Models API (GPT-4o).

---

## 💡 What It Does

Most grief apps offer journaling or meditation. Embers does something different — it gives your memories a voice.

You share who you lost and what you remember about them. Embers uses AI to bring those memories to life in a tender, finite conversation — just 10 exchanges. Then they write you a letter. And they're gone.

It's not a chatbot. It's a memory keeper.

---

## ✨ Features

- **Memory Journal** — Write down who you're remembering and what made them them
- **One Last Conversation** — 10 exchanges with an AI that speaks in their voice, drawn from your memories
- **The Final Letter** — A handwritten-style farewell letter generated from your memories, revealed word by word
- **Complete Privacy** — Everything stays on your device. Nothing is stored on any server.
- **Atmospheric Design** — Candlelit UI, aged parchment, ambient sound, Cormorant Garamond typography

---

## 🎬 Live

https://namanaryan9.github.io/embers/

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Framer Motion | Emotional page transitions |
| React Router DOM | Screen navigation |
| GitHub Models API | AI conversation + letter generation |
| GitHub Copilot | AI-assisted development |
| CSS + Google Fonts | Atmospheric visual design |
| Web Audio API | Ambient sound + sound effects |
| localStorage | Private on-device memory storage |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A GitHub Personal Access Token (no scopes required)

### Setup

```bash
# Clone the repository
git clone https://github.com/NamanAryan9/embers
cd embers

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your GitHub token to .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_GITHUB_TOKEN=your_github_token_here
```

Get your token at: github.com/settings/tokens
(No scopes needed — just generate and paste)

---

## 🎮 How to Use

1. Click **Begin** on the welcome screen
2. Write about the person you're remembering — their name, your relationship, things they used to say or do
3. Have a conversation — you have 10 exchanges
4. Read their final letter
5. Keep the memory

---

## 🔒 Privacy & Security

- **No backend** — zero data leaves your device
- **No accounts** — no sign up required
- **localStorage only** — memories stay in your browser
- **API token** — stored in `.env`, never committed to git
- **Open source** — read every line of code

---

## 💭 Why I Built This

Grief is universal. But most technology treats it like a problem to solve — with productivity tools, meditation timers, or journaling apps.

Embers doesn't try to fix grief. It just gives you one more moment.

The specific details matter most — not "she was kind" but "she called every Sunday at 7 PM and always opened with the wrong name." Embers is built around those details. The AI doesn't generate a generic response — it responds to *your* memories specifically.

Some things never leave us.

---

## 📁 Project Structure

```
embers/
├── src/
│   ├── screens/
│   │   ├── Welcome.jsx       # Landing screen
│   │   ├── Memory.jsx        # Memory input journal
│   │   ├── Conversation.jsx  # AI conversation
│   │   └── Letter.jsx        # Final letter reveal
│   ├── utils/
│   │   ├── ai.js             # GitHub Models API
│   │   └── audio.js          # Ambient sound system
│   └── styles/
│       └── global.css        # Design tokens + grain
├── public/
│   └── ambient.mp3           # Background music
├── .env.example              # Token template
└── README.md
```

---

## 🏆 Agents League Submission

- **Track:** Creative Apps
- **Tool:** GitHub Copilot
- **Challenge:** Build innovative creative applications using AI-assisted development

---

*Built with care. For everyone who has someone to remember.*
