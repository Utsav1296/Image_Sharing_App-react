import React from "react"
import { useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from "./component/Login"
import Home from "./container/Home"
import { fetchUser } from "./utils/fetchUser";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser()

    if (!user) navigate('/login')
  }, [])


  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes>
    // <Ashit />
  )
}

export default App