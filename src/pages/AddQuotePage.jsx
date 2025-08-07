import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddQuote from "../components/AddQuote";
import routes from "../routes";

// ---- constants ----
const ZEN_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zenquotes`;
const FN_HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
};

const keywordList = [
  "Anxiety","Change","Choice","Confidence","Courage","Death","Dreams","Excellence",
  "Failure","Fairness","Fear","Forgiveness","Freedom","Future","Happiness","Inspiration",
  "Kindness","Leadership","Life","Living","Love","Pain","Past","Success","Time","Today",
  "Truth","Work"
];

const authorList = [
  "A.a. Milne","Abraham Lincoln","Alan Watts","Albert Einstein","Albus Dumbledore","Amelia Earhart",
  "Aristotle","Audrey Hepburn","Buddha","Carl Jung","Confucius","Dalai Lama","Eleanor Roosevelt",
  "Emily Dickinson","Epictetus","Franklin D. Roosevelt","Gandhi","Johann Wolfgang von Goethe",
  "John Lennon","Kahlil Gibran","Lao Tzu","Marcus Aurelius","Maya Angelou","Nelson Mandela",
  "Oscar Wilde","Plato","Rumi","Seneca","Socrates","Stephen Hawking","Sun Tzu","Thich Nhat Hanh",
  "Thomas Edison","Toni Morrison","Walt Whitman","Winston Churchill","Zig Ziglar","Unknown"
];

function AddQuotePage() {
  // ---- Add Quote form state (unchanged) ----
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [tags, setTags] = useState("");
  const [collections, setCollections] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // ---- Search UI state ----
  const [selAuthor, setSelAuthor] = useState("");      // dropdown author
  const [selKeyword, setSelKeyword] = useState("");    // dropdown keyword
  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ---- Modal state ----
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefill, setPrefill] = useState({ text: "", author: "", tags: "" });
  const [addedIds, setAddedIds] = useState(new Set()); // track which results were added

  // fetch user collections (unchanged)
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("collection").select("*").eq("user_id", user.id);
      if (data) setCollections(data);
    })();
  }, []);

  // ---- Add Quote form submit (unchanged) ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quoteText.trim()) return alert("Quote text is required.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("User not found.");

    let collectionId = selectedCollectionId;
    if (!selectedCollectionId && newCollectionName.trim()) {
      const { data: newColl, error: collErr } = await supabase
        .from("collection")
        .insert([{ title: newCollectionName.trim(), user_id: user.id }])
        .select()
        .single();
      if (collErr) return alert("Error adding new collection.");
      collectionId = newColl.id;
    }

    const { data: quote, error: qErr } = await supabase
      .from("quote")
      .insert([{
        text: quoteText,
        author: author || null,
        source: source || null,
        user_id: user.id,
        collection_id: collectionId || null,
        tags: tags || null,
      }])
      .select()
      .single();
    if (qErr) return alert("Failed to add quote.");

    if (isFavorite && quote?.id) {
      const { error: favErr } = await supabase
        .from("favorite")
        .insert([{ user_id: user.id, quote_id: quote.id }]);
      if (favErr) console.error("Favorite failed:", favErr.message);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);

    // reset form
    setQuoteText(""); setAuthor(""); setSource("");
    setSelectedCollectionId(""); setNewCollectionName("");
    setIsFavorite(false); setTags("");
  };

  // ---- Search ----
  const handleSearch = async () => {
    setErr("");
    setResults([]);
    setVisibleCount(10);

    // Require at least one selection
    if (!selAuthor && !selKeyword) {
      setErr("Pick an author, a keyword, or both.");
      return;
    }

    setLoading(true);
    try {
      // Build URL with whichever params are set
      const params = new URLSearchParams();
      if (selAuthor) params.set("author", selAuthor);
      if (selKeyword) params.set("keyword", selKeyword.toLowerCase());

      const res = await fetch(`${ZEN_FN_URL}?${params.toString()}`, { headers: FN_HEADERS });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0 || data.message) {
        setErr("No quotes found.");
        setResults([]);
      } else {
        const mapped = data.map((q, i) => ({
          id: `zen-${q.a}-${i}`,   // stable-ish id
          text: q.q,
          author: q.a || "Unknown",
          tag: selKeyword || "",   // keep the chosen keyword so we can prefill tags
        }));
        setResults(mapped);
      }
    } catch (e) {
      console.error(e);
      setErr("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // open modal prefilled
  const handleAddFromResult = (r) => {
    setPrefill({ text: r.text, author: r.author, tags: r.tag || "" });
    setShowAddModal(true);

    // Optimistic mark as added (if you added the optional onSaved callback, move this to onSaved)
    setAddedIds(prev => new Set(prev).add(r.id));
  };

  // optional: if you added the onSaved callback in AddQuote, use this to mark added after success
  const handleSaved = () => {
    setShowAddModal(false);
  };

  return (
    <div className="d-flex min-vh-100 w-100 overflow-hidden bg-light">
      <Sidebar color="black" routes={routes} />

      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px" }}>
        <Navbar />

        <div className="flex-grow-1 container-fluid py-4 px-4 px-md-5">
          {/* Title */}
          <h2 className="fw-bold text-center mb-4">Add a New Quote</h2>

          {/* ------- Add Quote Form (unchanged layout/logic) ------- */}
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="mb-3">
              <label htmlFor="quoteText" className="form-label">Quote Text *</label>
              <textarea
                className="form-control"
                id="quoteText"
                rows="3"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Source</label>
                <input
                  type="text"
                  className="form-control"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Select Collection</label>
                <select
                  className="form-select"
                  value={selectedCollectionId}
                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                >
                  <option value="">-- None --</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Or Add New Collection</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
              </div>
            </div>

            <div className="row align-items-end mb-3">
              <div className="col-md-9">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div className="col-md-3 d-flex align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isFavorite"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isFavorite">
                    Add to Favorites
                  </label>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">Save Quote</button>
            </div>
          </form>

          {/* Toast (same style as modal’s) */}
          {showToast && (
            <div className="toast-container position-absolute top-50 start-50 translate-middle" style={{ zIndex: 2000 }}>
              <div className="toast align-items-center text-white bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true" style={{ minWidth: "250px" }}>
                <div className="d-flex">
                  <div className="toast-body text-center w-100">Quote added successfully!</div>
                </div>
              </div>
            </div>
          )}

          {/* -------- Search + Add from results -------- */}
          <div className="mt-5">
            <div className="text-center mb-3">
              <hr />
              <h5 className="fw-bold mb-3">or</h5>
              <h4 className="mb-4">Search and Add Quotes</h4>
            </div>

            {/* inline controls */}
            <div className="row g-2 align-items-end mb-3">
              <div className="col-md-5">
                <label className="form-label">Author</label>
                <select className="form-select" value={selAuthor} onChange={(e) => setSelAuthor(e.target.value)}>
                  <option value="">Any author</option>
                  {authorList.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Keyword</label>
                <select className="form-select" value={selKeyword} onChange={(e) => setSelKeyword(e.target.value)}>
                  <option value="">Any keyword</option>
                  {keywordList.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {err && <div className="alert alert-danger">{err}</div>}

            {results.length > 0 && (
              <>
                <ul className="list-group">
                  {results.slice(0, visibleCount).map((r) => (
                    <li key={r.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div style={{ maxWidth: "75%" }}>
                        <blockquote className="blockquote mb-0">
                          <p className="mb-1">“{r.text}”</p>
                          <footer className="blockquote-footer">{r.author}</footer>
                        </blockquote>
                      </div>
                      <div>
                        <button
                          className={`btn ${addedIds.has(r.id) ? "btn-secondary" : "btn-outline-primary"}`}
                          disabled={addedIds.has(r.id)}
                          onClick={() => handleAddFromResult(r)}
                        >
                          {addedIds.has(r.id) ? "Added" : "Add"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {visibleCount < results.length && (
                  <div className="text-center mt-3">
                    <button className="btn btn-outline-secondary" onClick={() => setVisibleCount(v => v + 10)}>
                      See more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* Prefilled AddQuote modal */}
      {showAddModal && (
        <AddQuote
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          initialQuoteText={prefill.text}
          initialAuthor={prefill.author}
          initialTags={prefill.tags}
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}

export default AddQuotePage;
