import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './header';  // Assuming Header is in a separate file
import HomePage from './home_page.jsx';
import PdfPage from "./pdf_page.jsx";
//import SearchPage from './search_page.jsx';
import SearchBody from './search_body.jsx';
// import About from './pages/About';
// import Contacts from './pages/Contacts';
// import SpecialCollections from './pages/SpecialCollections';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes >
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<PdfPage />} />
                <Route path="/contacts" element={<contacts/>} />
                <Route path="/search" element={<SearchBody />} />
                {/*<Route path="/special-collections" element={<SpecialCollections />} />*/}
            </Routes>
        </Router>
    );
};

export default App;
