import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "./Sidebar.css";

const Sidebar = ({ color = "dark", routes = [] }) => {
  const location = useLocation();

  const activeRoute = (routeName) =>
    location.pathname.includes(routeName) ? "active" : "";

  return (
    <div className={`sidebar sidebar-${color}`}>
      <div className="sidebar-wrapper">
        <Nav className="flex-column">
          {routes.map((prop, key) => {
            if (!prop.redirect) {
              return (
                <li
                  key={key}
                  className={`nav-item ${
                    prop.upgrade ? "active active-pro" : activeRoute(prop.layout + prop.path)
                  }`}
                >
                  <NavLink
                    to={prop.path}
                    className={({ isActive }) =>
                      isActive ? "nav-link fs-5 active" : "nav-link fs-5"
                    }
                  >
                    {prop.name}
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
