import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNotFound = (condition: boolean | null | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (condition === false || condition === null || condition === undefined) {
      navigate('/*');
    }
  }, [condition, navigate]);

  return condition;
};