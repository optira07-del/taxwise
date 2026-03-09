# TaxWise 🌍

**Global VAT / GST / Indirect Tax Calculator SaaS**

Calculate indirect taxes across 40+ countries instantly. Built for businesses and developers.

---

## 🚀 Deploy to Vercel (Free — 10 Minutes)

### Step 1 — Create a GitHub account (if you don't have one)
Go to https://github.com and sign up. It's free.

### Step 2 — Create a new GitHub repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `taxwise`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload your project files
On the new repo page, click **uploading an existing file** and drag in ALL the files from this folder:
```
taxwise/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    └── App.jsx
```
Click **Commit changes**.

### Step 4 — Deploy on Vercel
1. Go to https://vercel.com and sign up with your GitHub account (free)
2. Click **Add New → Project**
3. Select your `taxwise` repository
4. Vercel auto-detects Vite. Click **Deploy**
5. ✅ Done! Your site is live at `taxwise.vercel.app`

### Step 5 — Custom Domain (Optional, ~$10/year)
1. Buy a domain at https://namecheap.com (e.g. `taxwise.io`)
2. In Vercel → your project → **Settings → Domains**
3. Add your domain and follow the DNS instructions

---

## 💻 Run Locally (for development)

```bash
npm install
npm run dev
```
Open http://localhost:5173

---

## 📁 Project Structure

```
src/
└── App.jsx        ← Main app (calculator, compare, pricing, API docs)
```

---

## 🗺️ What's Next

- [ ] Step 2: User accounts & API keys (Supabase)
- [ ] Step 3: Stripe payment integration
- [ ] Step 4: Real API backend (Vercel serverless functions)
- [ ] Step 5: User dashboard with usage tracking

---

Built with React + Vite. Hosted free on Vercel.
