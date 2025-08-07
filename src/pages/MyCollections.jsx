import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../services/supabaseClient";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";

function MyCollections() {
  const [collections, setCollections] = useState([]);        // [{id,title}]
  const [quoteCounts, setQuoteCounts] = useState({});        // { [collection_id]: number }
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Case-insensitive set for dup checks
  const existingTitlesCI = useMemo(
    () => new Set(collections.map(c => c.title.trim().toLowerCase())),
    [collections]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1) Get current user
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();
        if (userErr || !user) {
          setError("Not authenticated.");
          return;
        }

        // 2) Fetch user collections
        const { data: colls, error: collErr } = await supabase
          .from("collection")
          .select("id,title")
          .eq("user_id", user.id)
          .order("title", { ascending: true });

        if (collErr) throw collErr;
        setCollections(colls || []);

        // 3) Fetch all user's quotes' collection_ids (single query),
        //    then reduce counts per collection_id on the client.
        const { data: quotes, error: qErr } = await supabase
          .from("quote")
          .select("collection_id")
          .eq("user_id", user.id);

        if (qErr) throw qErr;

        const counts = {};
        (quotes || []).forEach((q) => {
          if (!q.collection_id) return; // skip unassigned
          counts[q.collection_id] = (counts[q.collection_id] || 0) + 1;
        });
        setQuoteCounts(counts);
      } catch (e) {
        console.error(e);
        setError("Failed to load collections.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddCollection = async (e) => {
    e.preventDefault();
    setError("");

    const title = newTitle.trim();
    if (!title) {
      setError("Please enter a collection name.");
      return;
    }

    // prevent dupes (case-insensitive)
    if (existingTitlesCI.has(title.toLowerCase())) {
      setError("A collection with this name already exists.");
      return;
    }

    try {
      setAddLoading(true);
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        setError("Not authenticated.");
        return;
      }

      const { data, error: insertErr } = await supabase
        .from("collection")
        .insert([{ title, user_id: user.id }])
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Update UI
      setCollections((prev) => [...prev, data].sort((a, b) => a.title.localeCompare(b.title)));
      setQuoteCounts((prev) => ({ ...prev, [data.id]: 0 }));
      setNewTitle("");

      // Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (e) {
      console.error(e);
      setError("Failed to add collection.");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100 overflow-hidden bg-light">
      {/* Sidebar */}
      <Sidebar color="black" routes={routes} />

      {/* Main content area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px" }}>
        <Navbar />

        <div className="flex-grow-1 container-fluid py-4 px-5">
          <h2 className="text-center fw-bold mb-4">My Collections</h2>

          {/* Errors */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Collections List */}
          {loading ? (
            <div className="text-muted">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="text-muted mb-3">No collections yet.</div>
          ) : (
            <ul className="list-group mb-4">
              {collections.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{c.title}</span>
                  <span className="badge bg-primary rounded-pill">
                    {quoteCounts[c.id] || 0}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Add Collection */}
          <div className="mt-4">
            <h5 className="fw-bold mb-3">Add a New Collection</h5>
            <form className="row g-2 align-items-center" onSubmit={handleAddCollection}>
              <div className="col-sm-8 col-md-6 col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Collection name"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={addLoading}
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" type="submit" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="toast-container position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: 2000 }}
        >
          <div
            className="toast align-items-center text-white bg-success border-0 show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ minWidth: "260px" }}
          >
            <div className="d-flex">
              <div className="toast-body text-center w-100">
                Collection successfully added!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCollections;