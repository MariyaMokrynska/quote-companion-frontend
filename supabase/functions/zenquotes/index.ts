export {};                 export {};               
declare const Deno: any;   // <-- quiet "Cannot find name 'Deno'" in VS Code

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("author");
    const keyword = url.searchParams.get("keyword");
    const zenKey = Deno.env.get("ZEN_QUOTES_API_KEY");
    const authorSlug = slug?.trim().toLowerCase().replace(/\s+/g, "-");


    if (!zenKey) {
      return new Response(JSON.stringify({ error: "Missing ZEN_QUOTES_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let apiUrl = "";
    if (keyword) {
      const encoded = encodeURIComponent(keyword.toLowerCase());
      apiUrl = `https://zenquotes.io/api/quotes/${zenKey}&keyword=${encoded}`;
    } else if (slug) {
      apiUrl = `https://zenquotes.io/api/quotes/author/${authorSlug}/${zenKey}`;
    } else {
      return new Response(JSON.stringify({ error: "Missing keyword or author" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const zenRes = await fetch(apiUrl);
    const data = await zenRes.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
});