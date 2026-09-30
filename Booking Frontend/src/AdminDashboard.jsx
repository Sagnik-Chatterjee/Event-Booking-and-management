import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utlis/api.js";
import "./AdminDashboard.css"
import Navbar from "./Navbar.jsx";
export function AdminDashboard(){
    const[obj,setObj]=useState({})
    const navigate=useNavigate()
    useEffect(()=>{
        async function getNoOfUserAndEvents(){
            const response=await api.get('http://localhost:8000/admin/')
            setObj(response.data.data)
        }
        getNoOfUserAndEvents()
    },[])
    return <>
    <Navbar/>
    <div className="admin-dashboard">
  <h1 className="admin-dashboard-title">Admin Dashboard</h1>

  <div className="admin-stats-container">
    <div className="admin-stat-card users-card">
      <div className="admin-stat-label">Total Users</div>
      <div className="admin-stat-value">{obj.users || 0}</div>
    </div>

    <div className="admin-stat-card events-card">
      <div className="admin-stat-label">Total Events</div>
      <div className="admin-stat-value">{obj.events || 0}</div>
    </div>
  </div>

  <div className="admin-actions">
    <button
      className="admin-action-btn pending-btn"
      onClick={() => navigate("/admin/pending-events")}
    >
      View Pending Events
    </button>

    <button
      className="admin-action-btn expired-btn"
      onClick={() => navigate("/admin/expired-events")}
    >
      View Expired Events
    </button>
  </div>
</div>
    </>
}