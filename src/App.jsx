import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import Create from './components/Create'
import Details from './components/Details'
import Error from './components/Error'
import { Routes, Route } from 'react-router'
import Catalog from './components/Catalog'
import request from '../utils/request.js'


function App() {


  return (
    <>
      
        <Header />
        
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/catalog' element={<Catalog />} />
            <Route path='/create' element={<Create />} />
            <Route path='/details/:id' element={<Details />} />
            <Route path='*' element={<Error />} />
          </Routes>
        
    </>
  )
}

export default App
