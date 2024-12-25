import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route ,  Routes} from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { AuthStore } from './Store/AuthStore'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Navbar from './components/Navbar'
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

function App() {
 const {authUser,Authcheck,isCheckingAuth}= AuthStore()
 useEffect(()=>{
  Authcheck()
 },[])
 if (isCheckingAuth && !authUser)
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
  return (
    <>
     <Navbar />

<Routes>
  <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
  <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
  <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
  <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
</Routes>
<Toaster  />

     </>
  )
}

export default App
