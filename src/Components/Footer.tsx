import React from 'react';
import github from '../assets/github.png';

interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
    return (
        <footer className={`bg-white text-center lg:text-left static bottom-0 w-full ${className}`}>
            <div className="container p-6 flex flex-col md:flex-row justify-center md:justify-end items-center">
                <div className="text-gray-700 text-center md:text-left md:pr-80">
                    <span>{new Date().getFullYear()} LineupX. All rights reserved.
                    <a href="https://github.com/shimupan/lineupx" className="mr-6">
                        <img src={github} alt="GitHub" width="24" height="24" />
                    </a></span>
                </div>
                <div className="flex flex-wrap justify-center">
                    <a href="#!" className="mr-6 text-gray-600">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#!" className="mr-6 text-gray-600">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#!" className="mr-6 text-gray-600">
                        <i className="fab fa-google-plus-g"></i>
                    </a>
                    <a href="#!" className="mr-6 text-gray-600">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#!" className="text-gray-600">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;