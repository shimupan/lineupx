import { useEffect } from 'react';

const RiotRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://lineupx.net//riot.txt';
  }, []);

  return null;
};

export default RiotRedirect;