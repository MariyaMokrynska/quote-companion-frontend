import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";

const ZEN_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zenquotes`;
const FN_HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
};

const keywordList = [
  "Anxiety", "Change", "Choice", "Confidence", "Courage",
  "Death", "Dreams", "Excellence", "Failure", "Fairness",
  "Fear", "Forgiveness", "Freedom", "Future", "Happiness",
  "Inspiration", "Kindness", "Leadership", "Life", "Living",
  "Love", "Pain", "Past", "Success", "Time", "Today", "Truth", "Work"
];

const authorList = [
  "Abraham Lincoln",
  "Adi Da Samraj",
  "Alan Watts",
  "Albert Einstein",
  "Albus Dumbledore",
  "Alexander Graham Bell",
  "Alexander Pope",
  "Alexandre Dumas",
  "Alfred Adler",
  "Amelia Earhart",
  "Andrew Carnegie",
  "Andrew Hendrixson",
  "Anita Krizzan",
  "Anne Frank",
  "Anne Wilson Schaef",
  "Aristophanes",
  "Aristotle",
  "Arnold Schwarzenegger",
  "Audrey Hepburn",
  "Ayn Rand",
  "Babe Ruth",
  "Barack Obama",
  "Benjamin Franklin",
  "Benjamin Mays",
  "Bette Midler",
  "Betty White",
  "Beverly Sills",
  "Bhagavad Gita",
  "Billie Jean King",
  "Bob Dylan",
  "Bob Marley",
  "Bob Proctor",
  "Bodhidharma",
  "Brian Tracy",
  "Bruce Lee",
  "Buddha",
  "C. Sean McGee",
  "Candice Carpenter",
  "Carl Bard",
  "Carl Jung",
  "Carlos Ruiz Zafon",
  "Carol Burnett",
  "Celestine Chua",
  "Charles Darwin",
  "Charles Dickens",
  "Charles Spurgeon",
  "Charles Swindoll",
  "Charlie Chaplin",
  "Cherie Gilderbloom",
  "Cherralea Morgen",
  "Chinese Proverb",
  "Christopher Columbus",
  "Christopher McCandless",
  "Christopher Reeve",
  "Coco Chanel",
  "Colin Powell",
  "Colin R. Davis",
  "Confucius",
  "Conrad Hilton",
  "Criss Jami",
  "D. H. Lawrence",
  "Dalai Lama",
  "Dale Carnegie",
  "Dan Brown",
  "Dan Millman",
  "David Brinkley",
  "Deepak Chopra",
  "Deepam Chaterjee",
  "Denis Waitley",
  "Dogen",
  "Doug Ivester",
  "Dr. Seuss",
  "Dudley Field Malone",
  "Earl Nightingale",
  "Eckhart Tolle",
  "Edgar Allan Poe",
  "Elbert Hubbard",
  "Eleanor Roosevelt",
  "Elon Musk",
  "Elvis Presley",
  "Emily Dickinson",
  "Epictetus",
  "Eric Hoffer",
  "Estee Lauder",
  "Euripides",
  "F. Scott Fitzgerald",
  "Franklin D. Roosevelt",
  "Franz Kafka",
  "G.I. Gurdjieff",
  "Gabor Mate",
  "Gary Keller",
  "Genghis Khan",
  "George Addair",
  "George Bernard Shaw",
  "George Eliot",
  "George Washington",
  "Gilbert Chesterton",
  "Grace Coddington",
  "Gurbaksh Chahal",
  "Gustave Flaubert",
  "Hans Christian Andersen",
  "Harry S. Truman",
  "Helen Keller",
  "Henry David Thoreau",
  "Henry Ford",
  "Henry Ward Beecher",
  "Heraclitus",
  "Herbert Hoover",
  "Herman Melville",
  "Herodotus",
  "Honore de Balzac",
  "Huang Po",
  "Isaac Newton",
  "J.R.R. Tolkien",
  "Jack Butcher",
  "Jack Kerouac",
  "Jack London",
  "James Allen",
  "James Cameron",
  "James Matthew Barrie",
  "Jeffrey Gitomer",
  "Jiddu Krishnamurti",
  "Jim Rohn",
  "Joan Rivers",
  "Johann Wolfgang von Goethe",
  "John Carmack",
  "John D. Rockefeller",
  "John Eliot",
  "John Lennon",
  "John Locke",
  "John Tukey",
  "John Wooden",
  "Jon Kabat-Zinn",
  "Jonathan Swift",
  "Josh Waitzkin",
  "Joyce Meyer",
  "Judy Garland",
  "Kabir",
  "Kahlil Gibran",
  "Kamal Ravikant",
  "Kenji Miyazawa",
  "Kenneth Branagh",
  "Kilian Jornet",
  "Lao Tzu",
  "Laurence J. Peter",
  "Leo Tolstoy",
  "Leonardo da Vinci",
  "Les Brown",
  "Lily Tomlin",
  "Lin Yutang",
  "Lolly Daskal",
  "Mae West",
  "Mahatma Gandhi",
  "Marcus Aurelius",
  "Margaret Mead",
  "Marilyn Monroe",
  "Mark Manson",
  "Mark Twain",
  "Martin Luther",
  "Martin Luther King, Jr.",
  "Mary Engelbreit",
  "Maxime Lagace",
  "Maya Angelou",
  "Meister Eckhart",
  "Michael Jordan",
  "Miguel de Cervantes",
  "Ming-Dao Deng",
  "Morgan Wootten",
  "Morihei Ueshiba",
  "Mother Teresa",
  "Napoleon Hill",
  "Naval Ravikant",
  "Neil Barringham",
  "Nelson Mandela",
  "Niccolo Machiavelli",
  "Nicolas Chamfort",
  "Nikola Tesla",
  "Norman Vaughan",
  "Norman Vincent Peale",
  "Og Mandino",
  "Oprah Winfrey",
  "Orison Swett Marden",
  "Oscar Wilde",
  "Osho",
  "Pablo Picasso",
  "Paramahansa Yogananda",
  "Paulo Coelho",
  "Pema Chodron",
  "Peter A. Cohen",
  "Peter Drucker",
  "Plato",
  "Publilius Syrus",
  "Ralph Marston",
  "Ralph Waldo Emerson",
  "Ray Bradbury",
  "Richard Bach",
  "Rita Mae Brown",
  "Robert Browning",
  "Robert Collier",
  "Robert F. Kennedy",
  "Robert Frost",
  "Robert Greene",
  "Robert Kiyosaki",
  "Robin Sharma",
  "Robin Williams",
  "Roger Lee",
  "Ronald Reagan",
  "Rosa Nouchette Carey",
  "Roy T. Bennett",
  "Rumi",
  "Samuel Beckett",
  "Samuel Butler",
  "Sathya Sai Baba",
  "Seneca",
  "Seungsahn",
  "Shahir Zag",
  "Shunryu Suzuki",
  "Sigmund Freud",
  "Simon Sinek",
  "Socrates",
  "Sonia Ricotti",
  "Soren Kierkegaard",
  "Soyen Shaku",
  "Spencer Johnson",
  "St. Jerome",
  "Stephen Hawking",
  "Stephen King",
  "Steve Harvey",
  "Steve Jobs",
  "Steve Maraboli",
  "Sun Tzu",
  "Sydney Smith",
  "T.S. Eliot",
  "Theodore Roosevelt",
  "Thich Nhat Hanh",
  "Thomas Edison",
  "Thomas Jefferson",
  "Toni Morrison",
  "Tony Robbins",
  "Unknown",
  "Vaclav Havel",
  "Vidal Sassoon",
  "Vince Lombardi",
  "Vincent van Gogh",
  "Virginia Woolf",
  "Voltaire",
  "W. Clement Stone",
  "W.P. Kinsella",
  "Walt Disney",
  "Walt Whitman",
  "Wayne Dyer",
  "Wayne Gretzky",
  "Will Rogers",
  "William Faulkner",
  "William James",
  "Winston Churchill",
  "Woody Allen",
  "Yanni",
  "Yoko Ono",
  "Zen Proverb",
  "Zhuangzi",
  "Zig Ziglar"
].sort();

function SearchQuotes() {
  const [authorQuery, setAuthorQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [results, setResults] = useState([]); // Each result will have id, text, author, and real dbId (UUID) if found in DB
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // Set of quote UUIDs favorited
  const [myQuotes, setMyQuotes] = useState(new Set()); // Set of quote UUIDs added by user

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (!user) return;

      setUserId(user.id);

      // Fetch favorite quote UUIDs
      const { data: favData, error: favError } = await supabase
        .from("favorite")
        .select("quote_id")
        .eq("user_id", user.id);

      if (favError) {
        console.error("Error fetching favorites:", favError);
      } else {
        setFavorites(new Set(favData.map(f => f.quote_id)));
      }

      // Fetch user's own quote UUIDs
      const { data: myQuoteData, error: myQuoteError } = await supabase
        .from("quote")
        .select("id")
        .eq("user_id", user.id);

      if (myQuoteError) {
        console.error("Error fetching my quotes:", myQuoteError);
      } else {
        setMyQuotes(new Set(myQuoteData.map(q => q.id)));
      }
    }

    fetchUserData();
  }, []);

  const filteredAuthors = authorList.filter(a =>
    a.toLowerCase().includes(authorQuery.toLowerCase())
  );

  // When we get quotes from external API, map them and try to find matching DB quote IDs by text+author
  useEffect(() => {
    const fetchData = async () => {
      if (!authorQuery && selectedKeywords.length === 0) {
        setResults([]);
        setErr("");
        return;
      }
      setErr("");
      setLoading(true);
      setMsg("");

      try {
        const params = new URLSearchParams();
        if (authorQuery) params.set("author", authorQuery);
        if (selectedKeywords.length > 0) {
          params.set("keyword", selectedKeywords.join(",").toLowerCase());
        }

        const res = await fetch(`${ZEN_FN_URL}?${params.toString()}`, { headers: FN_HEADERS });
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0 || data.message) {
          setErr("No quotes found.");
          setResults([]);
        } else {
          // Prepare text+author combos to check existing DB quotes
          const combos = data.map(q => ({ text: q.q, author: q.a || "Unknown" }));

          // Fetch all matching quotes from DB by text+author in a single query using OR logic
          // Supabase doesn't have direct OR for multiple fields, so we'll query each separately or use RPC if available
          // For simplicity, query each individually in Promise.all
          const dbQuotes = await Promise.all(
            combos.map(({ text, author }) =>
              supabase
                .from("quote")
                .select("id, text, author")
                .eq("text", text)
                .eq("author", author)
                .limit(1)
                .then(({ data }) => (data && data.length ? data[0] : null))
            )
          );

          const mapped = data.map((q, i) => ({
            id: `zen-${q.a}-${i}`, // frontend fake id for key usage
            text: q.q,
            author: q.a || "Unknown",
            dbId: dbQuotes[i] ? dbQuotes[i].id : null, // real UUID if exists in DB
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

    fetchData();
  }, [authorQuery, selectedKeywords]);

  const toggleKeyword = (kw) => {
    setSelectedKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const clearFilters = () => {
    setAuthorQuery("");
    setSelectedKeywords([]);
    setErr("");
    setMsg("");
  };

  // Helper: get the quote's DB UUID if available, else null
  const getDbId = (quote) => quote.dbId || null;

  const handleToggleFavorite = async (quote) => {
    if (!userId) {
      setMsg("Please log in to manage favorites.");
      return;
    }

    try {
      // If quote doesn't have dbId yet, insert it first
      let quoteId = getDbId(quote);
      if (!quoteId) {
        // Insert quote in DB
        const { data: insertedQuote, error: insertError } = await supabase
          .from("quote")
          .insert([{ text: quote.text, author: quote.author, user_id: userId }])
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting quote:", insertError);
          setMsg("Failed to add quote to DB.");
          return;
        }

        quoteId = insertedQuote.id;

        // Update results state with new dbId for this quote (to avoid re-inserting next time)
        setResults(prev =>
          prev.map(r =>
            r.id === quote.id ? { ...r, dbId: quoteId } : r
          )
        );
      }

      if (favorites.has(quoteId)) {
        // Remove favorite
        const { error: delError } = await supabase
          .from("favorite")
          .delete()
          .eq("user_id", userId)
          .eq("quote_id", quoteId);

        if (delError) {
          console.error("Error removing favorite:", delError);
          setMsg("Failed to remove favorite.");
          return;
        }

        setFavorites(prev => {
          const copy = new Set(prev);
          copy.delete(quoteId);
          return copy;
        });
        setMsg("Removed from favorites.");
      } else {
        // Add favorite
        const { error: favError } = await supabase
          .from("favorite")
          .insert([{ user_id: userId, quote_id: quoteId }]);

        if (favError) {
          console.error("Error adding favorite:", favError);
          setMsg("Failed to add favorite.");
          return;
        }

        setFavorites(prev => new Set(prev).add(quoteId));
        setMsg("Added to favorites.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong.");
    }
  };

  const handleAddToMyQuotes = async (quote) => {
    if (!userId) {
      setMsg("Please log in to add quotes.");
      return;
    }

    try {
      // If quote already added, no-op
      let quoteId = getDbId(quote);

      if (quoteId && myQuotes.has(quoteId)) {
        setMsg("Quote already in your collection.");
        return;
      }

      if (!quoteId) {
        // Insert quote in DB owned by user
        const { data: insertedQuote, error: insertError } = await supabase
          .from("quote")
          .insert([{ user_id: userId, text: quote.text, author: quote.author }])
          .select()
          .single();

        if (insertError) {
          console.error("Error adding quote:", insertError);
          setMsg("Failed to add quote.");
          return;
        }

        quoteId = insertedQuote.id;

        // Update results state so we know dbId now
        setResults(prev =>
          prev.map(r =>
            r.id === quote.id ? { ...r, dbId: quoteId } : r
          )
        );
      }

      setMyQuotes(prev => new Set(prev).add(quoteId));
      setMsg("Quote added to your collection!");
    } catch (err) {
      console.error(err);
      setMsg("Failed to add quote. Try again.");
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100 overflow-hidden bg-light">
      <Sidebar color="black" routes={routes} />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px" }}>
        <Navbar />
        <div className="flex-grow-1 container-fluid py-4 px-4 px-md-5">
          <h2 className="fw-bold text-center mb-4">Search Quotes</h2>

          {/* Author typeahead */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Author</label>
            <input
              type="text"
              className="form-control"
              placeholder="Start typing an author's name..."
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
              autoComplete="off"
            />
            {authorQuery && (
              <div
                className="list-group position-absolute shadow"
                style={{
                  zIndex: 1050,
                  maxHeight: 200,
                  overflowY: "auto",
                  width: "100%",
                  borderRadius: "0 0 .25rem .25rem",
                }}
              >
                {filteredAuthors.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => setAuthorQuery(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keyword chips */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Keywords</label>
            <div className="d-flex flex-wrap gap-2">
              {keywordList.map((kw) => (
                <span
                  key={kw}
                  role="button"
                  className={`badge px-3 py-2 fw-semibold cursor-pointer ${
                    selectedKeywords.includes(kw) ? "bg-primary" : "bg-secondary"
                  }`}
                  onClick={() => toggleKeyword(kw)}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Clear button */}
          {(authorQuery || selectedKeywords.length > 0) && (
            <div className="mb-3 text-center">
              <button className="btn btn-outline-danger btn-sm" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Messages and Loading */}
          {loading && <div className="text-center my-3">Loading...</div>}
          {err && <div className="alert alert-danger text-center">{err}</div>}
          {msg && <div className="alert alert-info text-center">{msg}</div>}

          {/* Results */}
          <div className="row">
            {results.map((r) => {
              // Use dbId if exists for favorites/myQuotes sets, fallback to frontend id (rare)
              const quoteDbId = r.dbId || r.id;
              const isFavorited = favorites.has(quoteDbId);
              const isAddedToMyQuotes = myQuotes.has(quoteDbId);
              return (
                <div className="col-md-6 col-lg-4 mb-4" key={r.id}>
                  <div className="card h-100 shadow-sm d-flex flex-column">
                    <div className="card-body flex-grow-1 d-flex flex-column justify-content-between">
                      <blockquote className="blockquote mb-4">
                        <p className="fs-5">“{r.text}”</p>
                        <footer className="blockquote-footer text-end fst-italic">{r.author}</footer>
                      </blockquote>
                      <div className="d-flex justify-content-between gap-2">
                        <button
                          className={`btn btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1 ${
                            isFavorited ? "btn-danger" : "btn-outline-danger"
                          }`}
                          onClick={() => handleToggleFavorite(r)}
                          aria-pressed={isFavorited}
                          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                          {isFavorited ? "❤️ Favorited" : "🤍 Favorite"}
                        </button>

                        <button
                          className={`btn btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1 ${
                            isAddedToMyQuotes ? "btn-secondary" : "btn-outline-success"
                          }`}
                          disabled={isAddedToMyQuotes}
                          onClick={() => handleAddToMyQuotes(r)}
                          aria-disabled={isAddedToMyQuotes}
                          aria-label={isAddedToMyQuotes ? "Already added to My Quotes" : "Add to My Quotes"}
                        >
                          {isAddedToMyQuotes ? "✓ Added" : "＋ Add to My Quotes"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default SearchQuotes;