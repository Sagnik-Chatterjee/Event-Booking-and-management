import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./setCity.css"
export default function SetCity(){
    const [city,setCity]=useState("")
    const navigate=useNavigate()
    function handleCityChange(e){
        setCity(e.target.value)
    }
    function handleSubmit(){
        navigate(`/city/${city}`)
    }
    return <>
    <div className="city-search-page">
  <div className="city-search-card">
    <h1>Enter City</h1>

    <input
      type="text"
      placeholder="Enter your city"
      onChange={handleCityChange}
    />

    <button onClick={handleSubmit}>Search</button>
  </div>
</div>
    </>
}