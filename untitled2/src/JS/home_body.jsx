import '../styles/header.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomeBody(){
    // State variable for user input
    const [tempQuery, setTempQuery] = useState("");
    // Navigate to other pages(search page)
    const navigate = useNavigate();
    // Handles the final text entered adn brings user to search page
    const handleSearch = (e) => {
        if (e.key === "Enter" && tempQuery.trim() !== "") {
            // Navigate to search page while passing through the query
            navigate(`/search?q=${encodeURIComponent(tempQuery)}`);
        }
    };
        return (
        <>
        <div className="bg-white flex flex-col items-center justify-center w-screen h-screen">
            <div className="flex justify-center pt-52 pb-16">
                <input
                    type="text"
                    id="search"
                    //set the vale to the query
                    value={tempQuery}
                    // take set the query as the text as it updates
                    onChange={(e) => setTempQuery(e.target.value)}
                    // Detect Enter key
                    onKeyDown={handleSearch}
                    placeholder="Search..."
                    className="bg-white border border-black text-black px-52 py-2 pl-4 rounded-lg text-left
                    focus:outline-none focus:ring-2 focus:ring-red-700"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all w-64 h-72">
                    <img
                        src="https://via.placeholder.com/400x200"
                        alt="Article Image"
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Article Title 1</h3>
                        <p className="text-sm text-gray-500 mb-2">By <span className="font-medium">John Doe</span></p>
                        <p className="text-gray-600 text-sm mb-4">This is a short description of the article. It gives an overview of ........</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-500 transition-all">Read More</button>
                    </div>
                </div>

                <div className="bg-white border rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all w-64 h-72">
                    <img
                        src="https://via.placeholder.com/400x200"
                        alt="Article Image"
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Article Title 1</h3>
                        <p className="text-sm text-gray-500 mb-2">By <span className="font-medium">John Doe</span></p>
                        <p className="text-gray-600 text-sm mb-4">This is a short description of the article. It gives an overview of ........</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-500 transition-all">Read More</button>
                    </div>
                </div>

                <div className="bg-white border rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all w-64 h-72">
                    <img
                        src="https://via.placeholder.com/400x200"
                        alt="Article Image"
                        className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Article Title 1</h3>
                        <p className="text-sm text-gray-500 mb-2">By <span className="font-medium">John Doe</span></p>
                        <p className="text-gray-600 text-sm mb-4">This is a short description of the article. It gives an overview of ........</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-500 transition-all">Read More</button>
                    </div>
                </div>


            </div>
        </div>

        </>
    )
}

export default HomeBody;