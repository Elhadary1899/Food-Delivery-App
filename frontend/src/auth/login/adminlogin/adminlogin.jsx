import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../../../assets/login.png";
import admin from "../../../assets/solar_user-bold.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { adminLogin } from "../../../services/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMsg("");

      // ✅ Send email as the `identifier`
      const res = await adminLogin(data.email, data.password);
      console.log("Admin login response:", res);

      const adminData = res.data;

      if (res.success && adminData.role === "Admin") {
        localStorage.setItem("adminToken", adminData.token);
        localStorage.setItem("adminUser", JSON.stringify(adminData));
        navigate("/admin");
      } else {
        setErrorMsg("Access denied. You’re not authorized as an admin.");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Styles
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#81A4A6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0",
  };

  const cardStyle = {
    display: "flex",
    width: "80%",
    maxWidth: "1000px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const leftPanelStyle = {
    flex: 1,
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
  };

  const rightPanelStyle = {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const inputGroupStyle = {
    backgroundColor: "#F2F4F7",
    borderRadius: "10px",
    border: "none",
    padding: "8px 15px",
    marginBottom: "8px",
  };

  const inputStyle = {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    width: "100%",
  };

  const iconStyle = {
    color: "#A0A0A0",
    marginRight: "10px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={leftPanelStyle}>
          <h2
            className="text-center"
            style={{ color: "#81A4A6", fontFamily: "Lobster, sans-serif" }}
          >
            YumYard
          </h2>

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-2" style={{ fontWeight: "500" }}>
              Admin Sign In
            </h4>
            <Link
              to="/auth/login"
              className="text-decoration-none text-dark d-flex flex-column justify-content-center align-items-center"
            >
              <img
                src={admin}
                alt="Admin Icon"
                className="mb-2"
                style={{ width: "40px", height: "40px" }}
              />
              <h6>User Login</h6>
            </Link>
          </div>

          {/* ⚠️ Error Message */}
          {errorMsg && (
            <p className="text-danger text-center fw-semibold">{errorMsg}</p>
          )}

          {/* ✅ Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 🎯 Email Field */}
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-envelope" style={iconStyle}></i>
              <input
                type="email"
                id="email"
                placeholder="Enter your admin email"
                style={inputStyle}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-danger mb-2" style={{ fontSize: "0.8rem" }}>
                {errors.email.message}
              </p>
            )}

            {/* 🔒 Password Field */}
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-lock" style={iconStyle}></i>
              <input
                type="password"
                id="password"
                placeholder="Enter your admin password"
                style={inputStyle}
                {...register("password", { required: "Password is required" })}
              />
              <i className="fas fa-eye-slash" style={iconStyle}></i>
            </div>
            {errors.password && (
              <p className="text-danger mb-2" style={{ fontSize: "0.8rem" }}>
                {errors.password.message}
              </p>
            )}

            {/* 🚀 Submit Button */}
            <button
              type="submit"
              className="btn w-100 mt-4"
              style={{
                backgroundColor: "#328286",
                color: "white",
                borderRadius: "15px",
                padding: "10px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* 🖼️ Right Panel */}
        <div style={rightPanelStyle}>
          <img
            src={image}
            alt="Delicious food"
            className="w-100 h-100"
            style={{ objectFit: "cover", opacity: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
}