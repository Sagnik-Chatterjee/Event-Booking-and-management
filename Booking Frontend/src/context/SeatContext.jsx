import { createContext, useContext } from "react"
import { useState } from "react"
const SeatContext=createContext()

export const SeatContextProvider=({children})=>{
    const [selectedSeats,setSelectedSeats]=useState([])
    return (
        <SeatContext.Provider value={{selectedSeats,setSelectedSeats}}>
        {children}
        </SeatContext.Provider>
    )
}
export const useSeatContext=()=> useContext(SeatContext)