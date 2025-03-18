import '../styles/header.css'
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBody(){
    // allows query from the URL(/search?q)
    const [searchParams] = useSearchParams();
    // allows ot navigate to diff pages
    const navigate = useNavigate();
    // gets the query from the URL(/search?q)
    const query = searchParams.get("q") || "";
    // stores the input before the Enter is pressed, so the query is only updated when you press enter
    const [tempQuery, setTempQuery] = useState(query);
    // checks if Enter is pressed and if it is then it will navigate you to the search page
    const handleSearch = (e) => {
        if (e.key === "Enter" && tempQuery.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(tempQuery)}`);
            // reload for new search results
            window.location.reload();
        }
    };
            return (
                <>
                    <div className="px-6 mt-60">
                        <div className="flex justify-left">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search...."
                                // update the temp statement while typing
                                value={tempQuery}
                                // Update temp state while typing
                                onChange={(e) => {
                                    // take in the new input
                                    const value = e.target.value;
                                    // Only change if there is at least one character:
                                    const capitalized = value.length > 0
                                        // convert the first character to uppercase and adds it to the rest of the input
                                        ? value[0].toUpperCase() + value.slice(1)
                                        // returns the value if there is no characters present
                                        : value;
                                    // updates the temp value
                                    setTempQuery(capitalized);
                                }}
                                // Reload when Enter
                                onKeyDown={handleSearch}
                                className="bg-white border border-black text-black px-2 py-1 w-full max-w-xl text-md rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-red-700"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-10">
                        <h1 className="text-5xl">Search Results for:<h1 className="text-4xl text-red-700">"{query}"</h1>
                        </h1>
                    </div>

                    <div className="px-6 py-8">
                        <h6 className="text-[15px] text-">About # results</h6>
                    </div>

                    <div className="px-6">
                        <ul>
                            <li>
                                <button className="text-left hover:outline-none hover:ring-2 hover:ring-red-700">
                                    <a href="https://tenor.com/view/goonicide-reverse-goonicide-reverse-reverse-goonicide-goon-gif-1553856178782364507">
                                        <h4 className="font-bold text-red-700 text-left hover:text-gray-700 py-1 w-full ">{query}</h4>
                                        <p className="text-gray-700"> https://tenor.com/view/goonicide-reverse-goonicide-reverse-reverse-goonicide-goon-gif-1553856178782364507</p>
                                        <p className="text-gray-700"> This is a short summary of the pdf and if it over a certain amount of characters then it goes stops and prints...</p>
                                    </a>
                                </button>
                            </li>
                        </ul>
                    </div>


                    <div className="px-6 py-3">
                        <h6 className="text black text-[12px]">Pages: 1 2 3 4</h6>

                    </div>

                </>
            )
        }

export default SearchBody;