import { useEffect, useState } from 'react';

export const useParallax = (speed: number = 0.5) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    transform: `translateY(${scrollY * speed}px)`,
    transition: 'transform 0.1s ease-out'
  };
};
