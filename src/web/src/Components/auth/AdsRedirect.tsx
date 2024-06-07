import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/ads.txt');
  }, [navigate]);

  return null;
};

export default AdsRedirect;