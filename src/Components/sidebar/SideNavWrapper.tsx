import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SideNav, SideNavItems } from "../../Components";
import { MdOutlineSettings,  MdOutlineGamepad, MdHome } from "react-icons/md";

const SideNavWrapper: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>("/");
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);
    const handleClick = (item: string) => {
        navigate(item);
    };

    return (
        <SideNav>
            <SideNavItems icon={<MdHome size={25} />} text="Home" active={activeItem === "/"} onClick={() => handleClick("/")} />
            <SideNavItems icon={<MdOutlineGamepad size={25} />} text="CS 2" active={activeItem === "/cs2"} onClick={() => handleClick("/cs2")} />
            <SideNavItems icon={<MdOutlineGamepad size={25} />} text="Valorant" active={activeItem === "/valorant"} onClick={() => handleClick("/valorant")} />
            <SideNavItems icon={<MdOutlineSettings size={25} />} text="Profile" active={activeItem === "/user/ooccupate"} onClick={() => handleClick("/user/ooccupate")} alert />
        </SideNav>
        );
    };

    export default SideNavWrapper;