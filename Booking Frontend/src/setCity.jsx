import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function SetCity(){
    const [city,setCity]=useState("")
    const navigate=useNavigate()
    function handleCityChange(e){
        setCity(e.target.value)
    }
    function handleSubmit(){
        navigate(`/${city}`)
    }
    return <>
    <h1>Enter City</h1>
    <input type="text" onChange={handleCityChange} />
    <button onClick={handleSubmit}>Submit</button>
    </>
}