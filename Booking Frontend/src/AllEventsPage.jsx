import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import api from "./utlis/api.js"
import "./AllEventsPage.css"
export default function AllEvents(){
    const [events,setEvents]=useState([])
const {city}=useParams()
useEffect(()=>{
        async function getEvents(){
            const response=await api.get(`http://localhost:8000/events/${city}`)
            console.log(response.data.data)
            setEvents(response.data.data)
        }
        getEvents()
    },[city])
return <>
<h1>{city}</h1>
<ul className="events-list">
  {events.map((e) => {
    const formattedDate = new Date(e.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return (
      <li className="event-card" key={e._id}>
        <img src={e.posterUrl} alt={e.title} />

        <div className="event-info">
          <h3>{e.title}</h3>

          <p>
            <strong>Owner:</strong> {e.owner}
          </p>

          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
        </div>
      </li>
    );
  })}
</ul>
</>
}