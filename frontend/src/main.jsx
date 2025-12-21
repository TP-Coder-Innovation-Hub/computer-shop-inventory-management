import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Deduct from './pages/Deduct'
import Receive from './pages/Receive'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/deduct/:id' element={<Deduct />} />
        <Route path='/receive/:id' element={<Receive />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  </BrowserRouter>
)
