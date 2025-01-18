import './App.css'
import Login from './Login'
import Home from './Home'
import Register from './Register'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default App
