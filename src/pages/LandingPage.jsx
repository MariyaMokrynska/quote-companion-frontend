import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import pencilIcon from "../assets/pencil.png";
import collectionIcon from "../assets/collection.png";
import moodIcon from "../assets/mood.png";
import trackerIcon from "../assets/tracker.png";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

// Keywords list
const keywordList = [
  "Anxiety", "Change", "Choice", "Confidence", "Courage", "Death", "Dreams", "Excellence",
  "Failure", "Fairness", "Fear", "Forgiveness", "Freedom", "Future", "Happiness", "Inspiration",
  "Kindness", "Leadership", "Life", "Living", "Love", "Pain", "Past", "Success", "Time", "Today",
  "Truth", "Work"
];

// Authors list
const authorList = [
  "A.a. Milne", "Abraham Lincoln", "Adi Da Samraj", "Alan Watts", "Albert Einstein", "Albus Dumbledore",
  "Alexander Graham Bell", "Alexander Pope", "Alexandre Dumas", "Alfred Adler", "Amelia Earhart",
  "Andrew Carnegie", "Andrew Hendrixson", "Anita Krizzan", "Anne Frank", "Anne Wilson Schaef",
  "Aristophanes", "Aristotle", "Arnold Schwarzenegger", "Audrey Hepburn", "Ayn Rand", "Babe Ruth",
  "Barack Obama", "Benjamin Franklin", "Benjamin Mays", "Bette Midler", "Betty White", "Beverly Sills",
  "Bhagavad Gita", "Billie Jean King", "Bob Dylan", "Bob Marley", "Bob Proctor", "Bodhidharma",
  "Brian Tracy", "Bruce Lee", "Buddha", "C. Sean Mcgee", "Candice Carpenter", "Carl Bard", "Carl Jung",
  "Carlos Ruiz Zafon", "Carol Burnett", "Celestine Chua", "Charles Darwin", "Charles Dickens",
  "Charles Spurgeon", "Charles Swindoll", "Charlie Chaplin", "Cherie Gilderbloom", "Cherralea Morgen",
  "Chinese Proverb", "Christopher Columbus", "Christopher McCandless", "Christopher Reeve", "Coco Chanel",
  "Colin Powell", "Colin R. Davis", "Confucius", "Conrad Hilton", "Criss Jami", "D. H. Lawrence",
  "Dalai Lama", "Dale Carnegie", "Dan Brown", "Dan Millman", "David Brinkley", "Deepak Chopra",
  "Deepam Chaterjee", "Denis Waitley", "Dogen", "Doug Ivester", "Dr. Seuss", "Dudley Field Malone",
  "Earl Nightingale", "Eckhart Tolle", "Edgar Allan Poe", "Elbert Hubbard", "Eleanor Roosevelt",
  "Elon Musk", "Elvis Presley", "Emily Dickinson", "Epictetus", "Eric Hoffer", "Estee Lauder",
  "Euripides", "F. Scott Fitzgerald", "Franklin D. Roosevelt", "Franz Kafka", "G.i. Gurdjieff",
  "Gabor Mate", "Gary Keller", "Genghis Khan", "George Addair", "George Bernard Shaw", "George Eliot",
  "George Washington", "Gilbert Chesterton", "Grace Coddington", "Gurbaksh Chahal", "Gustave Flaubert",
  "Hans Christian Andersen", "Harry S. Truman", "Helen Keller", "Henry David Thoreau", "Henry Ford",
  "Henry Ward Beecher", "Heraclitus", "Herbert Hoover", "Herman Melville", "Herodotus",
  "Honore de Balzac", "Huang Po", "Isaac Newton", "J.r.r. Tolkien", "Jack Butcher", "Jack Kerouac",
  "Jack London", "James Allen", "James Cameron", "James Matthew Barrie", "Jeffrey Gitomer",
  "Jiddu Krishnamurti", "Jim Rohn", "Joan Rivers", "Johann Wolfgang von Goethe", "John Carmack",
  "John D. Rockefeller", "John Eliot", "John Lennon", "John Locke", "John Tukey", "John Wooden",
  "Jon Kabat-Zinn", "Jonathan Swift", "Josh Waitzkin", "Joyce Meyer", "Judy Garland", "Kabir",
  "Kahlil Gibran", "Kamal Ravikant", "Kenji Miyazawa", "Kenneth Branagh", "Kilian Jornet", "Lao Tzu",
  "Laurence J. Peter", "Leo Tolstoy", "Leonardo da Vinci", "Les Brown", "Lily Tomlin", "Lin Yutang",
  "Lolly Daskal", "Mae West", "Mahatma Gandhi", "Marcus Aurelius", "Margaret Mead", "Marilyn Monroe",
  "Mark Manson", "Mark Twain", "Martin Luther", "Martin Luther King, Jr.", "Mary Engelbreit",
  "Maxime Lagace", "Maya Angelou", "Meister Eckhart", "Michael Jordan", "Miguel de Cervantes",
  "Ming-Dao Deng", "Morgan Wootten", "Morihei Ueshiba", "Mother Teresa", "Napoleon Hill",
  "Naval Ravikant", "Neil Barringham", "Nelson Mandela", "Niccolo Machiavelli", "Nicolas Chamfort",
  "Nikola Tesla", "Norman Vaughan", "Norman Vincent Peale", "Og Mandino", "Oprah Winfrey",
  "Orison Swett Marden", "Oscar Wilde", "Osho", "Pablo Picasso", "Paramahansa Yogananda",
  "Paulo Coelho", "Pema Chodron", "Peter A. Cohen", "Peter Drucker", "Plato", "Publilius Syrus",
  "Ralph Marston", "Ralph Waldo Emerson", "Ray Bradbury", "Richard Bach", "Rita Mae Brown",
  "Robert Browning", "Robert Collier", "Robert F. Kennedy", "Robert Frost", "Robert Greene",
  "Robert Kiyosaki", "Robin Sharma", "Robin Williams", "Roger Lee", "Ronald Reagan",
  "Rosa Nouchette Carey", "Roy T. Bennett", "Rumi", "Samuel Beckett", "Samuel Butler", "Sathya Sai Baba",
  "Seneca", "Seungsahn", "Shahir Zag", "Shunryu Suzuki", "Sigmund Freud", "Simon Sinek", "Socrates",
  "Sonia Ricotti", "Soren Kierkegaard", "Soyen Shaku", "Spencer Johnson", "St. Jerome", "Stephen Hawking",
  "Stephen King", "Steve Harvey", "Steve Jobs", "Steve Maraboli", "Sun Tzu", "Sydney Smith", "T.s. Eliot",
  "Theodore Roosevelt", "Thich Nhat Hanh", "Thomas Edison", "Thomas Jefferson", "Toni Morrison",
  "Tony Robbins", "Unknown", "Vaclav Havel", "Vidal Sassoon", "Vince Lombardi", "Vincent van Gogh",
  "Virginia Woolf", "Voltaire", "W. Clement Stone", "W.p. Kinsella", "Walt Disney", "Walt Whitman",
  "Wayne Dyer", "Wayne Gretzky", "Will Rogers", "William Faulkner", "William James", "Winston Churchill",
  "Woody Allen", "Yanni", "Yoko Ono", "Zen Proverb", "Zhuangzi", "Zig Ziglar"
];

