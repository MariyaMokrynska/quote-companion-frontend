import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark ">
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
  );
}
