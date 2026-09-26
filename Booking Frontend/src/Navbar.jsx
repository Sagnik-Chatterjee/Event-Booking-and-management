import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChangeCity = () => {
    navigate("/");
  };

  const handleAddEvent = () => {
    navigate("/add-event");
  };

  const handleUpcomingEvents = () => {
    navigate("/upcoming-events");
    setShowDropdown(false);
  };

  const handleAdminDashboard = () => {
    navigate("/admin");
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div
        className="navbar-logo"
      >
        Event Booking
      </div>

      <div className="navbar-right">

        {/* Change City */}
        <button
          className="change-city-btn"
          onClick={handleChangeCity}
        >
          Change City
        </button>

        {/* Add Event */}
        <button
          className="add-event-btn"
          onClick={handleAddEvent}
        >
          + Add Event
        </button>

        <div className="profile-container">

          <button
            className="profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="profile-icon">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>

            <span className="profile-name">
              {user?.fullName || "User"}
            </span>

            <span className="dropdown-arrow">
              {showDropdown ? "▲" : "▼"}
            </span>
          </button>

          {showDropdown && (
            <div className="profile-dropdown">

              {/* Upcoming Events */}
              <button onClick={handleUpcomingEvents}>
                My Upcoming Events
              </button>
              {user?.role==="ADMIN" &&
              <button onClick={handleAdminDashboard}>
                Admin Dashboard
              </button>
}

              <div className="dropdown-divider"></div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;