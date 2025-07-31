import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Container, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import routes from "../routes";
import Footer from "../components/Footer";
import "./Dashboard.css";

function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("user")
          .select("name")
          .eq("id", user.id)
          .single();

        if (data && data.name) {
          setUserName(data.name);
        } else if (error) {
          console.error("Failed to fetch user name:", error.message);
        }
      }
    };

    fetchUserName();
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
            {[{ statClass: "bg-info text-info", label: "Quotes Saved", value: "$24,589" },
              { statClass: "bg-info text-info", label: "Favorites", value: "14,789" },
              { statClass: "bg-info text-info", label: "Collections", value: "1,589" },
              { statClass: "bg-info text-info", label: "Reflections Logged", value: "$45,289" }
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
                {/* <p className="mb-1 fs-5 fst-italic">"{quote.text}"</p>
                <footer className="blockquote-footer">
                  {quote.author || "Unknown Author"}
                </footer> */}
                <p className="mb-1 fs-5 fst-italic">
                  "You miss 100% of the shots you don't take."
                </p>
                <footer className="blockquote-footer">Wayne Gretzky</footer>
              </div>
            </div>
          </div>

          {/* Actions section */}
          <div className="actions-section">
            <h7 className="text-center fw-bolder text-dark mb-4">Actions</h7>
            <div className="button-group">
              <button className="btn btn-primary action-button">Add New Quote</button>
              <button className="btn btn-primary action-button">View Collections</button>
              <button className="btn btn-primary action-button">Search Quotes</button>
              <button className="btn btn-primary action-button">Reflect Mood</button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;