import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get passed data from navigation state
  const { searchTerm, fullResults } = location.state || { searchTerm: "", fullResults: [] };

  return (
    <>
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

      {/* Results or no results */}
      <div className="container mt-5">
        {!fullResults || fullResults.length === 0 ? (
          <>
            <h3>No full results to display.</h3>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
          </>
        ) : (
          <>
            <h3>Full Results for "{searchTerm}" ({fullResults.length} results)</h3>
            {fullResults.map((quote) => (
              <div
                key={quote.id}
                style={{
                  border: "1px solid #add8e6",
                  backgroundColor: "#f0f8ff",
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                }}
              >
                <p style={{ fontStyle: "italic" }}>"{quote.text}"</p>
                <footer style={{ color: "#555" }}>{quote.author || "Unknown Author"}</footer>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back to Search</button>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container px-5">
          <p className="m-0 text-center text-white">Copyright &copy; 2025 Quote Companion</p>
          <p className="m-0 text-center text-white">
            Made by Jane K & Mariya M | ADA Developers Academy C23
          </p>
        </div>
      </footer>
    </>
  );
}
