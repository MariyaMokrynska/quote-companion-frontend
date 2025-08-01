import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get passed data from navigation state
  const { searchTerm, fullResults } = location.state || { searchTerm: "", fullResults: [] };

  if (!fullResults || fullResults.length === 0) {
    return (
      <div className="container mt-5">
        <h3>No full results to display.</h3>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
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
      <button onClick={() => navigate(-1)}>Back to Search</button>
    </div>
  );
}
