import '../styles/header.css'

function Footer(){
    return (
        <div className="bg-black px-4 py-6">
            <div className="text-white flex items-center justify-center space-x-4 mb-4 y-1/4 mt-4">
                <h1 className="text-md font-bold">CIRT - Criminology Institute of Research and Technology - The
                    University of Tampa - 401 W. Kennedy Blvd. - Tampa, FL 33606</h1>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-4 y-1/4 mt-4">
                <a href="https://www.ut.edu/">
                    <img src="src/assets/images/UT-logo-footer.png" alt="UTampa Logo" className="w-32"/>
                </a>

            </div>
        </div>
    )
}

export default Footer;