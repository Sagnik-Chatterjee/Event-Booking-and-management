import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SeatContextProvider } from './context/SeatContext.jsx'

createRoot(document.getElementById('root')).render(
    <SeatContextProvider>
    <App />
    </SeatContextProvider>
)
