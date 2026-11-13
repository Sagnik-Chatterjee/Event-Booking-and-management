import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx"
import api from "./utlis/api.js";
import { useSeatContext } from "./context/SeatContext.jsx";
import { useNavigate } from "react-router-dom";
import { socket } from "./utlis/socket.js";
import "./SeatLayout.css"
import toast from "react-hot-toast";
export function SeatLayout(){
    const {id}=useParams()
    const[event,setEvent]=useState({})
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const[lockedSeats,setLockedSeats]=useState()
    const {selectedSeats,setSelectedSeats}=useSeatContext()
    const navigate=useNavigate()
    useEffect(()=>{
        const getEvent=async()=>{
            try{
                setLoading(true)
            const response=await api.get(`http://localhost:8000/events/event/${id}`)
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

    //Socket Code starts
    useEffect(()=>{
      console.log("useEffect executed:", id);
      setSelectedSeats([])
      if (!id) return;
      socket.emit("join-event",{eventId:id})
      socket.on("locked-seats-initials",({seatIds})=>{
        setLockedSeats(seatIds)
      })
      socket.on("seat-locked",({seatIds,eventId:incomingEventId,userId})=>{
         if (incomingEventId !== id) {
        return;
    }

    // Update locked seats
    setLockedSeats((prev) => [
        ...new Set([...prev, ...seatIds])
    ]);

    // Check whether the lock belongs to the current user
    const user = JSON.parse(localStorage.getItem("user"));

    if (userId === user._id) {
      console.log(event)
        const bookingData = {
            event: event,
            electedSeats: seatIds
        };

        localStorage.setItem(
            "bookingData",
            JSON.stringify(bookingData)
        );

        navigate("/checkout");
    }
      })

      socket.on('seat-unlocked',({eventId,seatIds,userId})=>{
        if(eventId!==id){
          return
        }
        setLockedSeats((prev)=>prev.filter((sid)=>!seatIds.includes(sid)))
      })
      socket.on("seat-lock-failed",({eventId,requested,alreadyLocked})=>{
        toast.error(`Some seats are already locked: ${alreadyLocked.join(", ")}`)
         setSelectedSeats((prev) =>
        prev.filter((seatId) => !alreadyLocked.includes(seatId))
    );
      })
    },[id,event])
    console.log(lockedSeats)

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
    const rowName = String.fromCharCode(65 + rowIndex);

    return (
        <div className="seat-row" key={rowName}>

            <div className="row-label">
                {rowName}
            </div>

            <div className="seats-container">

                {row.map((seat) => {

                    const isSelected = selectedSeats.includes(
                        seat.seatNumber
                    );

                    const isLocked = lockedSeats.includes(
                        seat.seatNumber
                    );

                    const isAvailable = seat.status === "Available";

                    return (
                        <button
                            key={seat.seatNumber}
                            type="button"
                            className={`seat
                                ${isSelected ? "selected" : ""}
                                ${!isAvailable ? "booked" : ""}
                                ${isLocked ? "locked" : ""}
                            `}
                            disabled={!isAvailable || isLocked}
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
        const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      toast.error("Please login first");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select seats");
      return;
    }

    socket.emit("lock-seats", {
      eventId: id,
      seatIds: selectedSeats,
      userId: user._id
    });
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