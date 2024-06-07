import { useEffect } from 'react';

const AdsRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://lineupx.net/ads.txt';
    console.log("Redirecting to ads.txt");
  }, []);
  return null;
};

export default AdsRedirect;