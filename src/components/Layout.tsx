"use client";
import { useEffect, useState } from 'react';
import { db, auth } from "../lib/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [bgColor, setBgColor] = useState('bg-backgroundcolor');

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
                break;
              case 'autumn':
                setBgColor('bg-autumnbackground');
                break;
              case 'winter':
                setBgColor('bg-winterbackground');
                break;
              default:
                setBgColor('bg-backgroundcolor');
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

  return <div className={`${bgColor} antialiased bg-custom-special bg-no-repeat`}>{children}</div>;
};

export { Layout };
