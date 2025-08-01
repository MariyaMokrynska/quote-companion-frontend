import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Container, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import routes from "../routes";
import Footer from "../components/Footer";
import AddQuote from "../components/AddQuote";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [quoteCount, setQuoteCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [reflectionCount, setReflectionCount] = useState(0); 
  const [randomQuote, setRandomQuote] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const zenKey = import.meta.env.VITE_ZEN_QUOTES_API_KEY;

        // Fetch random quote
        const response = await fetch(`https://zenquotes.io/api/random/${zenKey}`);
        const data = await response.json();

        if (data && Array.isArray(data) && data[0]) {
          setRandomQuote({
            text: data[0].q,
            author: data[0].a || "Unknown",
          });
        }

        // Fetch user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Fetch user name
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("name")
          .eq("id", user.id)
          .maybeSingle();

        if (userData && userData.name) {
          setUserName(userData.name);
        } else if (userError) {
          console.error("Failed to fetch user name:", userError.message);
        }

        // Fetch quote count
        const { count: quoteTotal } = await supabase
          .from("quote")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setQuoteCount(quoteTotal || 0);

        // Fetch collection count
        const { count: collectionTotal } = await supabase
          .from("collection")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setCollectionCount(collectionTotal || 0);

        // Fetch favorite count
        const { count: favoriteTotal } = await supabase
          .from("favorite")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setFavoriteCount(favoriteTotal || 0);

        // Fetch reflection count
        const { count: reflectionTotal } = await supabase
          .from("mood_reflection")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setReflectionCount(reflectionTotal || 0);
      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar color="black" routes={routes} />

      {/* Main content area */}
      <div className="dashboard-main">
        {/* Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg" className="dashboard-navbar">
          <Container fluid className="justify-content-end">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">About</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">Log Out</NavLink>
                </li>
              </ul>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Dashboard Content */}
        <div className="main-content container-fluid py-4">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-6 fw-bolder text-dark mb-4">Welcome back, {userName}!</h1>
            {/* <h1 className="display-4 mb-0 text-dark">Welcome back, {userName}!</h1> */}
          </div>

          {/* Statistics Cards */}
          <div className="row g-4">
            {[
              { statClass: "bg-info text-info", label: "Quotes Saved", value: quoteCount },
              { statClass: "bg-info text-info", label: "Favorites", value: favoriteCount },
              { statClass: "bg-info text-info", label: "Collections", value: collectionCount },
              { statClass: "bg-info text-info", label: "Reflections Logged", value: reflectionCount },
            ].map((item, idx) => (
              <div className="col-12 col-md-6 col-lg-3" key={idx}>
                <div className="card stat-card border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{item.label}</h6>
                    <h4 className="mb-3">{item.value}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Activity Section */}
          <h5 className="card-title mb-0">
            Here’s a quote to brighten your day—save it if it speaks to you!
          </h5>

            <div className="row mt-3">
              <div className="col-12 col-md-6 mx-auto">
                <div
                  className="p-3 rounded"
                  style={{
                    border: "1px solid rgba(173, 216, 230, 0.4)",
                    backgroundColor: "rgba(70, 97, 106, 0.1)",
                    color: "rgba(14, 15, 15, 0.7)",
                  }}
                >
                  {randomQuote ? (
                    <>
                      <p className="mb-1 fs-5 fst-italic">"{randomQuote.text}"</p>
                      <footer className="blockquote-footer">{randomQuote.author}</footer>
                    </>
                  ) : (
                    <p className="text-muted fst-italic">Loading inspirational quote...</p>
                  )}

                </div>
              </div>
            </div>

          {/* Actions section */}
          <div className="actions-section">
            <h5 className="text-center fw-bolder text-dark mb-4">Actions</h5>
            <div className="button-group">
              <button 
                className="btn btn-primary action-button"
                data-bs-toggle="modal"
                data-bs-target="#addQuoteModal"
              >
                Add New Quote
              </button>
              <button 
                className="btn btn-primary action-button"
                  onClick={() => {
                      navigate("/myquotes");
                    } 
                  }              
              >View Collections
              </button>
              <button 
                className="btn btn-primary action-button"
                  onClick={() => {
                      navigate("/search");
                    } 
                  }        
              >Search Quotes
              </button>
              <button 
                className="btn btn-primary action-button"
                  onClick={() => {
                      navigate("/moodmirror");
                    } 
                  }        
              >Reflect Mood
              </button>
            </div>
          </div>

          {/* Add Quote Modal */}
          <AddQuote />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;