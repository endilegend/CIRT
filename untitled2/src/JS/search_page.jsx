import { StrictMode } from 'react'
import '../styles/header.css'
import Header from './header.jsx'
import Footer from "./footer.jsx";
import SearchBody from "./search_body.jsx";

const SearchPage = () => {
    return(
        <StrictMode>
            <Header />
            <SearchBody />
            <Footer />
        </StrictMode>
    )
}

export default SearchPage