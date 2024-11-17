"use client";
import { useEffect, useState } from 'react';
import { db, auth } from "../lib/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [bgColor, setBgColor] = useState('bg-backgroundcolor');
  const [bgImage, setBgImage] = useState('bg-custom-special-spring');

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
                setBgColor('bg-summerbackground');
                setBgImage('bg-custom-special-summer');
                break;
              case 'autumn':
                setBgColor('bg-autumnbackground');
                setBgImage('bg-custom-special-autumn');
                break;
              case 'winter':
                setBgColor('bg-winterbackground');
                setBgImage('bg-custom-special-winter');
                break;
              default:
                setBgColor('bg-backgroundcolor');
                setBgImage('bg-custom-special-spring');
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

  return <div className={`${bgColor} antialiased ${bgImage} bg-no-repeat`}>{children}</div>;
};

export { Layout };
