import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  const [colors, setColors] = useState({
    bg: '#FEB69F',
  });
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
                setColors({
                  bg: '#369675',
                });
                break;
              case 'autumn':
                setColors({
                  bg: '#E58368',
                });
                break;
              case 'winter':
                setColors({
                  bg: '#85CBCD',
                });
                break;
              default:
                setColors({
                  bg: '#FEB69F',
                });
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
    <div style={{ borderColor: colors.bg }} className="p-8 max-w-md rounded-3xl border-2 shadow-lg m-5">
      {children}
    </div>
  );
};

export default CardContainer;
