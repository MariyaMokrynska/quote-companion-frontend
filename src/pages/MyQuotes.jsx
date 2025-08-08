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

  useEffect(() => {
    fetchQuotes(collectionId); // pass optional collectionId
    // re-run whenever the query string changes
  }, [collectionId, location.search]); 

  async function fetchQuotes(filterCollectionId) { 

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
      return;
    }

    let query = supabase
      .from("quote")
      .select("*")
      .eq("user_id", user.id); 

    if (filterCollectionId) {
      query = query.eq("collection_id", filterCollectionId); 
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
    } else {
      setQuotes(data);
    }
  }

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete quote with id:", id);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User fetch error:", userError);
        return;
      }

      if (!user) {
        console.warn("No authenticated user found.");
        return;
      }

      const { data, error } = await supabase
        .from("quote")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select(); // return deleted rows info

      if (error) {
        console.error("Delete failed:", error);
        return;
      }

      console.log("Deleted quote:", data);

      // Refresh quotes list after delete
      await fetchQuotes();
    } catch (err) {
      console.error("Delete exception:", err);
    }
  };

  const handleFavorite = async (quote) => {
    console.log("Favorite:", quote);
    // TODO: Insert into "favorite" table
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
    fetchQuotes();
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
                onClick={() => navigate("/myquotes", { replace: true })} // [ADD] Clear filter
              >
                Clear filter
              </button>
            </div>
          )}

          <section className="quotes-grid mt-4">
            {quotes.map((quote) => (
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
            ))}
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
