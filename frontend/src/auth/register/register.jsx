import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/auth/registerSchema";
import { registerUser } from "../../services/auth/register";
import image from "../../assets/register.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);

      if (result.success) {
        // ✅ عرض toast بالنجاح
        toast.success(`User registered successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // ⏱ إعادة التوجيه بعد 3 ثواني
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      } else {
        toast.error(result.message || "Registration failed", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
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
    justifyContent: "center",
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

  const iconStyle = {
    color: "#A0A0A0",
    marginRight: "10px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Left Panel: Form */}
        <div style={leftPanelStyle}>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <h2
              className="text-center"
              style={{ color: "#81A4A6", fontFamily: "Lobster, sans-serif" }}
            >
              YumYard
            </h2>
          </NavLink>
          <h4 className="mb-3" style={{ fontWeight: "700" }}>
            Sign Up
          </h4>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <label htmlFor="username">Username</label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-user" style={iconStyle}></i>
              <input
                type="text"
                id="username"
                placeholder="Enter Your Username"
                style={inputStyle}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-danger" style={{ fontSize: "0.8rem" }}>
                {errors.username.message}
              </p>
            )}

            {/* Email */}
            <label htmlFor="email">Email</label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-envelope" style={iconStyle}></i>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                style={inputStyle}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-danger" style={{ fontSize: "0.8rem" }}>
                {errors.email.message}
              </p>
            )}

            {/* Password */}
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
              <p className="text-danger" style={{ fontSize: "0.8rem" }}>
                {errors.password.message}
              </p>
            )}

            {/* Phone */}
            <label htmlFor="phone">Phone</label>
            <div className="d-flex align-items-center" style={inputGroupStyle}>
              <i className="fas fa-phone" style={iconStyle}></i>
              <input
                type="text"
                id="phone"
                placeholder="Enter Your Phone"
                style={inputStyle}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-danger" style={{ fontSize: "0.8rem" }}>
                {errors.phone.message}
              </p>
            )}

            {/* Marketing Opt */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                id="marketing_opt"
                className="form-check-input"
                {...register("marketing_opt")}
              />
              <label htmlFor="marketing_opt" className="form-check-label">
                I agree to receive marketing emails
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#328286",
                color: "white",
                borderRadius: "15px",
                padding: "10px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              Sign Up
            </button>

            {/* Login Link */}
            <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <a
                href="/auth/login"
                style={{ color: "#328286", fontWeight: "600" }}
              >
                Log in
              </a>
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

      {/* Toast Container */}
      <ToastContainer rtl={true} />
    </div>
  );
}
