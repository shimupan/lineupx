import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-200 text-center lg:text-left">
            <div className="container p-6">
                <div className="flex justify-center items-center lg:justify-between">
                    <div className="text-gray-700">
                        <span>© {new Date().getFullYear()} Your Company Name. All rights reserved.</span>
                    </div>
                    <div className="flex justify-center">
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
            </div>
        </footer>
    );
};

export default Footer;
