import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { FaHeart } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function loadUserAndFavorites() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }
      if (!user) {
        setUserId(null);
        setFavorites([]);
        setFavoriteQuotes([]);
        return;
      }

      setUserId(user.id);

      const { data: favData, error: favError } = await supabase
        .from("favorite")
        .select("quote_id")
        .eq("user_id", user.id);

      if (favError) {
        console.error("Error fetching favorites:", favError);
        setFavorites([]);
        setFavoriteQuotes([]);
        return;
      }

      const favIds = favData.map((f) => f.quote_id);
      setFavorites(favIds);

      if (favIds.length === 0) {
        setFavoriteQuotes([]);
        return;
      }

      const { data: quotesData, error: quotesError } = await supabase
        .from("quote")
        .select("*")
        .in("id", favIds)
        .order("created_at", { ascending: false });

      if (quotesError) {
        console.error("Error fetching favorite quotes:", quotesError);
        setFavoriteQuotes([]);
      } else {
        setFavoriteQuotes(quotesData || []);
      }
    }

    loadUserAndFavorites();
  }, []);

  const handleFavoriteToggle = async (quote) => {
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
        setFavoriteQuotes((prev) => prev.filter((q) => q.id !== quote.id));
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
        setFavoriteQuotes((prev) => [quote, ...prev]);
      }
    } catch (err) {
      console.error("handleFavoriteToggle exception:", err);
    }
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
          <h2 className="text-center fw-bold mb-3">My Favorite Quotes</h2>
          <p className="text-center text-muted mb-4">
            Quotes you have marked as favorite.
          </p>

          {favoriteQuotes.length === 0 ? (
            <div className="text-center text-secondary mt-5">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No favorites"
                style={{ width: "100px", opacity: 0.3 }}
                className="mb-3"
              />
              <p>You have no favorite quotes yet.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {favoriteQuotes.map((quote) => (
                <div key={quote.id} className="col">
                  <div
                    className="card h-100 shadow-sm"
                    style={{ cursor: "default", transition: "transform 0.2s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div className="card-body d-flex flex-column">
                      <blockquote className="blockquote mb-3 flex-grow-1">
                        <p className="mb-3" style={{ fontSize: "1.15rem", lineHeight: "1.4" }}>
                          “{quote.text}”
                        </p>
                        <footer className="blockquote-footer" style={{ marginTop: "auto" }}>
                          <span className="badge bg-primary px-2 py-1" style={{ fontSize: "0.85rem" }}>
                            {quote.author || "Unknown"}
                          </span>
                        </footer>
                      </blockquote>

                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted">
                          {formatDistanceToNow(new Date(quote.created_at), {
                            addSuffix: true,
                          })}
                        </small>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          title="Remove from favorites"
                          onClick={() => handleFavoriteToggle(quote)}
                        >
                          <FaHeart /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}


