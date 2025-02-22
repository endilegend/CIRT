import '../styles/header.css'

function Pdf() {
    return (
        <>
        <div className="flex flex-wrap items-center justify-center h-screen mt-48 pt-1.5">
            <div className="w-3/4 h-screen flex items-center justify-left">
                <iframe src="src/assets/images/math.pdf" width="100%" height="100%" type="application/pdf"
                        allowFullScreen></iframe>
            </div>
            <div className="bg-white w-1/4 h-screen flex flex-col justify-right p-4 border-l-4 border-black">
                <div className="bg-gray-100 p-4 rounded-lg w-full flex-1 y-3/4">
                    <h1 className="underline text-xl font-bold mb-4 flex justify-center">Related Research</h1>
                    <ul className="flex flex-col space-y-4 w-full">
                        <li>
                            <button className="hover:text-red-500 px-4 py-2 rounded-lg w-full text-left">
                                <h1 className="text-xl font-bold">Article</h1>
                                <h3 className="text-m">Author</h3>
                                <p className="text-sm">Hello this is a description</p>
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-red-500 px-4 py-2 rounded-lg w-full text-left">
                                <h1 className="text-xl font-bold">Article</h1>
                                <h3 className="text-m">Author</h3>
                                <p className="text-sm">Hello this is a description</p>
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-red-500 px-4 py-2 rounded-lg w-full text-left">
                                <h1 className="text-xl font-bold">Article</h1>
                                <h3 className="text-m">Author</h3>
                                <p className="text-sm">Hello this is a description</p>
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-red-500 px-4 py-2 rounded-lg w-full text-left">
                                <h1 className="text-xl font-bold">Article</h1>
                                <h3 className="text-m">Author</h3>
                                <p className="text-sm">Hello this is a description</p>
                            </button>
                        </li>

                        <li>
                            <button className="hover:text-red-500 px-4 py-2 rounded-lg w-full text-left">
                                <h1 className="text-xl font-bold">Article</h1>
                                <h3 className="text-m">Author</h3>
                                <p className="text-sm">Hello this is a description</p>
                            </button>
                        </li>

                    </ul>
                </div>
                <div className="flex items-center justify-center space-x-4 mb-4 y-1/4 mt-4">
                    <button
                        className="w-16 h-16 flex items-center justify-center text-3xl text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none">
                        &#8220; &#8221;
                    </button>

                    <button id="copyUrlBtn"
                            className="w-16 h-16 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Link_icon.svg" alt="Copy URL"
                             className="w-8 h-8"/>
                    </button>


                </div>
            </div>
        </div>
        </>
    )
}

export default Pdf;