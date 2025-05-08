import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-utblack text-white py-8">
      <div className="ut-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">CIRT Database</h3>
            <p className="text-sm text-gray-300 mb-4">
              The Criminology Institute for Research and Training (CIRT) at the
              University of Tampa provides a comprehensive repository of
              criminology research and publications.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white">
                  Search Database
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About CIRT
                </Link>
              </li>
              <li>
                <Link
                  href="/fellowship"
                  className="text-gray-300 hover:text-white"
                >
                  Fellowship
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.ut.edu/academics/college-of-social-sciences-mathematics-and-education/criminology-and-criminal-justice-degrees/criminology-institute-for-research-and-training-"
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="text-sm text-gray-300 not-italic">
              <p>Criminology Institute for Research and Training</p>
              <p>University of Tampa</p>
              <p>401 W. Kennedy Blvd.</p>
              <p>Tampa, FL 33606</p>
              <p className="mt-2">Phone: (813) 123-4567</p>
              <p>Email: cirt@ut.edu</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} University of Tampa. All rights
              reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Use
              </Link>
              <Link
                href="https://www.ut.edu"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                UT Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
