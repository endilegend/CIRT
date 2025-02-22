import '../styles/header.css'
import utIcon from '../assets/images/UT-Icon.png';
import userIcon from '../assets/images/user.png';
import { Link } from 'react-router-dom';


function Header() {
    return (

        <header className="absolute top-0 bg-red-700 text-white shadow-md text-lg w-full">
            <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <a href="https://www.ut.edu/">
                    <img src={utIcon} alt="UTampa Logo" className="w-32"/>
                </a>
                <h1 className="text-center text-3xl flex-1">CIRT - Criminology Institute of Research and
                    Technology</h1>
                <div className="absolute top-4 right-4">
                    <a href="">
                        <img src={userIcon} alt="user" className="w-12 h-12 rounded-full shadow-md"/>
                    </a>
                </div>

            </div>
            <div className="border-t-2 w-screen" style={{ borderTopColor: '#B8860B' }}></div>

            <nav className="bg-black text-white px-6 lg:px-24 py-1 flex items-center w-full">
                <div className="flex justify-center items-center w-full">
                    <ul id="menu" className="lg:flex space-x-6 text-white hidden">
                        <li>
                            <Link to={"/"} className="hover:text-red-500 px-4 py-2 rounded-none">Home</Link>
                        </li>
                        <li>
                            <Link to={"/about"} className="hover:text-red-500 px-4 py-2 rounded-none">About</Link>
                        </li>
                        <li>
                            <Link to={"/contacts"} className="hover:text-red-500 px-4 py-2 rounded-none">Contacts</Link>
                        </li>
                        <li>
                            <Link to={""} className="hover:text-red-500 px-4 py-2 rounded-none">Special Collections</Link>
                        </li>
                    </ul>
                </div>
            </nav>

        </header>

    )
}



export default Header;