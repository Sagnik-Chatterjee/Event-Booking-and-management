
import "./CheckoutPage.css";

export const CheckoutPage = () => {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (!bookingData) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>No Booking Found</h2>
          <p>Please select an event and seats first.</p>
        </div>
      </div>
    );
  }

  const { event, electedSeats } = bookingData;

  const totalAmount = event.price * electedSeats.length;

  return (
    <div className="checkout-page">

      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="checkout-left">

          <h2 className="checkout-section-title">
            Event Details
          </h2>

          <div className="event-card">

            <img
              src={event.posterUrl}
              alt={event.title}
              className="checkout-event-image"
            />

            <div className="event-info">

              <h3>{event.title}</h3>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {new Date(event.date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>Venue:</strong> {event.venue}
              </p>

              <p>
                <strong>City:</strong> {event.city}
              </p>

              <p>
                <strong>Price per seat:</strong> ₹{event.price}
              </p>

            </div>
          </div>


          {/* =========================
              SELECTED SEATS
          ========================= */}

          <div className="selected-seats-card">

            <h2 className="checkout-section-title">
              Seats Selected
            </h2>

            <div className="selected-seats-text">
              {electedSeats.join(", ")}
            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="checkout-right">

          {/* =========================
              USER DETAILS
          ========================= */}

          <div className="checkout-block">

            <h2 className="checkout-section-title">
              User Details
            </h2>

            <div className="checkout-card user-details-card">

              <div className="user-detail-row">
                <strong>Full Name:</strong>
                <span>
                  {user?.fullName || "N/A"}
                </span>
              </div>

              <div className="user-detail-row">
                <strong>Email:</strong>
                <span>
                  {user?.email || "N/A"}
                </span>
              </div>

            </div>

          </div>


          {/* =========================
              PAYMENT SUMMARY
          ========================= */}

          <div className="checkout-block">

            <h2 className="checkout-section-title">
              Payment Summary
            </h2>

            <div className="checkout-card payment-card">

              <div className="payment-row">
                <span>Price per seat</span>

                <strong>
                  ₹{event.price}
                </strong>
              </div>

              <div className="payment-row">
                <span>Number of seats</span>

                <strong>
                  {electedSeats.length}
                </strong>
              </div>

              <div className="payment-row">
                <span>Subtotal</span>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>

              <div className="payment-total">
                <span>Total Amount</span>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>

              <button
                className="proceed-pay-button"
                onClick={() => {
                  console.log("Proceeding to payment...");
                }}
              >
                Proceed to Pay
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

