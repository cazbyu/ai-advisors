# AI Boardroom — Setup Guide (Fresh Supabase Project)

All the code is already written and in your project folder. This guide walks you through setting up a brand-new Supabase project and connecting everything.

---

## Step 1: Create a New Supabase Project (5 minutes)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in (or create a free account)
3. Click the **New Project** button
4. Fill in:
   - **Name:** AI Boardroom (or whatever you like)
   - **Database Password:** Pick something strong and save it somewhere — you'll need it later
   - **Region:** Choose the one closest to you
5. Click **Create new project**
6. Wait about 2 minutes while it sets up — you'll see a spinner

Once it's ready, you'll land on the project home page. Keep this tab open — you'll need it for the next steps.

---

## Step 2: Get Your Supabase Connection Details (2 minutes)

You need two values to connect your app to Supabase.

1. On your project home page, look for the **Project URL** and **API Key** section
   - If you don't see them, go to **Settings** (gear icon in sidebar) → **API**
2. Copy these two values:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`
   - **anon public key** — a long string starting with `eyJ...`

Now create a file called `.env` in the root of your project folder (same level as `package.json`) with this content:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_URL_HERE.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Replace the placeholder values with the ones you just copied. No quotes needed.

---

## Step 3: Create All Database Tables (3 minutes)

This creates everything your app needs in a private `boardroom` schema — separate from any other tables in your project.

1. In your Supabase Dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query** (top-right area)
3. Open the file from your project folder:
   **`supabase/migrations/00000000000000_complete_setup.sql`**
4. Select ALL the text in that file (Ctrl+A or Cmd+A) and copy it
5. Paste it into the SQL Editor in your Supabase Dashboard
6. Click the green **Run** button (or press Ctrl+Enter)
7. You should see **"Success. No rows returned"** — that means it worked

To verify: Click **Table Editor** in the left sidebar. In the schema dropdown at the top, switch from "public" to **"boardroom"**. You should see 6 tables:
- advisors (with 8 rows of data already loaded)
- sessions
- conversations
- meetings
- messages
- user_profiles

---

## Step 4: Expose the Boardroom Schema to the API (2 minutes)

By default, Supabase only lets your app access the `public` schema. Since your tables are in a private `boardroom` schema, you need to tell Supabase to expose it.

1. In the left sidebar, click **Settings** (gear icon)
2. Click **API** (under Configuration)
3. Scroll down to **Exposed schemas**
4. You'll see `public` listed. Click the field and **add `boardroom`** to the list
5. Click **Save**

This makes the boardroom tables accessible to your app through the Supabase API, while keeping them separate from any other tables in your project.

---

## Step 5: Enable Email Authentication (2 minutes)

Your app needs users to sign in so their company profiles and session history are saved.

1. In the left sidebar, click **Authentication**
2. Click **Providers** (or **Configuration** → **Providers**)
3. Make sure **Email** is enabled (it usually is by default)
4. That's it — Supabase handles the rest

---

## Step 6: Get an Anthropic API Key (5 minutes)

This is what powers the AI advisors (Claude).

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create an account if you don't have one (or sign in)
3. In the left sidebar, click **API Keys**
4. Click **Create Key**
5. Name it something like "AI Boardroom"
6. Copy the key — it starts with `sk-ant-...`
7. **Save this key somewhere safe.** You can't see it again after you leave the page.

**Cost note:** Each boardroom question costs roughly $0.05–$0.15 in API credits depending on how many advisors participate. Anthropic typically provides some free credits for new accounts.

---

## Step 7: Add the Anthropic Key to Supabase (3 minutes)

This stores your API key securely on the server.

1. Go back to your **Supabase Dashboard**
2. In the left sidebar, click **Edge Functions**
   - If you don't see it, go to **Project Settings** → **Edge Functions**
3. Look for a **Secrets** section or button — click it
4. Click **Add New Secret** (or **Add secret**)
5. **Name:** `ANTHROPIC_API_KEY`
6. **Value:** paste the `sk-ant-...` key from Step 6
7. Click **Save**

---

## Step 8: Deploy the Edge Function (5 minutes)

This puts the "brain" of the boardroom on Supabase's servers.

### Option A: Through the Supabase Dashboard (easiest — no command line)

1. In your Supabase Dashboard, click **Edge Functions** in the left sidebar
2. Click **Create a new function** (or **Deploy a new function**)
3. Name it exactly: `boardroom-discuss`
4. Open the file from your project folder:
   **`supabase/functions/boardroom-discuss/index.ts`**
5. Copy ALL the contents of that file
6. Paste it into the code editor in the dashboard, replacing any default code
7. Click **Deploy**

### Option B: Using the Supabase CLI (if you're comfortable with a terminal)

Open a terminal in your project folder and run:

```bash
# Install the CLI (one time only)
npm install -g supabase

