const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MultiSport</h3>
            <p className="text-gray-300">
              Your ultimate platform for multi-sport tournaments and rankings.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tournaments</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Rankings</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Sports</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Football</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Basketball</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tennis</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Cricket</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@multisport.com</li>
              <li className="text-gray-300">Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 MultiSport. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer