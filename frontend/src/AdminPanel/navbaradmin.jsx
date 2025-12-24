import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavbarAdmin() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  // ✅ Load admin info from localStorage
  useEffect(() => {
    const adminData = localStorage.getItem("adminUser");
    
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdminName(parsed.username || parsed.email || "Admin");
    }
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
   setTimeout(()=>{ navigate("/auth/login/adminlogin")},2000);
  };

  return (
    <nav
      className="navbar navbar-expand-lg custom-navbar-container-admin position-absolute"
      style={{ left: 0, right: 0 }}
    >
      <div className="container">
        {/* Logo */}
        <NavLink
          to=""
          className="navbar-brand custom-logo"
          style={{ color: "#81A4A6", fontSize: "2rem" }}
        >
          Yum Yard
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto custom-nav-links">
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Dashboard
              </NavLink>
            </li>

            {/* Sales Report */}
            <li className="nav-item">
              <NavLink
                to="sales"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active text-primary fw-bold" : "")
                }
              >
                Sales Report
              </NavLink>
            </li>

            {/* Orders Report */}
            <li className="nav-item">
              <NavLink
                to="orders"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Orders Report
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-3">
          <p
            className="m-0 fw-bold text-dark"
            style={{ fontSize: "1rem", color: "#81A4A6" }}
          >
            Hi {adminName || "Admin"}
          </p>

          {/* ➜ acts as logout button */}
          <button
            onClick={handleLogout}
            className="btn"
            style={{
              background: "transparent",
              color: "#81A4A6",
              fontSize: "1.8rem",
              border: "none",
              cursor: "pointer",
            }}
            title="Logout"
          >
            ➜
          </button>
        </div>
      </div>
    </nav>
  );
}