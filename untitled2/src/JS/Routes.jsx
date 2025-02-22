import { Routes, Route } from 'react-router-dom';
import HomePage from './home_page.jsx'; // Import your page components
// import About from './';
// import Contacts from './';
// import SpecialCollections from './';

const PageRoutes = () => (
    <Routes location={HomePage}>
        <Route path="/" element={<HomePage />} />
        {/*<Route path="/about" element={<About />} />*/}
        {/*<Route path="/contacts" element={<Contacts />} />*/}
        {/*<Route path="/special-collections" element={<SpecialCollections />} />*/}
    </Routes>
);

export default PageRoutes;
