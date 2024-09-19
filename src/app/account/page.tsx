"use client";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import React from "react";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

interface User {
  nickname: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: number;
  photoURL: string;
}

const AccountPage = () => {

  const [userData,setUserData] = useState<User | undefined>(undefined);

  const getDocData = async() => {
    if (auth.currentUser === null) {
      console.log("あいあい居合")
      return;
    }
    const docRef = doc(db, "users",auth.currentUser.uid);
    const docSnap =  await getDoc(docRef);
    console.log(docSnap)
    if (docSnap.exists()){
      const docSnapData = docSnap.data();
      const formatUserData :User ={
        nickname:docSnapData.nickname,
        birthDay:docSnapData.birthDay,
        birthMonth:docSnapData.birthMonth,
        birthYear:docSnapData.birthYear,
        gender:docSnapData.gender,
        photoURL:docSnapData.photoURL,
      };
      setUserData(formatUserData);
    }else{
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDocData();
  }, []);


  return (
    <div className="h-screen flex items-center justify-center pt-6">
      <div>
        {/* <ProfileForm /> */}
        <p>{userData?.nickname}</p>
        <p>{userData?.birthYear}</p>
        <p>{userData?.birthMonth}</p>
        <p>{userData?.birthDay}</p>
        <p>{userData?.gender}</p>
        <p>{userData?.photoURL}</p>
      </div>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;