# Log in to your Supabase account
supabase login

# Link to your project (use your project ID from the URL)
# If your URL is https://abcdefghijk.supabase.co, the ID is: abcdefghijk
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the function
supabase functions deploy boardroom-discuss
```

---

## Step 9: Run the App (2 minutes)

1. Open a terminal/command prompt in your project folder
2. Install dependencies (first time only):
   ```
   npm install
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open the URL it shows you (usually **http://localhost:5173**)

---

## Step 10: Test Everything

1. Click **Sign In** in the top-right corner
2. Create an account with your email and a password
3. Go to the **Profile** tab and fill in your company details, then click **Save Profile**
4. Go to the **Boardroom** tab (home page)
5. Make sure some advisor chips are selected (blue)
6. Type a question like: *"Should we expand into East Africa this year or focus on strengthening existing markets?"*
7. Click **Ask the Board**
8. Watch the advisors respond, then challenge each other
9. Click a suggested follow-up question to keep the conversation going

---

## Troubleshooting

**"Anthropic API key not configured"**
→ Go to Step 7 and make sure the secret name is exactly `ANTHROPIC_API_KEY` (all caps, with underscores)

**"Failed to fetch" or network errors**
→ Check your `.env` file has the correct URL and key from Step 2. Make sure there are no extra spaces or quotes.

**Tables not found or empty results**
→ Make sure you completed Step 4 (exposing the `boardroom` schema). In Settings → API → Exposed schemas, you should see both `public` and `boardroom` listed.

**App loads but sign-in doesn't work**
→ Check that Email auth is enabled (Step 5). Also check that your `.env` values match what's in your Supabase dashboard.

**Advisors return generic or error responses**
→ Check your Anthropic account has API credits: [https://console.anthropic.com/settings/billing](https://console.anthropic.com/settings/billing)

**Profile won't save**
→ Make sure you ran the SQL in Step 3 successfully. Check Table Editor → switch schema to "boardroom" → confirm `user_profiles` table exists.

**Edge function errors**
→ In Supabase Dashboard → Edge Functions → click on `boardroom-discuss` → check the **Logs** tab for error details.

---

## Quick Reference: What's in Each File

| File | What it does |
|------|-------------|
| `supabase/migrations/00000000000000_complete_setup.sql` | **The SQL you paste into Supabase** — creates all tables in private schema |
| `supabase/functions/boardroom-discuss/index.ts` | **The AI engine** — paste into Edge Functions |
| `.env` | **You create this** — holds your Supabase URL and key |
| `src/supabase.ts` | Supabase client config (points to `boardroom` schema) |
| `src/pages/BoardroomSession.tsx` | The main boardroom page where you ask questions |
| `src/pages/History.tsx` | Browse past boardroom sessions |
| `src/pages/Profile.tsx` | Company profile form |
| `src/data/advisorPrompts.ts` | Personality and expertise for each advisor |
| `src/store.ts` | App state management |
| `src/types.ts` | Data type definitions |
| `src/App.tsx` | Route definitions |
| `src/components/Layout.tsx` | Navigation bar |
