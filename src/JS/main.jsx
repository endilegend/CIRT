import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/header.css'
import Header from './header.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
  </StrictMode>,
)
