import React, { useState, FormEvent } from 'react';
import axios from 'axios'; // Make sure Axios is installed
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!email || !password) {
          console.error('Email and password are required');
          return;
      }
  
      try {
          console.log(email, password);
          const response = await axios.post('http://localhost:3000/login', { email, password });
          console.log(response.data);
          // Handle successful login, e.g., storing JWT token, redirecting user
      } catch (error) {
          if (axios.isAxiosError(error)) {
              console.error('Login error:', error.response?.data);
          } else {
              console.error('Unexpected error:', error);
          }
      }
  };

    return (
        <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
            <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                <div className="flex items-center justify-center w-full lg:p-12">
                    <div className="flex items-center xl:p-10">
                        <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl" onSubmit={handleSubmit}>
                            <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                                Sign In
                            </h3>
                            <p className="mb-4 text-gray-500">
                                Enter your email and password
                            </p>
                            <label htmlFor="email" className="mb-2 text-sm text-start text-gray-900">
                                Email*
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                            />
                            <label htmlFor="password" className="mb-2 text-sm text-start text-gray-900">
                                Password*
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                            />
                            <div className="flex flex-row justify-between mb-8">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-sm font-medium text-blue-900">
                                    Forgot password?
                                </Link>
                            </div>
                            <button type="submit" className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900">
                                Sign In
                            </button>
                            <p className="text-sm leading-relaxed text-gray-900">
                                Not registered yet?{" "}
                                <Link to="/register" className="font-bold text-blue-900">
                                    Create an Account
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
