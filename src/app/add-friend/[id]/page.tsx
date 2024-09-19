"use client";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import CardContainer from "@/app/components/CardContainer";
import CardTitle from "@/app/components/CardTitle";

interface User {
  nickname: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: number;
  photoURL: string;
}

const IdSearch = ({ params }: { params: { id: string } }) => {
  const [userId] = useState<string>(params.id);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const router = useRouter();

  const getDocData = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const docSnapData = docSnap.data();
      const formatUserData: User = {
        nickname: docSnapData.nickname,
        birthDay: docSnapData.birthDay,
        birthMonth: docSnapData.birthMonth,
        birthYear: docSnapData.birthYear,
        gender: docSnapData.gender,
        photoURL: docSnapData.photoURL,
      };
      setUserData(formatUserData);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDocData(userId);
  }, [userId]);

  const handleClickButton = async () => {
    if (auth.currentUser === null) {
      return;
    }
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, {
      friends: arrayUnion(userId),
    });
    router.push('/birth-tree');
  };

  return (
    <div className="h-screen flex flex-col justify-around pt-4">
      <CardContainer>
        <CardTitle title="FRIEND" />
        <div className="mt-3">
          {userData?.nickname && (
            <div className="text-base font-serif text-textbrawnlight text-center mb-3">
              {userData.nickname}
            </div>
          )}
          {userData?.birthYear && userData.birthMonth && userData.birthDay && (
            <div className="text-base font-serif text-textbrawnlight text-center mb-3">
              {userData.birthYear}/{userData.birthMonth}/{userData.birthDay}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center my-4">
          {userData?.photoURL && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md">
              <Image src={userData.photoURL} alt="Profile Image" width={120} height={120} className="rounded-full" />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center bg-mainpink radius-lg rounded-lg p-2">
          <button
            className="text-color text-sm "
            onClick={handleClickButton}
          >
            友達追加
          </button>
        </div>
      </CardContainer>
      <div className="w-full absolute bottom-0" >
        <Footer />
      </div >
    </div >
  );
};

export default IdSearch;
