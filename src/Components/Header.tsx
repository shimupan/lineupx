import logo from '../assets/lineupx.png';

const Header = () => {

  return (
    <div>
      <img className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-auto" src={logo} alt="Logo" />
    </div>
  );
};
 
 export default Header;