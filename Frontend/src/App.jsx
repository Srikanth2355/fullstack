import './App.css'
import Login from './pages/Login.jsx'
import Home from './Home'
import Register from './pages/Register.jsx'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { LoadingProvider } from './utils/loader.jsx';
import ProtectedRoute from './utils/protectedRoute.jsx';
import HomeLayout from './Layout/homeLayout.jsx';
import Notes from './pages/Notes.jsx';  
import SharedNotes from './pages/SharedNotes.jsx';
import SharedNotesWithMe from './pages/SharedNotesWithMe.jsx';

function App() {
  return (
    <LoadingProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={ <HomeLayout /> }>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="" element={<Navigate to="/notes" replace />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/sharednotes" element={<SharedNotes />} />
            <Route path="/sharedwithme" element={<SharedNotesWithMe />} />



          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
    </BrowserRouter>
    </LoadingProvider>
  )
}

export default App
