import { Route,Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import SetCity from './setCity.jsx'
import AllEvents from './AllEventsPage.jsx'
import AddEventPage from './AddEventPage.jsx'
import { EventPage } from './EventPage.jsx'
import { AdminDashboard } from './AdminDashboard.jsx'
import { PendingEventsPage } from './PendinEventsPage.jsx'
import { ExpiredEventsPage } from './ExpiredEventsPage.jsx'
import { SeatLayout } from './SeatLayout.jsx'
import { CheckoutPage } from './CheckoutPage.jsx'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<SetCity/>}></Route>
      <Route path='/city/:city' element={<AllEvents/>}></Route>
      <Route path='/add-event' element={<AddEventPage/>}></Route>
      <Route path='/view/event/:id' element={<EventPage/>}></Route>
      <Route path='/admin' element={<AdminDashboard/>}></Route>
      <Route path='/admin/pending-events' element={<PendingEventsPage/>}></Route>
      <Route path='/admin/expired-events' element={<ExpiredEventsPage/>}></Route>
      <Route path='/view/seatlayout/:id' element={<SeatLayout/>}></Route>
      <Route path='/checkout' element={<CheckoutPage/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
