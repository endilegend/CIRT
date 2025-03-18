import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/header.css'
import Header from './header.jsx'
import Pdf from "./pdf.jsx";
import Footer from "./footer.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Header />
        <Pdf />
        <Footer />

    </StrictMode>,
)