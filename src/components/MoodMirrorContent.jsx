// src/pages/MoodMirrorContent.jsx
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import AddQuote from "../components/AddQuote";

// Fetch quotes from ZenQuotes (by keywords)
async function fetchQuotesByKeywords(keywords = []) {
  const key = import.meta.env.VITE_ZEN_QUOTES_API_KEY;
  const results = [];
  for (const keyword of keywords) {
    const encoded = encodeURIComponent(keyword.toLowerCase());
    try {
      const res = await fetch(`https://zenquotes.io/api/quotes/${key}&keyword=${encoded}`);
      const data = await res.json();
      if (Array.isArray(data)) results.push(...data);
    } catch (err) {
      console.error(`Error fetching quote for "${keyword}"`, err);
    }
  }
  return results.slice(0, 3); // up to 3 quotes
}

export default function MoodMirrorContent({ isAuthed, onRequireAuth = () => {} }) {
  const [reflection, setReflection] = useState("");
  const [labels, setLabels] = useState([]);
  const [quoteOptions, setQuoteOptions] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [showReflectionToast, setShowReflectionToast] = useState(false);

  const handleReflect = async () => {
    setError("");
    setLoading(true);
    setQuoteOptions([]);
    setLabels([]);

    try {
      const response = await fetch(
        "https://zgpibmkkqcflsxodryol.functions.supabase.co/mood-mirror",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          },
          body: JSON.stringify({ text: reflection }),
        }
      );

      const responseText = await response.text();
      if (!response.ok) {
        setError(`Mood Mirror Error: ${responseText}`);
        return;
      }

      const { labels: lbls = [] } = JSON.parse(responseText);
      setLabels(lbls);

      const quoteResults = await fetchQuotesByKeywords(lbls);
      setQuoteOptions(quoteResults);
      setQuoteIndex(0);
    } catch (err) {
      console.error("Mood Mirror Error:", err);
      setError("Something went wrong while processing your mood.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReflection("");
    setLabels([]);
    setQuoteOptions([]);
    setError("");
  };

  const handleSaveReflection = async () => {
    if (!isAuthed) return onRequireAuth("save-reflection");
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found:", userError);
        alert("User not found.");
        return;
      }

      const primaryQuote = quoteOptions[0] || {};
      const { error: insertError } = await supabase
        .from("reflection")
        .insert([
          {
            user_id: user.id,
            text: reflection,
            mood_labels: labels.join(", "),
            quote_id: null,
            quote_text: primaryQuote.q || "",
            quote_author: primaryQuote.a || "",
            collection_id: null,
            tags: labels.join(", "),
            confidence: null,
          },
        ]);

      if (insertError) {
        console.error("Error saving reflection:", insertError.message);
        alert("Failed to save reflection.");
        return;
      }

      setShowReflectionToast(true);
      setTimeout(() => setShowReflectionToast(false), 3000);

      setReflection("");
      setLabels([]);
      setQuoteOptions([]);
    } catch (err) {
      console.error("Unexpected error saving reflection:", err);
      alert("Something went wrong.");
    }
  };

  const canSave = isAuthed && reflection.trim() && quoteOptions.length > 0;

  return (
    <>
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
          />
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

            <p className="fs-5 fst-italic">“{quoteOptions[quoteIndex].q}”</p>
            <p className="text-muted text-center">
              {quoteOptions[quoteIndex].a || "Unknown"}
            </p>

            <div className="d-flex justify-content-center gap-3 mt-3">
              {/* <button
                className="btn btn-outline-primary"
                onClick={isAuthed ? handleSaveReflection : () => onRequireAuth("save-reflection")}
                disabled={!canSave}
                title={isAuthed ? "" : "Sign up to save reflections"}
              >
                Save Reflection
              </button> */}

              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  if (!isAuthed) {
                    if (onRequireAuth) onRequireAuth();
                  } else {
                    handleSaveReflection();
                  }
                }}
                disabled={!reflection.trim() || quoteOptions.length === 0}
              >
                Save Reflection
              </button>




              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => {
                  if (!isAuthed) return onRequireAuth("add-quote");
                  if (!quoteOptions || !quoteOptions.length) return;
                  setSelectedQuote(quoteOptions[0]);
                  setShowAddQuoteModal(true);
                }}
                title={isAuthed ? "" : "Sign up to add quotes"}
              >
                Add to My Quotes
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setQuoteIndex((prevIndex) => (prevIndex + 1) % quoteOptions.length)
                }
              >
                Try Again
              </button>

              <button className="btn btn-outline-danger" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Toast (fixed so it works in any layout) */}
        {showReflectionToast && (
          <div
            className="toast-container position-fixed top-50 start-50 translate-middle"
            style={{ zIndex: 2000 }}
          >
            <div
              className="toast align-items-center text-white bg-success border-0 show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{ minWidth: "250px" }}
            >
              <div className="d-flex">
                <div className="toast-body text-center w-100">
                  Reflection saved successfully!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Quote Modal */}
      {showAddQuoteModal && (
        <AddQuote
          show={showAddQuoteModal}
          onClose={() => setShowAddQuoteModal(false)}
          initialQuoteText={selectedQuote?.q || selectedQuote?.text || ""}
          initialAuthor={selectedQuote?.a || selectedQuote?.author || "Unknown"}
          initialTags={Array.isArray(labels) ? labels.join(", ") : ""}
        />
      )}
    </>
  );
}
