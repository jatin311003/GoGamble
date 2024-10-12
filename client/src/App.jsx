import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Gamble from './components/Gamble';
function App() {
  

  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/gamble' element={<Gamble/>} />
      </Routes>
    </Router>
  )
}

export default App
