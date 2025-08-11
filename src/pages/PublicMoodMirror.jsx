import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MoodMirrorContent from "../components/MoodMirrorContent";
import Footer from "../components/Footer";

export default function PublicMoodMirror() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Minimal public navbar (same vibe as LandingPage) */}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid px-5">
          <div className="navbar-brand">
            <span className="quote">Quote</span> <span className="companion">Companion</span>
          </div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
          </ul>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: "0" }}>
        <MoodMirrorContent
          isAuthed={false}
          onRequireAuth={() => navigate("/signup")}
        />
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}