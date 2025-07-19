import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Inventory from './pages/Inventory'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/inventory" element={<Inventory/>} />
    </Routes>
  </BrowserRouter>
)
