import { useState } from "react";
import api from "./utlis/api.js";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(formData)
    try {
      const response = await api.post(
        "/user/register",
        formData
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="register-card-box">
        <h2 className="auth-title">Create Account</h2>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-field-group">
            <label className="field-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              className="text-input-box"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-field-group">
            <label className="field-label">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              className="text-input-box"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-field-group">
            <label className="field-label">Password *</label>
            <input
              type="password"
              name="password"
              required
              className="text-input-box"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? "Registering account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-redirect-footer">
          Already have an account?{" "}
          <span className="footer-link" onClick={() => navigate("/login")}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}