import React, { useEffect } from 'react';
import { useColorContext } from '@/context/ColorContext';

const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  const { backgroundImage } = useColorContext();

  useEffect(() => {
    document.documentElement.style.setProperty('--background-image', `url(${backgroundImage})`);
  }, [backgroundImage]);

  return <div className="background">{children}</div>;
};

export { BackgroundWrapper };
