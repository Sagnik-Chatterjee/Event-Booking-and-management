import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import api from "./utlis/api.js"
import Navbar from "./Navbar"
import "./EventPage.css"
export function EventPage(){
    const {id}=useParams()
    const [event,setEvent]=useState({})
    useEffect(()=>{
        const getEvent=async()=>{
            const response=await api.get(`http://localhost:8000/events/event/${id}`)
            setEvent(response.data.data)
        }
        getEvent()
    },[id])
    return <>
    <Navbar/>
    {
  event ? (
    <div className="event-details-wrapper">
      <div className="event-details-card">

        {/* Poster */}
        <div className="event-poster-section">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="event-details-poster"
          />
        </div>

        {/* Event Information */}
        <div className="event-details-content">

          <h1 className="event-details-title">
            {event.title}
          </h1>

          <p className="event-details-description">
            {event.description}
          </p>

          <div className="event-details-info">

            <div className="event-info-item">
              <span className="info-label">Price</span>
              <span className="info-value">₹{event.price}</span>
            </div>

            <div className="event-info-item">
              <span className="info-label">Duration</span>
              <span className="info-value">
                {event.duration} hrs
              </span>
            </div>

            <div className="event-info-item">
              <span className="info-label">Date & Time</span>
              <span className="info-value">
                {new Date(event.date).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            <div className="event-info-item">
              <span className="info-label">City</span>
              <span className="info-value">
                {event.city}
              </span>
            </div>

            <div className="event-info-item">
              <span className="info-label">Venue</span>
              <span className="info-value">
                {event.venue}
              </span>
            </div>

            <div className="event-info-item">
              <span className="info-label">Organized By</span>
              <span className="info-value">
                {event.owner?.fullName}
              </span>
            </div>

          </div>

          <button className="book-tickets-btn">
            Book Tickets
          </button>

        </div>
      </div>
    </div>
  ) : (
    <div className="event-loading">
      Loading Event...
    </div>
  )
}
    </>
}