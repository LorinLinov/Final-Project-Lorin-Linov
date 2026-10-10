import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router'
import Catalog from './components/Catalog'
import request from '../utils/request.js'


function App() {


  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/catalog' element={<Catalog />}></Route>
      </Routes>

      <Footer />
    </>
  )
}

export default App
