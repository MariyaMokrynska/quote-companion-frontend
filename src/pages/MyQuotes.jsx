import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { Modal } from "bootstrap";
import {
  FaEdit,
  FaTrash,
  FaHeart,
  FaPlusSquare,
  // FaThLarge,  // Removed view collection icon
  // FaShareAlt, // Share icon will be commented in JSX
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";
import EditQuote from "./EditQuote";
import "./MyQuotes.css";

export default function MyQuotesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const collectionId = params.get("collectionId");
  const collectionTitle = params.get("title");

  const [quotes, setQuotes] = useState([]);
  const [editingQuote, setEditingQuote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [quoteToAdd, setQuoteToAdd] = useState(null);

  const collectionModalRef = useRef(null);
  const collectionModalInstance = useRef(null);

  useEffect(() => {
    async function loadUserAndData() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      if (!user) {
        setQuotes([]);
        setFavorites([]);
        setUserId(null);
        return;
      }

      setUserId(user.id);

      await fetchQuotes(collectionId, user.id);
      await fetchFavorites(user.id);
      await fetchCollections(user.id);
    }
    loadUserAndData();
  }, [collectionId, location.search]);

  useEffect(() => {
    if (quoteToAdd) {
      if (collectionModalRef.current) {
        collectionModalInstance.current = new Modal(collectionModalRef.current, {
          backdrop: "static",
        });
        collectionModalInstance.current.show();
      }
    } else {
      if (collectionModalInstance.current) {
        collectionModalInstance.current.hide();
        collectionModalInstance.current = null;
      }
      setSelectedCollectionId("");
      setNewCollectionName("");
    }
  }, [quoteToAdd]);

  async function fetchQuotes(filterCollectionId, uid) {
    if (!uid) {
      setQuotes([]);
      return;
    }
    try {
      let query = supabase.from("quote").select("*").eq("user_id", uid);
      if (filterCollectionId) {
        query = query.eq("collection_id", filterCollectionId);
      }
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) {
        console.error("Error fetching quotes:", error);
      } else {
        setQuotes(data || []);
      }
    } catch (err) {
      console.error("fetchQuotes exception:", err);
    }
  }

  async function fetchFavorites(uid) {
    if (!uid) {
      setFavorites([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("favorite")
        .select("quote_id")
        .eq("user_id", uid);
      if (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      } else {
        setFavorites(data.map((f) => f.quote_id));
      }
    } catch (err) {
      console.error("fetchFavorites exception:", err);
      setFavorites([]);
    }
  }

  async function fetchCollections(uid) {
    if (!uid) {
      setCollections([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("collection")
        .select("id, title")
        .eq("user_id", uid)
        .order("title", { ascending: true });
      if (error) {
        console.error("Error fetching collections:", error);
        setCollections([]);
      } else {
        setCollections(data || []);
      }
    } catch (err) {
      console.error("fetchCollections exception:", err);
      setCollections([]);
    }
  }

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      if (!userId) return;
      const { error } = await supabase
        .from("quote")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) {
        console.error("Delete failed:", error);
        return;
      }
      await fetchQuotes(collectionId, userId);
    } catch (err) {
      console.error("Delete exception:", err);
    }
  };

  const handleFavorite = async (quote) => {
    if (!userId) {
      alert("You need to be logged in to favorite quotes.");
      return;
    }
    try {
      const isFavorited = favorites.includes(quote.id);
      if (isFavorited) {
        const { error } = await supabase
          .from("favorite")
          .delete()
          .eq("user_id", userId)
          .eq("quote_id", quote.id);
        if (error) {
          console.error("Error removing favorite:", error);
          return;
        }
        setFavorites((prev) => prev.filter((id) => id !== quote.id));
      } else {
        const { error } = await supabase.from("favorite").insert([
          {
            user_id: userId,
            quote_id: quote.id,
          },
        ]);
        if (error) {
          console.error("Error adding favorite:", error);
          return;
        }
        setFavorites((prev) => [...prev, quote.id]);
      }
    } catch (err) {
      console.error("handleFavorite exception:", err);
    }
  };

  const handleAddToCollectionClick = (quote) => {
    setQuoteToAdd(quote);
  };

  const handleAddToCollectionConfirm = async () => {
    if (!userId || !quoteToAdd) return;

    try {
      let collectionIdToUse = selectedCollectionId;

      if (!collectionIdToUse && newCollectionName.trim()) {
        const { data: newColl, error: collErr } = await supabase
          .from("collection")
          .insert([{ title: newCollectionName.trim(), user_id: userId }])
          .select()
          .single();
        if (collErr) throw collErr;
        collectionIdToUse = newColl.id;
        await fetchCollections(userId);
      }

      if (!collectionIdToUse) {
        alert("Please select or create a collection.");
        return;
      }

      const { error: updateErr } = await supabase
        .from("quote")
        .update({ collection_id: collectionIdToUse })
        .eq("id", quoteToAdd.id)
        .eq("user_id", userId);
      if (updateErr) throw updateErr;

      alert("Quote added to collection!");
      setQuoteToAdd(null); // This will hide the modal & reset selections
      await fetchQuotes(collectionId, userId);
    } catch (err) {
      console.error("handleAddToCollectionConfirm error:", err);
      alert("Failed to add quote to collection.");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingQuote(null);
    fetchQuotes(collectionId, userId);
  };

  /*
  // Commented out handleShare handler
  const handleShare = (quote) => {
    console.log("Share:", quote);
  };
  */

  return (
    <div className="d-flex">
      <Sidebar color="dark" routes={routes} />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", minHeight: "100vh" }}
      >
        <Navbar />

        <div className="flex-grow-1 p-4">
          <h2 className="text-center fw-bold">
            {collectionId
              ? `Quotes in “${collectionTitle || "Collection"}”`
              : "My Quotes"}
          </h2>
          <p className="text-center">
            {collectionId
              ? "Filtered by collection"
              : "Your personal collection of inspiration"}
          </p>
          {collectionId && (
            <div className="text-center mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate("/myquotes", { replace: true })}
              >
                Clear filter
              </button>
            </div>
          )}

          <section className="quotes-grid mt-4">
            {quotes.map((quote) => {
              const isFavorited = favorites.includes(quote.id);
              return (
                <div key={quote.id} className="quote-card">
                  <p className="quote-text">“{quote.text}”</p>
                  <p className="quote-author">
                    <em>{quote.author || "Unknown"}</em>
                  </p>
                  <span className="quote-timestamp">
                    {formatDistanceToNow(new Date(quote.created_at), {
                      addSuffix: true,
                    })}
                  </span>

                  <div className="quote-actions">
                    <FaEdit title="Edit" onClick={() => handleEdit(quote)} />
                    <FaTrash
                      title="Delete"
                      onClick={() => handleDelete(quote.id)}
                    />
                    <FaHeart
                      title="Favorite"
                      onClick={() => handleFavorite(quote)}
                      style={{
                        color: isFavorited ? "red" : "inherit",
                        cursor: "pointer",
                      }}
                    />
                    <FaPlusSquare
                      title="Add to Collection"
                      onClick={() => handleAddToCollectionClick(quote)}
                    />
                    {/* 
                    <FaShareAlt
                      title="Share"
                      onClick={() => handleShare(quote)} 
                    /> 
                    */}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Collection Picker Modal */}
          <div
            className="modal fade"
            tabIndex="-1"
            ref={collectionModalRef}
            aria-labelledby="collectionPickerLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-3">
                <h5 id="collectionPickerLabel" className="mb-3">
                  Select or Create Collection
                </h5>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="quoteCollection"
                      className="form-label text-start w-100"
                    >
                      Existing Collections
                    </label>
                    <select
                      className="form-select"
                      id="quoteCollection"
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                    >
                      <option value="">Select existing collection...</option>
                      {collections.map((coll) => (
                        <option key={coll.id} value={coll.id}>
                          {coll.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="newCollection"
                      className="form-label text-start w-100"
                    >
                      Add New Collection
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="newCollection"
                      placeholder="Enter new collection title"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleAddToCollectionConfirm}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setQuoteToAdd(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {showEditModal && editingQuote && (
        <EditQuote
          quoteId={editingQuote.id}
          initialQuoteText={editingQuote.text}
          initialAuthor={editingQuote.author}
          initialTags={editingQuote.tags || ""}
          initialSource={editingQuote.source || ""}
          defaultCollectionId={editingQuote.collection_id}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
