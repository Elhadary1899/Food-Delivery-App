import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth/loginuserSchema";
import { loginUser } from "../../services/auth/loginuser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../../assets/auth.png";
import admin from "../../assets/eos-icons_admin.png";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/"; // fallback if no redirect

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await loginUser(data);

    if (result.success) {
      await login(data, result.data.token);
      toast.success(result.message, { autoClose: 2000 });

      // ✅ after successful login, go back to original page or home
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 2000);
    } else {
      toast.error(result.message);
    }
  };

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
    backgroundColor: "#81A4A6",
    borderRadius: "20px",
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

  const iconStyle = { color: "#A0A0A0", marginRight: "10px" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Left Panel: Form */}
        <div style={leftPanelStyle}>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <h2
              className="text-center mt-5"
              style={{ color: "#81A4A6", fontFamily: "Lobster, sans-serif" }}
            >
              YumYard
            </h2>
          </NavLink>

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-2" style={{ fontWeight: "500" }}>
              Sign in
            </h4>
            <Link
              to="/auth/login/adminlogin"
              className="text-decoration-none text-dark d-flex flex-column justify-content-center align-items-center"
            >
              <img
                src={admin}
                alt="Admin Icon"
                className="mb-2"
                style={{ width: "40px", height: "40px" }}
              />
              <h6>admin Login</h6>
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="identifier">Email or Username</label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-user" style={iconStyle}></i>
              <input
                type="text"
                id="identifier"
                placeholder="Enter Email or Username"
                style={inputStyle}
                {...register("identifier")}
              />
            </div>
            {errors.identifier && (
              <p className="text-danger mb-2" style={{ fontSize: "0.8rem" }}>
                {errors.identifier.message}
              </p>
            )}

            <label htmlFor="password">Password</label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-lock" style={iconStyle}></i>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                style={inputStyle}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-danger mb-2" style={{ fontSize: "0.8rem" }}>
                {errors.password.message}
              </p>
            )}

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
            >
              Sign In
            </button>

            <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                style={{ color: "#328286", fontWeight: "600" }}
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        {/* Right Panel: Image */}
        <div style={rightPanelStyle}>
          <img
            src={image}
            alt="Delicious food in a bowl"
            className="w-100 h-100"
            style={{ objectFit: "cover", opacity: 0.8 }}
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}