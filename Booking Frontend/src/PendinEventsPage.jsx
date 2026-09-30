import { useEffect,useState } from "react";
import api from "./utlis/api.js";
import Navbar from "./Navbar.jsx";
import "./PendingEventsPage.css"
export function PendingEventsPage(){
    const[events,setEvents]=useState([])
    const[loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    useEffect(()=>{
        async function getPendingEvents(){
            const response=await api.get("http://localhost:8000/admin/pending")
            console.log(response.data.data.events)
            setEvents(response.data.data.events)
        }
        getPendingEvents()
    },[])
    const handleConfirm=async(id)=>{
        try{
        setLoading(true)
        const response= await api.put(`http://localhost:8000/admin/confirm/${id}`)
        setLoading(false)
        window.location.reload();
    }catch(e){
        setLoading(false)
        setError(e.message)
    }
    }
    const handleRemove=async(id)=>{
        try{
        setLoading(true)
        const response= await api.delete(`http://localhost:8000/admin/delete/${id}`)
        setLoading(false)
        window.location.reload();
    }catch(e){
        setLoading(false)
        setError(e.message)
    }
    }
    return <>
    <Navbar/>
    {error && (
  <div className="admin-error-message">
    {error}
  </div>
)}
    { events?
    <ul>
        {events && events.length > 0 ? (
  <ul className="admin-events-list">
    {events.map((e) => (
      <li className="admin-event-card" key={e._id}>
        
        <img
          src={e.posterUrl}
          alt={e.title}
          className="admin-event-poster"
        />

        <div className="admin-event-content">
          <h2 className="admin-event-title">
            {e.title}
          </h2>

          <p className="admin-event-description">
            {e.description}
          </p>

          <div className="admin-event-details">

            <div className="admin-event-detail">
              <span>Price</span>
              <strong>₹{e.price}</strong>
            </div>

            <div className="admin-event-detail">
              <span>Duration</span>
              <strong>{e.duration} hrs</strong>
            </div>

            <div className="admin-event-detail">
              <span>Date & Time</span>
              <strong>
                {new Date(e.date).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}
              </strong>
            </div>

            <div className="admin-event-detail">
              <span>City</span>
              <strong>{e.city}</strong>
            </div>

            <div className="admin-event-detail">
              <span>Venue</span>
              <strong>{e.venue}</strong>
            </div>

            <div className="admin-event-detail">
              <span>Organizer</span>
              <strong>{e.owner?.fullName || "Unknown"}</strong>
            </div>

          </div>

          <div className="admin-event-actions">

            <button
              className="confirm-event-btn"
              onClick={() => handleConfirm(e._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Confirming...
                </>
              ) : (
                "Confirm Event"
              )}
            </button>

            <button
              className="remove-event-btn"
              onClick={() => handleRemove(e._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Removing...
                </>
              ) : (
                "Remove Event"
              )}
            </button>

          </div>
        </div>

      </li>
    ))}
  </ul>
) : (
  <div className="admin-events-empty">
    <h3>No Events Found</h3>
    <p>There are currently no pending events to display.</p>
  </div>
)}
    </ul>: <div>Getting events</div>
}
    </>
}