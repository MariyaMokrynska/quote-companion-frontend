import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ color, routes }) => {
  return (
    <div
      className={`bg-${color} position-fixed`}
      style={{ width: "250px", minHeight: "100vh", left: 0, top: 0, zIndex: 1030 }}
    >
      <div className="p-3 mt-5">
        <ul className="nav flex-column">
          {routes.map((prop, key) => {
            if (!prop.redirect) {
              return (
                <li key={key} className="nav-item text-start">
                  <NavLink
                    to={prop.path}
                    className={({ isActive }) =>
                      isActive ? "nav-link active text-light fs-5" : "nav-link text-light fs-5"
                    }
                  >
                    {prop.name}
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;