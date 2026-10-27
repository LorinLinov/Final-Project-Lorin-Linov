import './App.css'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './components/home/Home'
import Create from './components/create/Create'
import Details from './components/details/Details'
import Edit from './components/edit/Edit'
import Error from './components/Error404/Error'
import Catalog from './components/catalog/Catalog'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { Routes, Route } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/auth-context'
import Logout from './components/logout/Logout'

function App() {


  return (
    <>
      <AuthProvider>
        <Header />
    
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/catalog' element={<Catalog />} />
          <Route path='/create' element={<Create />} />
          <Route path='/details/:id' element={<Details />} />
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<Error />} />
        </Routes>
    
        <ToastContainer />

        <Footer />
      </AuthProvider>
    </>
  )
}

export default App
