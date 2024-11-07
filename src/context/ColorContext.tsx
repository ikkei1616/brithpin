'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface ColorContextType {
  colors: { bg: string };
  imageSrc: string;
  backgroundImage: string;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState({
    bg: '#FEB69F',
  });
  const [imageSrc, setImageSrc] = useState('/fukidashi.png');
  const [backgroundImage, setBackgroundImage] = useState('/birthtree-spring.svg');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            switch (data.season) {
              case 'summer':
                setColors({ bg: '#369675' });
                setImageSrc('/fukidashi-summer.png');
                setBackgroundImage('/birthtree-summer.svg');
                break;
              case 'autumn':
                setColors({ bg: '#E58368' });
                setImageSrc('/fukidashi-autumn.png');
                setBackgroundImage('/birthtree-autumn.svg');
                break;
              case 'winter':
                setColors({ bg: '#85CBCD' });
                setImageSrc('/fukidashi-winter.png');
                setBackgroundImage('/birthtree-winter.svg');
                break;
              default:
                setColors({ bg: '#FEB69F' });
                setImageSrc('/fukidashi.png');
                setBackgroundImage('/birthtree-spring.svg');
            }
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ColorContext.Provider value={{ colors, imageSrc, backgroundImage }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColorContext must be used within a ColorProvider");
  }
  return context;
};
