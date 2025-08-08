import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import {
  FaEdit,
  FaTrash,
  FaHeart,
  FaPlusSquare,
  FaThLarge,
  FaShareAlt,
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

  useEffect(() => {
    // Load user and fetch quotes and favorites
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
        console.warn("No authenticated user found.");
        setQuotes([]);
        setFavorites([]);
        setUserId(null);
        return;
      }

      setUserId(user.id);

      await fetchQuotes(collectionId, user.id);
      await fetchFavorites(user.id);
    }
    loadUserAndData();
  }, [collectionId, location.search]);

  async function fetchQuotes(filterCollectionId, uid) {
    if (!uid) {
      setQuotes([]);
      return;
    }
    try {
      let query = supabase
        .from("quote")
        .select("*")
        .eq("user_id", uid);

      if (filterCollectionId) {
        query = query.eq("collection_id", filterCollectionId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

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
        const favoriteIds = data.map((f) => f.quote_id);
        setFavorites(favoriteIds);
      }
    } catch (err) {
      console.error("fetchFavorites exception:", err);
      setFavorites([]);
    }
  }

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      if (!userId) return;
      const { data, error } = await supabase
        .from("quote")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .select();

      if (error) {
        console.error("Delete failed:", error);
        return;
      }
      await fetchQuotes(collectionId, userId);
    } catch (err) {
      console.error("Delete exception:", err);
    }
  };

  // Toggle favorite/unfavorite the quote
  const handleFavorite = async (quote) => {
    if (!userId) {
      alert("You need to be logged in to favorite quotes.");
      return;
    }

    try {
      const isFavorited = favorites.includes(quote.id);

      if (isFavorited) {
        // Remove favorite
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
        // Add favorite
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

  const handleAddToCollection = (quote) => {
    console.log("Add to Collection:", quote);
    // TODO: Open collection picker/modal
  };

  const handleViewCollection = (quote) => {
    console.log("View Collection:", quote);
    // TODO: Navigate or display collection info
  };

  const handleShare = (quote) => {
    console.log("Share:", quote);
    // TODO: Copy to clipboard or open share modal
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingQuote(null);
    fetchQuotes(collectionId, userId);
  };

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
            {collectionId ? `Quotes in “${collectionTitle || "Collection"}”` : "My Quotes"}
          </h2>
          <p className="text-center">
            {collectionId ? "Filtered by collection" : "Your personal collection of inspiration"}
          </p>
          {collectionId && (
            <div className="text-center mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => navigate("/myquotes", { replace: true })} // Clear filter
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
                      style={{ color: isFavorited ? "red" : "inherit", cursor: "pointer" }}
                    />
                    <FaPlusSquare
                      title="Add to Collection"
                      onClick={() => handleAddToCollection(quote)}
                    />
                    <FaThLarge
                      title="View Collection"
                      onClick={() => handleViewCollection(quote)}
                    />
                    <FaShareAlt
                      title="Share"
                      onClick={() => handleShare(quote)}
                    />
                  </div>
                </div>
              );
            })}
          </section>
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
