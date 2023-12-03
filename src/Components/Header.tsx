import { useContext } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import logo from '../assets/lineupx.png';

const Header: React.FC = () => {
  const Auth = useContext(AuthContext);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const logout = async () => {
    try {
      // Send a request to the server to invalidate the refresh token
      if (Auth?.refreshToken) {
        await axios.delete('/logout', { data: { refreshToken: Auth.refreshToken } });
      }

      // Clear the tokens from cookies and context
      cookies.remove('accessToken');
      cookies.remove('refreshToken');
      if (Auth) {
        Auth.setAccessToken('');
        Auth.setRefreshToken('');
      }

      // Navigate to the login or home page after logout
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav id="header" className="w-full z-30 bg-[#181818] shadow-lg">
      <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
        <input className="hidden" type="checkbox" id="menu-toggle" />
        
        <div className="flex items-center justify-start w-full md:w-auto" id="menu">
            <nav>
              <ul className="flex items-center justify-between text-base text-indigo-800 pt-4 md:pt-0">
                  <li>
                    <Link to={"/"}>
                      <img src={logo} alt="Logo" className="w-100 h-20 transform scale-125" />
                    </Link>
                  </li>
              </ul>
            </nav>
        </div>
        
        {Auth?.accessToken ? <div>Welcome back, {Auth.username}! 
        <button onClick={logout} className="ml-4 text-white">Logout</button></div> :
        <div className="flex items-center justify-end w-full md:w-auto" id="nav-content">
            <div className="auth flex items-center w-full md:w-auto">
              <Link to={"/login"} className="bg-white text-gray-800 p-2 rounded mr-4 hover:bg-gray-400 hover:text-gray-950">Sign in</Link>
              <Link to={"/register"} className="bg-indigo-800 text-gray-200 p-2 rounded hover:bg-blue-500 hover:text-gray-100">Sign up</Link>
            </div>
        </div>}
      </div>
    </nav>
  );
};

export default Header;