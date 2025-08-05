// // Deno Edge Function - no npm install needed

// // CORS helpers
// const cors = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// // @ts-ignore
// Deno.serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: cors });
//   }

//   try {
//     const { text } = await req.json();
//     if (!text || typeof text !== "string") {
//       return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json", ...cors },
//       });
//     }

//     // @ts-ignore - removes VS Code red underlining and Problem
//     const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
//     if (!OPENAI_API_KEY) {
//       return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json", ...cors },
//       });
//     }

//     // Ask for strict JSON so we don't need to regex/guess
//     const prompt = `
//     You are a mood labeling assistant. Based on the user's reflection, return 1–3 relevant mood or theme **keywords**.

//     ⚠️ Only choose from the following list:
//     Anxiety, Change, Choice, Confidence, Courage, Death, Dreams, Excellence, Failure, Fairness, Fear, Forgiveness, Freedom, Future, Happiness, Inspiration, Kindness, Leadership, Life, Living, Love, Pain, Past, Success, Time, Today, Truth, Work

//     Return ONLY a JSON object in this format:
//     {"labels":["keyword1","keyword2","keyword3"]}

//     User's Reflection:
//     """${text}"""
//     `;

//     const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You must return valid JSON only." },
//           { role: "user", content: prompt },
//         ],
//         temperature: 0.2,
//         // Ask the API to enforce JSON output:
//         response_format: { type: "json_object" },
//       }),
//     });

//     if (!oaRes.ok) {
//       const t = await oaRes.text();
//       return new Response(JSON.stringify({ error: "OpenAI error", detail: t }), {
//         status: 500,
//         headers: { "Content-Type": "application/json", ...cors },
//       });
//     }

//     const json = await oaRes.json();
//     const content = json?.choices?.[0]?.message?.content ?? "{}";
//     let labels: string[] = [];

//     try {
//       const parsed = JSON.parse(content);
//       if (Array.isArray(parsed.labels)) labels = parsed.labels;
//     } catch {
//       // Should be rare with response_format enforced
//     }

//     return new Response(JSON.stringify({ labels }), {
//       headers: { "Content-Type": "application/json", ...cors },
//     });
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: "Server error", detail: String(err) }),
//       { status: 500, headers: { "Content-Type": "application/json", ...cors } },
//     );
//   }
// });

// Deno Edge Function - no npm install needed

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // @ts-ignore
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const allowedKeywords = [
      "Anxiety", "Change", "Choice", "Confidence", "Courage", "Death", "Dreams", "Excellence",
      "Failure", "Fairness", "Fear", "Forgiveness", "Freedom", "Future", "Happiness", "Inspiration",
      "Kindness", "Leadership", "Life", "Living", "Love", "Pain", "Past", "Success", "Time",
      "Today", "Truth", "Work"
    ];

    // 🔧 Rewritten prompt for stricter guidance
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant. Given a user's mood reflection, you will return a JSON object with a "labels" array containing 1–3 keywords that best describe the mood or themes.\n\n⚠️ IMPORTANT: You may only use labels from this approved list:\n${allowedKeywords.join(", ")}\n\nYou must return valid JSON in this format: {"labels":["keyword1","keyword2"]}\nNEVER include keywords not in the list.`,
      },
      {
        role: "user",
        content: `Reflection:\n"""${text}"""`,
      },
    ];

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-4o-mini" if you prefer
        messages,
        temperature: 0.2,
        response_format: "json", // ✅ Corrected (you had invalid format before)
      }),
    });

    if (!oaRes.ok) {
      const t = await oaRes.text();
      return new Response(JSON.stringify({ error: "OpenAI error", detail: t }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const json = await oaRes.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    let labels: string[] = [];

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.labels)) {
        // ✅ Enforce allowed keyword filtering
        labels = parsed.labels.filter((label: string) =>
          allowedKeywords.includes(label)
        );
      }
    } catch {
      // fallback ignored
    }

    return new Response(JSON.stringify({ labels }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } },
    );
  }
});
