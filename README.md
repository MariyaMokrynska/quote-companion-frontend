# Quote Companion Front-End

Here’s the full README.md in clean markdown so you can copy and paste it directly:

markdown
Copy
Edit
# Quote Companion

Quote Companion is a full-stack web application for discovering, organizing, and saving meaningful quotes.  
Users can search quotes by keyword or author, organize them into collections, favorite them, and even receive **AI-powered Mood Mirror** suggestions tailored to their mood or life situation.

Built as a **capstone project** by [Jane K.](#authors) and [Mariya M.](#authors) at **Ada Developers Academy**, the app showcases our skills as **full-stack developers**.

---

## 🚀 Features

- **Search & Discover** – Find quotes instantly by keyword or author
- **Save & Organize** – Create personal collections, mark favorites, edit or delete quotes
- **Mood Mirror AI** – Get AI-powered suggestions that match your input mood or situation
- **Manual Add** – Save quotes from books, articles, or conversations
- **Clean UI** – Distraction-free reading experience with responsive design

---

## 🛠 Tech Stack
**Frontend:** React, Bootstrap  
**Backend:** Supabase (Auth, Postgres, Storage) + Supabase Edge Functions (Deno)  
**AI Integration:** OpenAI API via Supabase Edge Functions  
**External API:** [ZenQuotes API](https://zenquotes.io/) (paid plan for keyword & author search)  
**Hosting & Deployment:** Render (frontend), Supabase (DB/Auth/Functions)  
**Version Control & Collaboration:** Git, GitHub  
**Other Tools:** Postman for API testing, VS Code for development
---

## Getting Started

Follow these steps to run Quote Companion locally.

1. Clone the Repository

`git clone https://github.com/MariyaMokrynska/quote-companion-frontend`
cd quote-companion-frontend
2. Install Dependencies
Ensure you have Node.js (>= 18) and npm installed.

`npm install`
`
3. Create Environment Variables
In the root folder, create a .env.local file:

VITE_SUPABASE_KEY=your-supabase-anon-key
VITE_SUPABASE_URL=your-supabase-project-url`

VITE_ZEN_QUOTES_API_KEY=-zenquotes-paid-plan-api-key

⚠ Never commit your .env.local file.

## Supabase Setup
Create a Supabase project at https://supabase.com/

Enable Authentication

Go to Authentication → Settings and configure email sign-up/sign-in

Set Up Database Tables

Create the following tables in the Supabase (simplified schema):

- table user:
  id uuid primary key default uuid_generate_v4(),
  email text unique

- table quote:
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  author text,
  created_at timestamp default now(),
  user_id uuid references "user"(id)

- table collection:
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  user_id uuid references "user"(id)

- table favorite:
  created_at timestamp default now(),
  user_id uuid references "user"(id),
  quote_id uuid references quote(id),

- table reflection:
  id uuid primary key default uuid_generate_v4(),
  mood_text text,
  mood_labels text[],
  quote_id uuid references quote(id),
  user_id uuid references "user"(id)

- table quote_tag:
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid references quote(id),
  tag text

Enable Row-Level Security (RLS) for each table and create policies to allow:

Read access for public quotes

Full CRUD access for authenticated users to their own data

## ZenQuotes API Integration

We use the paid ZenQuotes API to allow keyword & author search, which is not included in the free tier.

Example fetch call:

const response = await fetch(`${import.meta.env.VITE_ZENQUOTES_API_URL}/search/${authorOrKeyword}?key=${import.meta.env.VITE_ZENQUOTES_API_KEY}`);
const quotes = await response.json();
You will need to sign up for a ZenQuotes Pro membership and use your API key in .env.local.

## OpenAI API Integration (via Supabase Edge Function)
Used in the Mood Mirror feature to analyze mood input and return matching quotes.
We use **Supabase Edge Functions** to call the OpenAI API **server-side**, keeping the API key secure.  
The **Mood Mirror** feature extracts mood labels from user input and uses them to fetch matching quotes from **ZenQuotes**.

### Flow

**Client (`MoodMirror.jsx`)** → **Supabase Edge Function (`mood-mirror`)**

- The Edge Function:
  1. Receives the user’s reflection text
  2. Sends it to OpenAI to extract 1–3 `labels`
  3. Returns JSON labels to the frontend
  4. The frontend uses the best label(s) to fetch quotes from ZenQuotes

This approach:
- Keeps API keys **server-side** (never exposed in the browser)
- Avoids CORS issues
- Allows easy future improvements

---
## 1. One-time Setup

### 1.1 Get an OpenAI API Key

1. Sign in to [OpenAI](https://platform.openai.com/), create an API key, and **store it securely**.  
2. We’ll store it in **Supabase Secrets** so it’s only accessible server-side.
---

### 1.2 Install Supabase CLI

You need the **Supabase CLI** to create and deploy functions.
```
brew install supabase/tap/supabase
supabase --version
1.3 Log in and Link Your Project

supabase login
Create an Access Token in your Supabase account (Account → Access Tokens)

Paste it into the terminal prompt

Find your project ref in the URL: https://<project-ref>.supabase.co

Link your project:
`supabase link --project-ref <your-project-ref>`

2️⃣ Create the mood-mirror Edge Function
2.1 Initialize Functions Locally
`supabase functions init`
2.2 Create the Function
`supabase functions new mood-mirror`
2.3 Store the OpenAI API Key in Supabase Secrets
`supabase secrets set OPENAI_API_KEY=sk-your-openai-key`
Keys stored in Supabase Secrets are encrypted and only available to your Edge Functions at runtime.

2.4 Add the Function Code
File: supabase/functions/mood-mirror/index.ts

```
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { text } = await req.json();
    if (!text) return new Response(JSON.stringify({ error: "Missing text" }), { status: 400, headers: cors });

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500, headers: cors });

    const prompt = `
    You are a mood labeling assistant. Based on the user's reflection, return 1–3 relevant mood keywords from this list:
    Anxiety, Change, Choice, Confidence, Courage, Death, Dreams, Excellence, Failure, Fairness, Fear, Forgiveness, Freedom, Future, Happiness, Inspiration, Kindness, Leadership, Life, Living, Love, Pain, Past, Success, Time, Today, Truth, Work.
    Only return JSON: {"labels":["keyword1","keyword2","keyword3"]}
    User's Reflection: """${text}"""
    `;

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You must return valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    const json = await oaRes.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    let labels = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.labels)) labels = parsed.labels;
    } catch {}

    return new Response(JSON.stringify({ labels }), { headers: { "Content-Type": "application/json", ...cors } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", detail: String(err) }), { status: 500, headers: cors });
  }
});
```
2.5 Deploy the Function

`supabase functions deploy mood-mirror`
Your function will be live at:

https://<PROJECT_REF>.functions.supabase.co/mood-mirror
3️⃣ Call the Function from React
Example (MoodMirror.jsx):

```
async function handleReflect() {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mood-mirror`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ text: userReflection }),
  });

  const data = await res.json();
  console.log("Labels:", data.labels);
}
```

▶ Running the App Locally

npm run dev
Visit: http://localhost:5173

🌍 Deployment
Frontend: Deploy to Render as a static site

Supabase: Already cloud-hosted; ensure production DB URL and keys are in Render environment variables

👥 Authors
Jane K. – Full-stack developer, AI & integration logic

Mariya M. – Full-stack developer, UI design & core functionality

📜 License
MIT License

Deployed app: https://quote-companion-frontend.onrender.com/
