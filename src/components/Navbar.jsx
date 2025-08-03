import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavbarComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
      <div className="w-100 px-4 d-flex justify-content-between align-items-center">
        <NavLink className="navbar-brand" to="/">
          Quote Companion
        </NavLink>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/logout" className="nav-link">
                Log Out
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
};

export default NavbarComponent;
