import { StrictMode } from 'react'
import '../styles/header.css'
import Header from './header.jsx'
import Footer from "./footer.jsx";
import HomeBody from "./home_body.jsx";

const HomePage = () => {
    return(
        <StrictMode>
            <Header />
            <HomeBody />
            <Footer />
        </StrictMode>
    )
}

export default HomePage