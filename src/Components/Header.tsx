import { Link } from 'react-router-dom';
import logo from '../assets/lineupx.png';

const Header: React.FC = () => {

  return (
    <nav id="header" className="w-full z-30 bg-white shadow-lg border-b">
      <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
        <input className="hidden" type="checkbox" id="menu-toggle" />
        
        <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
            <nav>
              <ul className="md:flex items-center justify-between text-base text-indigo-800 pt-4 md:pt-0">
                  <li>
                    <Link to={"/"}>
                      <img src={logo} alt="Logo" className="w-20 h-20" />
                    </Link>
                  </li>
                  <li><a className="inline-block no-underline hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2" href="#">Home</a></li>
                  <li><a className="inline-block no-underline hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2" href="#">Products</a></li>
                  <li><a className="inline-block no-underline hover:text-black font-medium text-lg py-2 px-4 lg:-ml-2" href="#">About</a></li>
              </ul>
            </nav>
        </div>
        
        <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
            <div className="auth flex items-center w-full md:w-full">
              <Link to={"/login"} className="bg-transparent text-gray-800  p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700">Sign in</Link>
              <Link to={"/register"} className="bg-indigo-800 text-gray-200  p-2 rounded  hover:bg-blue-500 hover:text-gray-100">Sign up</Link>
            </div>
        </div>
      </div>
  </nav>
  );
};

export default Header;