import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import routes from "../routes";

// Fetch quotes from ZenQuotes
const fetchQuotesByKeywords = async (keywords = []) => {
  const key = import.meta.env.VITE_ZEN_QUOTES_API_KEY;
  const results = [];

  for (const keyword of keywords) {
    const encoded = encodeURIComponent(keyword.toLowerCase());
    try {
      const response = await fetch(
        `https://zenquotes.io/api/quotes/${key}&keyword=${encoded}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        results.push(...data);
      }
    } catch (error) {
      console.error(`Error fetching quote for "${keyword}"`, error);
    }
  }

  return results.slice(0, 3); // up to 3 quotes
};

const MoodMirror = () => {
  const [reflection, setReflection] = useState("");
  const [labels, setLabels] = useState([]);
  const [quoteOptions, setQuoteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const navigate = useNavigate();

  const handleReflect = async () => {
  console.log("Anon Key from Vite:", import.meta.env.VITE_SUPABASE_KEY); // Debug line

  setError("");
  setLoading(true);
  setQuoteOptions([]);
  setLabels([]);

  try {
    const response = await fetch("https://zgpibmkkqcflsxodryol.functions.supabase.co/mood-mirror", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`, // Moved into headers ✅
      },
      body: JSON.stringify({ text: reflection }),
    });

      const responseText = await response.text();
      console.log("Function response text:", responseText);

      if (!response.ok) {
        setError(`Mood Mirror Error: ${responseText}`);
        return;
      }

      const result = JSON.parse(responseText);
      setLabels(result.labels);

      const quoteResults = await fetchQuotesByKeywords(result.labels);
      setQuoteOptions(quoteResults);

      setLabels(result.labels);

      setQuoteOptions(quoteResults);
    } catch (err) {
      console.error("Mood Mirror Error:", err);
      setError("Something went wrong while processing your mood.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar color="dark" routes={routes} />

      {/* Page Content Wrapper */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", minHeight: "100vh" }}
      >
        <Navbar />

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <h2 className="text-center fw-bold">Mood Mirror</h2>
          <p className="text-center">Let words guide you</p>

          {/* Reflection input */}
          <div className="mb-4 mt-5">
            <label htmlFor="moodInput" className="form-label">
              How are you feeling today?
            </label>
            <textarea
              className="form-control"
              id="moodInput"
              placeholder="Describe your mood, experience or current thoughts ..."
              rows="3"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            ></textarea>
          </div>

          <div className="text-center mb-5">
            <button
              className="btn btn-primary"
              onClick={handleReflect}
              disabled={loading || !reflection.trim()}
            >
              {loading ? "Reflecting..." : "Reflect"}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {/* Suggested Quote */}
          {quoteOptions.length > 0 && (
            <div className="p-4 bg-light rounded border text-center">
              {labels.length > 0 && (
                <div className="mb-3">
                  {labels.map((label, i) => (
                    <span key={i} className="badge bg-secondary mx-1">
                      {label}
                    </span>
                  ))}
                </div>
              )}
              <p className="fs-5 fst-italic">“{quoteOptions[0].q}”</p>
              <p className="text-muted text-center">
                {quoteOptions[0].a || "Unknown"}
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button className="btn btn-outline-primary">
                  Save Reflection
                </button>
                <button className="btn btn-outline-success">
                  Add to My Quotes
                </button>
                <button className="btn btn-outline-secondary" onClick={() => {
                  setQuoteOptions([]);
                  setLabels([]);
                  setReflection("");
                }}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <a href="#" className="fw-bold">
              Go to my Past Reflections &gt;
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MoodMirror;