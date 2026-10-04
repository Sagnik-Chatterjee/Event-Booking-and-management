import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx"
import api from "./utlis/api.js";
import { useSeatContext } from "./context/SeatContext.jsx";
import "./SeatLayout.css"
export function SeatLayout(){
    const {id}=useParams()
    const[event,setEvent]=useState({})
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {selectedSeats,setSelectedSeats}=useSeatContext()
    useEffect(()=>{
        const getEvent=async()=>{
            try{
                setLoading(true)
            const response=await api.get(`http://localhost:8000/events/event/${id}`)
            console.log(response.data.data[0])
            setEvent(response.data.data[0])
            setLoading(false)
            }catch(e){
                setError(e.message)
            }
        }
        getEvent()
    },[id])
    function handleSelectSeat(rowName,seatNumber){
        setSelectedSeats((prev)=>
          prev.includes(seatNumber)? prev.filter((existing)=>existing!==seatNumber): [...prev,seatNumber]
        )
    }

    if (loading) {
    return <p>Loading seat layout...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
    <Navbar/>
    <h1>{event.title}</h1>
      <h2>Seat Layout</h2>
    <div className="seat-layout-page">

      <h2 className="seat-layout-title">
        Select Your Seats
      </h2>

      <div className="seat-price">
        Price per seat: ₹{event.price}
      </div>
      <div className="seat-layout">

        {event.seatLayout.map((row, rowIndex) => {
          const rowName = String.fromCharCode(
            65 + rowIndex
          );

          return (
            <div
              className="seat-row"
              key={rowName}
            >

              {/* Row number/name */}
              <div className="row-label">
                {rowName}
              </div>

              {/* Seats */}
              <div className="seats-container">

                {row.map((seat) => {

                  const isSelected =
                    selectedSeats.includes(
                      seat.seatNumber
                    );

                  const isAvailable =
                    seat.status === "Available";

                  return (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      className={`seat
                        ${isSelected ? "selected" : ""}
                        ${!isAvailable ? "booked" : ""}
                      `}
                      disabled={!isAvailable}
                      onClick={() =>
                        handleSelectSeat(
                          rowName,
                          seat.seatNumber
                        )
                      }
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}

              </div>
            </div>
          );
        })}

      </div>

      {/* Legend */}
      <div className="seat-legend">

        <div className="legend-item">
          <span className="legend-box available"></span>
          Available
        </div>

        <div className="legend-item">
          <span className="legend-box selected"></span>
          Selected
        </div>

        <div className="legend-item">
          <span className="legend-box booked"></span>
          Booked
        </div>

      </div>

      {/* Selected seats */}
      <div className="seat-summary">

        <p>
          <strong>Selected Seats:</strong>{" "}
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None"}
        </p>

        <p>
          <strong>Total Seats:</strong>{" "}
          {selectedSeats.length}
        </p>

        <p>
          <strong>Total Price:</strong>{" "}
          ₹{selectedSeats.length * event.price}
        </p>
        {selectedSeats.length > 0 && (
  <div className="checkout-section">
    <button
      type="button"
      className="checkout-button"
      onClick={() => {
        console.log("Proceed to checkout")
      }}
    >
      Proceed to Checkout
    </button>
  </div>
)}

      </div>

    </div>
    </>
  );

}