import React from 'react';
import { useNavigate } from 'react-router-dom';
import grenade from '../../../assets/svg/grenade.svg';
import molly from '../../../assets/svg/molly.svg';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-6 h-6 flex items-center justify-center">{children}</div>
);

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const handleClick = (item: string) => {
        navigate(item);
    };

    return (
        <div className="absolute mt-2 w-48 bg-white shadow-lg rounded">
            <ul className="py-2">
                <li
                    className="px-4 py-2 flex items-center justify-center"
                    onClick={() => handleClick('/game/CS2/Lineups')}
                >
                    <IconWrapper>
                        <img
                            src={grenade}
                            alt="Lineups"
                            className="w-6 h-6 invert"
                        />
                    </IconWrapper>
                    <span className="px-4 py-2 text-black text-center">CS2 Lineups</span>
                </li>
                <li
                    className="px-4 py-2 flex items-center justify-center"
                    onClick={() => handleClick('/game/Valorant/Agents')}
                >
                    <IconWrapper>
                        <img
                            src={molly}
                            alt="Lineups"
                            className="w-6 h-6 invert"
                        />
                    </IconWrapper>
                    <span className="px-4 py-2 text-black text-center">Val Lineups</span>
                </li>
            </ul>
        </div>
    );
};

export default Menu;
