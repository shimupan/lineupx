import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Header, SideNavWrapper } from '../../Components';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`/resetpassword/${token}`, { password });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Reset password error:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <>
      <Header />

      <SideNavWrapper />

      <div className="h-screen md:h-full md:w-1/2 lg:w-1/2 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl" onSubmit={handleSubmit}>
                <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                  Reset Password
                </h3>
                <p className="mb-4 text-gray-500">
                  Enter your new password
                </p>
                <label htmlFor="password" className="mb-2 text-sm text-start text-gray-900">
                  Password*
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                <label htmlFor="confirmPassword" className="mb-2 text-sm text-start text-gray-900">
                  Confirm Password*
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                <button type="submit" className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900">
                  Submit
                </button>
                <p className="text-sm leading-relaxed text-gray-900">
                  Remember your password?{" "}
                  <Link to={"../login"}
                    className='font-bold text-blue-900'>
                    Log In
                  </Link>
                </p>
                </form>
            </div>
            </div>
        </div>
        </div>
    </>
    );
};

export default ResetPassword;