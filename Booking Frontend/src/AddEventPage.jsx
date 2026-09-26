import api from "./utlis/api.js"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar.jsx"
import './AddEventPage.css'
export default function AddVideoPage(){
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        duration:0,
        price:0,
        date:"",
        venue:"",
        city:"",
        noOfSeatRows:0,
        noOfSeatColumns:0,
    })
    const [posterImage,setPosterImage]=useState(null)
    const [loading,setLoading]=useState(null)
    const[error,setError]=useState(null)
    const navigate=useNavigate()
    const handleSubmit=async (e)=>{
        e.preventDefault()
        setError("")
        setLoading(true)
        console.log(formData)
        const dataPayLoad=new FormData()
        dataPayLoad.append("title",formData.title)
        dataPayLoad.append("description", formData.description)
         dataPayLoad.append("duration", formData.duration)
        dataPayLoad.append("price", formData.price)
        dataPayLoad.append("date", formData.date)
        dataPayLoad.append("venue", formData.venue)
        dataPayLoad.append("city", formData.city)
        dataPayLoad.append("noOfSeatRows", formData.noOfSeatRows)
        dataPayLoad.append("noOfSeatColumns", formData.noOfSeatColumns)
        dataPayLoad.append("posterImage",posterImage)
        try{
            const response=await api.post('http://localhost:8000/events/',dataPayLoad,
                {
                    headers:{
            "Content-Type": "multipart/form-data",
          }
                }
            )
            if(response.status==201){
              navigate('/')
            }
        }catch(e){
            console.log("Error in uploading:",e)
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
        }finally{
            setLoading(false)
        }
    }

    const handleInputChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    return (<>
    <Navbar/>
  <div className="upload-page-wrapper">
  <div className="upload-card-box">
    <h2 className="upload-title">Add Event</h2>

    {error && (
      <div className="upload-error-alert">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="upload-form">

      {/* Title */}
      <div className="input-field-group">
        <label className="field-label">Title</label>

        <input
          type="text"
          name="title"
          required
          placeholder="Enter event title"
          className="text-input-box"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>

      {/* Description */}
      <div className="input-field-group">
        <label className="field-label">Description</label>

        <textarea
          name="description"
          required
          placeholder="Tell people about your event..."
          className="text-input-box textarea-box"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      {/* Duration */}
      <div className="input-field-group">
        <label className="field-label">Duration (in hrs)</label>

        <input
          type="number"
          name="duration"
          required
          min="0.1"
          step="0.1"
          placeholder="Enter duration"
          className="text-input-box"
          value={formData.duration}
          onChange={handleInputChange}
        />
      </div>

      {/* Price */}
      <div className="input-field-group">
        <label className="field-label">Price (in INR)</label>

        <input
          type="number"
          name="price"
          required
          min="0"
          placeholder="Enter ticket price"
          className="text-input-box"
          value={formData.price}
          onChange={handleInputChange}
        />
      </div>

      {/* Date */}
      <div className="input-field-group">
        <label className="field-label">Date and Time</label>

        <input
          type="datetime-local"
          name="date"
          required
          className="text-input-box"
          value={formData.date}
          onChange={handleInputChange}
        />
      </div>

      {/* City */}
      <div className="input-field-group">
        <label className="field-label">City</label>

        <input
          type="text"
          name="city"
          required
          placeholder="Enter city"
          className="text-input-box"
          value={formData.city}
          onChange={handleInputChange}
        />
      </div>

      {/* Venue */}
      <div className="input-field-group">
        <label className="field-label">Venue</label>

        <input
          type="text"
          name="venue"
          required
          placeholder="Enter venue"
          className="text-input-box"
          value={formData.venue}
          onChange={handleInputChange}
        />
      </div>

      {/* Seat Rows */}
      <div className="input-field-group">
        <label className="field-label">Number of Rows</label>

        <input
          type="number"
          name="noOfSeatRows"
          required
          min="1"
          placeholder="Enter number of rows"
          className="text-input-box"
          value={formData.noOfSeatRows}
          onChange={handleInputChange}
        />
      </div>

      {/* Seat Columns */}
      <div className="input-field-group">
        <label className="field-label">Number of Columns</label>

        <input
          type="number"
          name="noOfSeatColumns"
          required
          min="1"
          placeholder="Enter number of columns"
          className="text-input-box"
          value={formData.noOfSeatColumns}
          onChange={handleInputChange}
        />
      </div>

      {/* Poster */}
      <div className="input-field-group">
        <label className="field-label">Poster Image</label>

        <input
          type="file"
          accept="image/*"
          name="posterImage"
          required
          className="file-input-handler"
          onChange={(e) => setPosterImage(e.target.files[0])}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="upload-submit-btn"
      >
        {loading ? "Adding Event..." : "Add Event"}
      </button>

    </form>
  </div>
</div>
  </>
);

}