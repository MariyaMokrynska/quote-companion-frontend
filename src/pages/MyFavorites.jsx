import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { FaHeart } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]); // array of quote ids
  const [favoriteQuotes, setFavoriteQuotes] = useState([]); // full quote objects
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

      // Fetch favorite quote IDs
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

      // Fetch full quotes data for these favorite IDs
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
          <h2 className="text-center fw-bold">My Favorite Quotes</h2>
          <p className="text-center">Quotes you have marked as favorite.</p>

          <section className="quotes-grid mt-4">
            {favoriteQuotes.length === 0 && (
              <p className="text-center text-muted">You have no favorite quotes yet.</p>
            )}
            {favoriteQuotes.map((quote) => {
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
                    <FaHeart
                      title="Remove Favorite"
                      onClick={() => handleFavoriteToggle(quote)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
}
