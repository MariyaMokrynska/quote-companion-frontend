import React, { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegCalendarAlt } from "react-icons/fa";

// helpers for date limits
const todayIso = new Date().toISOString().slice(0, 10);
const firstOfMonthIso = (() => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
})();

// Charts
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function MyReflections() {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Simple filters
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tagQuery, setTagQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: { user }, error: uerr } = await supabase.auth.getUser();
        if (uerr) throw uerr;
        if (!user) {
          setReflections([]);
          setLoading(false);
          return;
        }

        // Adjust column names here if yours differ
        const { data, error } = await supabase
          .from("reflection")
          // .select("id, user_id, created_at, text, quote_text, tags")
          .select("id, user_id, created_at, text, quote_text, quote_author, tags")

          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const mapped = (data || []).map(mapReflection);
        setReflections(mapped);
      } catch (e) {
        console.error(e);
        setErr("Failed to load reflections.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Normalize row
  function mapReflection(r) {
    const tags = (r.tags || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    return {
      id: r.id,
      createdAt: r.created_at,
      dateOnly: r.created_at ? new Date(r.created_at).toISOString().slice(0,10) : "",
      // text: r.text || r.text_text || "",
      text: r.text || "",
      quote_text: r.quote_text || "",
      quote_author: r.quote_author || "",
      tags,
      tagsStr: tags.join(", ")
    };
  }

  async function handleDeleteReflection(id) {
    try {
      const { data: { user }, error: uerr } = await supabase.auth.getUser();
      if (uerr) throw uerr;
      if (!user) return;
  
      const { error } = await supabase
        .from("reflection")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
  
      if (error) throw error;
  
      // Update UI
      setReflections(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Failed to delete reflection:", e);
      setErr("Failed to delete reflection. Please try again.");
    }
  }

  // Filtered rows
  const filtered = useMemo(() => {
    return reflections.filter(r => {
      const d = r.dateOnly;
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (tagQuery) {
        const q = tagQuery.toLowerCase();
        if (!r.tagsStr.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [reflections, from, to, tagQuery]);

  // Chart: top tags
  const topTags = useMemo(() => {
    const counts = new Map();
    for (const r of filtered) {
      for (const t of r.tags) {
      counts.set(t, (counts.get(t) || 0)   +1);
      }
    }
    return Array.from(counts.entries())
      .sort((a,b) => b[1]-a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }, [filtered]);

  return (
    // <div className="d-flex min-vh-100 w-100 overflow-hidden bg-light">
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar color="black" routes={routes} />

      {/* Main area */}
      {/* <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px" }}> */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", minHeight: "100vh", position: "relative" }}
      >
        <Navbar />

        {/* <div className="flex-grow-1 container-fluid py-4 px-4 px-md-5"> */}
        <div className="flex-grow-1 p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold mb-0">My Reflections</h2>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row gy-3 gx-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label mb-1 text-start d-block">From:</label>
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-control"
                      value={from}
                      min={firstOfMonthIso}
                      max={todayIso}
                      onChange={(e) => setFrom(e.target.value)}
                      ref={fromRef}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        if (fromRef.current?.showPicker) fromRef.current.showPicker();
                        else fromRef.current?.focus();
                      }}
                      title="Pick a date"
                    >
                      <FaRegCalendarAlt />
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label mb-1 text-start d-block">To:</label>
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-control"
                      value={to}
                      min={firstOfMonthIso}
                      max={todayIso}
                      onChange={(e) => setTo(e.target.value)}
                      ref={toRef}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        if (toRef.current?.showPicker) toRef.current.showPicker();
                        else toRef.current?.focus();
                      }}
                      title="Pick a date"
                    >
                      <FaRegCalendarAlt />
                    </button>
                  </div>
                </div>              
                <div className="col-12 col-md-4">
                  <label className="form-label mb-1 text-start d-block">Tag Contains:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Happiness"
                    value={tagQuery}
                    onChange={(e) => setTagQuery(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2 d-grid">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => { setFrom(""); setTo(""); setTagQuery(""); }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-muted">Loading reflections…</p>
          ) : err ? (
            <div className="alert alert-danger">{err}</div>
          ) : (
            <>

              {/* Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">All Reflections</h5>
                  {filtered.length === 0 ? (
                    <p className="text-muted">No reflections match your filters.</p>
                  ) : (

                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th style={{minWidth: 120}}>Date</th>
                            <th style={{minWidth: 220}}>Mood</th>
                            <th style={{minWidth: 260}}>Quote</th>
                            <th style={{minWidth: 180}}>Tags</th>
                            <th style={{width: 110}}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(r => (
                            <tr key={r.id}>
                              <td>{r.dateOnly}</td>

                              {/* Reflection text */}
                              <td className="text-wrap">
                                {r.text || <span className="text-muted">—</span>}
                              </td>

                            {/* Quote    author (author right-aligned under the quote) */}
                              <td className="text-wrap">
                                {r.quote_text ? (
                                  <>
                                    “{r.quote_text}”
                                    <small className="d-block text-end text-muted mt-1">
                                      {r.quote_author ? r.quote_author : "—"}
                                    </small>
                                  </>
                                ) : (
                                  <span className="text-muted">—</span>
                                )}
                              </td>



                              {/* Tags */}
                              <td>{r.tags.length ? r.tags.join(", ") : <span className="text-muted">—</span>}</td>

                              {/* Delete */}
                              <td className="text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteReflection(r.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Bar Chart: top tags */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Top Tags</h5>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <BarChart data={topTags}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tag" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>             
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}