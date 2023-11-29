import logo from '../assets/lineupx.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/'); // Navigate to home page when logo is clicked
  }

  return (
    <img className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-auto cursor-pointer" src={logo} alt="Logo" onClick={handleClick} />
  );
};

export default Header;