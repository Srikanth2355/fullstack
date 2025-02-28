import './App.css'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { Suspense, lazy } from "react";
import { LoadingProvider } from './utils/loader.jsx';
import LazyLoader from "./utils/lazyLoader.jsx";

const Login =lazy(()=>import('./pages/Login.jsx'));
const Register =lazy(()=>import('./pages/Register.jsx'));
const ProtectedRoute =lazy(()=>import('./utils/protectedRoute.jsx'));
const HomeLayout =lazy(()=>import('./Layout/homeLayout.jsx'));
const Notes =lazy(()=>import('./pages/Notes.jsx'));  
const SharedNotes =lazy(()=>import('./pages/SharedNotes.jsx'));
const SharedNotesWithMe =lazy(()=>import('./pages/SharedNotesWithMe.jsx'));
const ForgotPassword =lazy(()=>import('./pages/ForgotPassword.jsx'));
const Note = lazy(()=>import('./pages/Note.jsx'));
const Friends = lazy(()=>import('./pages/Friends.jsx'));

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Suspense fallback={<LazyLoader />}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={ <HomeLayout /> }>
                <Route path="/" element={<Navigate to="/notes" replace />} />
                <Route path="" element={<Navigate to="/notes" replace />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:id" element={<Note />} />
                <Route path="/sharednotes" element={<SharedNotes />} />
                <Route path="/sharedwithme" element={<SharedNotesWithMe />} />
                <Route path="/friends" element={<Friends />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LoadingProvider>
  )
}

export default App
