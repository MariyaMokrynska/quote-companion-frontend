import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import pencilIcon from "../assets/pencil.png";
import collectionIcon from "../assets/collection.png";
import moodIcon from "../assets/mood.png";
import trackerIcon from "../assets/tracker.png";
import { Link } from "react-router-dom";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../services/supabaseClient"; // adjust the path if needed



export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = false; 

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);  
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

/*   const handleSearch = async () => {
  if (!searchTerm.trim()) return;

  setSearchError(null);
  setHasSearched(true);
  setLoading(true);

  try {
    // Step 1: Search Supabase
      const { data: localData, error } = await supabase
        .from("quote")
        .select("*")
        .or(`author.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`);

      if (error) {
        console.error("Supabase error:", error);
      }


    let results = localData || [];

    // Step 2: If no results or to combine, search ZenQuotes
    if (results.length === 0) {
      const zenKey = import.meta.env.VITE_ZEN_QUOTES_API_KEY;
      const response = await fetch(
  `https://zenquotes.io/api/quotes/${zenKey}&keyword=${encodeURIComponent(searchTerm.toLowerCase())}`
);

      const apiData = await response.json();

      if (!apiData || apiData.length === 0 || apiData.message) {
        // API might return an error message in case of no result
        setSearchResults([]);
        setSearchError("No quotes found.");
      } else {
        // Format ZenQuotes data to match Supabase structure
        const formattedQuotes = apiData.map((quote, index) => ({
          id: `zen-${index}`,
          text: quote.q,
          author: quote.a || "Unknown",
          source: "ZenQuotes"
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
}; */
const handleSearch = async () => {
  if (!searchTerm.trim()) return;

  setSearchError(null);
  setHasSearched(true);
  setLoading(true);

  try {
    // Step 1: Search Supabase (case-insensitive)
    const { data: localData, error } = await supabase
      .from("quote")
      .select("*")
      .or(`author.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`);

    if (error) {
      console.error("Supabase error:", error);
    }

    let results = localData || [];

    // Step 2: Fallback to ZenQuotes text search
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

        // Check if API returned error
        if (!Array.isArray(apiData) || apiData.message) {
          zenError = true;
        }
      } catch (e) {
        zenError = true;
        console.error("ZenQuotes keyword search failed:", e);
      }

      // Step 3: If keyword search fails or returns no results, try author search
      if (zenError || apiData.length === 0) {
        try {
          const authorKeyword = searchTerm.toLowerCase().replace(/\s+/g, "-"); // e.g. "Oscar Wilde" -> "oscar-wilde"
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


/*   const handleSearch = async () => {
      if (!searchTerm.trim()) {
      // Don't search if empty term
      return;
    }
    setSearchError(null);
    setHasSearched(true);
    setLoading(true); // Start loading */

  /* to allow searching by quote text */ 
/*   const { data, error } = await supabase
  .from("quote")
  .select("*")
  .or(`author.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`); 

 if (error) {
      setSearchError("Failed to fetch quotes.");
      setSearchResults([]);
      console.error(error);
    } else {
      setSearchResults(data || []);
    }
     setLoading(false); // Done loading
};
*/
  return (
  <div className="landing-page-wrapper">
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
                  <a className="btn btn-outline-light btn-lg px-4" href="#!">
                    Try Mood Mirror
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <div className="container my-2 mt-5">
        <h4 className="text-center mb-4">Search Quotes</h4>
        <div className="row mb-3">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control h-100"
              placeholder="Search by keyword or full author name, e.g. love, Oscar Wilde"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary w-100 h-100"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Dropdowns */}
{/*         <div className="row">
          <div className="col-md-4 mb-2">
            <select className="form-select" aria-label="Author dropdown">
              <option defaultValue>Filter by Author</option>
              <option value="1">Oscar Wilde</option>
              <option value="2">Author 2</option>
              <option value="3">Author 3</option>
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <select className="form-select" aria-label="Category dropdown">
              <option defaultValue>Filter by Category</option>
              <option value="1">Inspiration</option>
              <option value="2">Life</option>
              <option value="3">Motivation</option>
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <select className="form-select" aria-label="Source dropdown">
              <option defaultValue>Filter by Source</option>
              <option value="1">Book</option>
              <option value="2">Speech</option>
              <option value="3">Interview</option>
            </select>
          </div>
        </div> */}
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="alert alert-danger mt-3">{searchError}</div>
      )}

      {/* Results */}
      {hasSearched && (
        <section className="bg-dark py-4 mt-4">
          <div className="container px-5 text-center">
            {loading ? (
              <p className="text-white fs-5">Searching...</p>
            ) : searchResults.length > 0 ? (
              <>
                <h5 className="text-white fw-bold mb-4">
                  Search Results ({searchResults.length})
                </h5>
                <div className="row gx-3">
                  {searchResults.map((quote) => (
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
                        <footer className="blockquote-footer" style={{ color: "rgba(224, 240, 255, 0.7)" }}>
                          {quote.author || "Unknown Author"}
                      </footer>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-white fs-5 fst-italic">
                No quotes found matching your search.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-5 border-bottom">
        <div className="container px-5 my-5">
          <div className="row gx-5">
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img src={pencilIcon} alt="Pencil Icon" style={{ maxWidth: "110%", maxHeight: "110%" }} />
              </div>
              <h2 className="h4 fw-bolder">Save Personal Quotes</h2>
              <p>From books, films, or life</p>
            </div>

            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img src={collectionIcon} alt="Collection Icon" style={{ maxWidth: "110%", maxHeight: "110%" }} />
              </div>
              <h2 className="h4 fw-bolder">Collections</h2>
              <p>Organize by Collections</p>
            </div>

            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img src={moodIcon} alt="Mood Icon" style={{ maxWidth: "110%", maxHeight: "110%" }} />
              </div>
              <h2 className="h4 fw-bolder">Reflect With Mood Mirror</h2>
              <p>AI-powered emotional quotes</p>
            </div>

            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img src={trackerIcon} alt="Tracker Icon" style={{ maxWidth: "110%", maxHeight: "110%" }} />
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
        <p className="m-0 text-center text-white">
          Copyright &copy; 2025 Quote Companion
        </p>
        <p className="m-0 text-center text-white">
          Made by Jane K & Mariya M | ADA Developers Academy C23
        </p>
      </div>
    </footer>
  </div>
);
}