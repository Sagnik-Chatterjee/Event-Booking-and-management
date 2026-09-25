import { Route,Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import SetCity from './setCity.jsx'
import AllEvents from './AllEventsPage.jsx'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<SetCity/>}></Route>
      <Route path='/:city' element={<AllEvents/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