export default function LandingPage() {
  const navigate = useNavigate();

  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Supabase auth session and state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search handler (your existing search logic)
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setSearchError(null);
    setHasSearched(true);
    setLoading(true);

    try {
      const { data: localData, error } = await supabase
        .from("quote")
        .select("*")
        .or(`author.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`);

      if (error) {
        console.error("Supabase error:", error);
      }

      let results = localData || [];

      if (results.length === 0) {
        const zenKey = import.meta.env.VITE_ZEN_QUOTES_API_KEY;
        const keyword = encodeURIComponent(searchTerm.toLowerCase());

        let apiData = [];
        let zenError = false;

        try {
          const response = await fetch(
            `https://zenquotes.io/api/quotes/${zenKey}&keyword=${keyword}`
          );
          apiData = await response.json();

          if (!Array.isArray(apiData) || apiData.message) {
            zenError = true;
          }
        } catch (e) {
          zenError = true;
          console.error("ZenQuotes keyword search failed:", e);
        }

        if (zenError || apiData.length === 0) {
          try {
            const authorKeyword = searchTerm.toLowerCase().replace(/\s+/g, "-");
            const authorResponse = await fetch(
              `https://zenquotes.io/api/quotes/author/${authorKeyword}/${zenKey}`
            );
            const authorData = await authorResponse.json();

            if (Array.isArray(authorData) && authorData.length > 0) {
              apiData = authorData;
            }
          } catch (e) {
            console.error("ZenQuotes author search failed:", e);
          }
        }

        if (!apiData || apiData.length === 0 || apiData.message) {
          setSearchResults([]);
          setSearchError("No quotes found.");
        } else {
          const formattedQuotes = apiData.map((quote, index) => ({
            id: `zen-${index}`,
            text: quote.q,
            author: quote.a || "Unknown",
            source: "ZenQuotes",
          }));
          results = formattedQuotes;
        }
      }
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("An unexpected error occurred.");
      setSearchResults([]);
    }

    setLoading(false);
  };

  // Navigate to full results page
  const handleSeeFullList = () => {
    navigate("/search-results", { state: { searchTerm, fullResults: searchResults } });
  };

  return (
    <div className="flex-grow-1 d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid px-5 no-margin-container">
          <div className="navbar-brand navbar-brand-custom">
            <span className="quote">Quote</span>{" "}
            <span className="companion">Companion</span>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="landing-main-content">
        {/* Hero Section */}
        <section className="bg-dark py-5">
          <div className="container px-5">
            <div className="row gx-5 justify-content-center">
              <div className="col-lg-6">
                <div className="text-center my-5">
                  <h1 className="display-6 fw-bolder text-white mb-4">
                    Your personal quote library + emotional mirror
                  </h1>
                  <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                    <button
                      className="btn btn-primary btn-lg px-4 me-sm-3"
                      onClick={() => {
                        if (isLoggedIn) {
                          navigate("/mycollections");
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      Start Your Collection
                    </button>
                    <button
                      className="btn btn-outline-light btn-lg px-4"
                      onClick={() => {
                        if (isLoggedIn) {
                          navigate("/mood-mirror");
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      Try Mood Mirror
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <div className="container my-2 mt-5">
          <h4 className="text-center mb-4">Search Quotes</h4>

          {/* Full-width Search Bar */}
          <div className="row mb-3">
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Search by keyword or author, e.g. love, Oscar Wilde"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: "48px" }}
              />
            </div>
          </div>

          {/* Dropdowns + Search Button */}
          <div className="row g-2">
            <div className="col-md-5">
              <select
                className="form-select"
                aria-label="Search by Keyword"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={keywordList.includes(searchTerm) ? searchTerm : ""}
                style={{ height: "48px" }}
              >
                <option value="">Select Keyword</option>
                {keywordList.map((keyword) => (
                  <option key={keyword} value={keyword}>
                    {keyword}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-5">
              <select
                className="form-select"
                aria-label="Search by Author"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={authorList.includes(searchTerm) ? searchTerm : ""}
                style={{ height: "48px" }}
              >
                <option value="">Select Author</option>
                {authorList.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 d-grid">
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                style={{ height: "48px" }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {searchError && <div className="alert alert-danger mt-3">{searchError}</div>}

        {/* Results */}
        {hasSearched && (
          <section className="bg-dark py-4 mt-4">
            <div className="container px-5 text-center">
              {loading ? (
                <p className="text-white fs-5">Searching...</p>
              ) : searchResults.length > 0 ? (
                <>
                  <h5 className="text-white fw-bold mb-4">
                    Showing {Math.min(searchResults.length, 10)} of {searchResults.length} results
                  </h5>
                  <div className="row gx-3">
                    {searchResults.slice(0, 10).map((quote) => (
                      <div key={quote.id} className="col-12 mb-3">
                        <div
                          className="p-3 rounded"
                          style={{
                            border: "1px solid rgba(173, 216, 230, 0.4)",
                            backgroundColor: "rgba(173, 216, 230, 0.1)",
                            color: "#e0f0ff",
                          }}
                        >
                          <p className="mb-1 fs-5 fst-italic">"{quote.text}"</p>
                          <footer
                            className="blockquote-footer"
                            style={{ color: "rgba(224, 240, 255, 0.7)" }}
                          >
                            {quote.author || "Unknown Author"}
                          </footer>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchResults.length > 10 && (
                    <button
                      className="btn btn-outline-light mt-3"
                      onClick={handleSeeFullList}
                    >
                      See Full List
                    </button>
                  )}
                </>
              ) : (
                <p className="text-white fs-5">No quotes found for "{searchTerm}".</p>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-5 border-bottom">
          <div className="container px-5 my-5">
            <div className="row gx-5">
              {/* Pencil Icon Feature */}
              <div className="col-lg-3 mb-5 mb-lg-0">
                <div
                  className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                  <img
                    src={pencilIcon}
                    alt="Pencil Icon"
                    style={{ maxWidth: "110%", maxHeight: "110%" }}
                  />
                </div>
                <h2 className="h4 fw-bolder">Save Personal Quotes</h2>
                <p>From books, films, or life</p>
              </div>

              {/* Collection Icon Feature */}
              <div className="col-lg-3 mb-5 mb-lg-0">
                <div
                  className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                  <img
                    src={collectionIcon}
                    alt="Collection Icon"
                    style={{ maxWidth: "110%", maxHeight: "110%" }}
                  />
                </div>
                <h2 className="h4 fw-bolder">Collections</h2>
                <p>Organize by Collections</p>
              </div>

              {/* Mood Icon Feature */}
              <div className="col-lg-3 mb-5 mb-lg-0">
                <div
                  className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                  <img
                    src={moodIcon}
                    alt="Mood Icon"
                    style={{ maxWidth: "110%", maxHeight: "110%" }}
                  />
                </div>
                <h2 className="h4 fw-bolder">Reflect With Mood Mirror</h2>
                <p>AI-powered emotional quotes</p>
              </div>

              {/* Tracker Icon Feature */}
              <div className="col-lg-3 mb-5 mb-lg-0">
                <div
                  className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                  <img
                    src={trackerIcon}
                    alt="Tracker Icon"
                    style={{ maxWidth: "110%", maxHeight: "110%" }}
                  />
                </div>
                <h2 className="h4 fw-bolder">Track Your Mood Over Time</h2>
                <p></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container px-5">
          <p className="m-0 text-center text-white">Copyright &copy; 2025 Quote Companion</p>
          <p className="m-0 text-center text-white">
            Made by Jane K & Mariya M | ADA Developers Academy C23
          </p>
        </div>
      </footer>
    </div>
  );
}
