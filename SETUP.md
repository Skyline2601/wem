# Wem App — Setup Guide
## Get the app running on your phone in 5 minutes

---

### What you need first
- A laptop or desktop computer (Mac, Windows, or Linux)
- Node.js installed — download at https://nodejs.org (choose "LTS" version)
- Your phone (iPhone or Android)
- The **Expo Go** app installed on your phone — free from App Store or Google Play

---

### Step 1 — Get the project files

Copy the `wem` folder to your computer. Open it — you should see folders like `app`, `components`, `constants`, etc.

---

### Step 2 — Add your Anthropic API key

1. In the `wem` folder, create a new file called `.env`
2. Add this line inside it (replace with your actual key from console.anthropic.com):
```
EXPO_PUBLIC_ANTHROPIC_KEY=sk-ant-YOUR-KEY-HERE
```
3. Save the file. Keep this file private — never share it or upload it to GitHub.

---

### Step 3 — Run the two commands

Open Terminal (Mac) or Command Prompt (Windows). Navigate to the `wem` folder:

```bash
cd path/to/wem
```

Then run these two commands, one at a time:

```bash
npm install
```
(This downloads all the code dependencies — takes 1-2 minutes, shows a lot of text, that's normal)

```bash
npx expo start
```
(This starts the app — a QR code appears on screen)

---

### Step 4 — Open on your phone

**iPhone:** Open the Camera app, point it at the QR code, tap the yellow banner that appears.

**Android:** Open the Expo Go app, tap "Scan QR code", point at the QR code.

The Wem app loads on your phone. That's it.

---

### Step 5 — For a web browser link (for Zoom calls / Anthology demo)

Instead of `npx expo start`, run:

```bash
npx expo start --web
```

This opens the app in your browser at `http://localhost:8081`. To share it publicly, deploy to Vercel (see VERCEL_DEPLOY.md).

---

### Troubleshooting

**"Command not found: npm"** → Node.js isn't installed. Go to nodejs.org and install it first.

**"Module not found" errors** → Run `npm install` again.

**App shows a blank screen** → Check your `.env` file has the Anthropic API key. Check you named the file exactly `.env` (with the dot).

**QR code doesn't scan** → Make sure your phone and computer are on the same WiFi network.

---

### File structure

```
wem/
├── app/                    # All screens
│   ├── index.tsx          # Entry — rider/driver selector
│   ├── rider/
│   │   ├── home.tsx       # Rider home screen
│   │   ├── claude.tsx     # Claude AI booking (real API calls)
│   │   ├── classic.tsx    # Classic destination picker
│   │   ├── active.tsx     # Active ride screen
│   │   └── ...
│   └── driver/
│       ├── home.tsx       # Driver home screen
│       ├── request.tsx    # Ride request screen
│       └── ...
├── components/
│   └── shared/            # Reusable components
├── constants/
│   └── index.ts           # Colors, fares, demo data
├── hooks/
│   └── useClaudeService.ts # All Claude API calls
├── .env                   # Your API keys (create this yourself)
└── package.json
```

---

*Wem · WEM Concept & Design LLC · 2026*
