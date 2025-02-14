import './App.css'
import Login from './Login'
import Home from './Home'
import Register from './Register'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { LoadingProvider } from './utils/loader.jsx';
import ProtectedRoute from './utils/protectedRoute.jsx';

function App() {

  return (
    <LoadingProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={ <Home /> } />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
    </BrowserRouter>
    </LoadingProvider>
  )
}

export default App
