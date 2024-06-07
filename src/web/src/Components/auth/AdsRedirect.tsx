import { useEffect } from 'react';

const AdsRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://lineupx.net/ads.txt';
  }, []);

  return null;
};

export default AdsRedirect;