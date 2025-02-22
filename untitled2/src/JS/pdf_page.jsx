import { StrictMode } from 'react'
import '../styles/header.css'
import Header from './header.jsx'
import Pdf from "./pdf.jsx";
import Footer from "./footer.jsx";

const PdfPage = () => {
    return(
        <StrictMode>
            <Header />
            <Pdf />
            <Footer />
        </StrictMode>
    )
}

export default PdfPage