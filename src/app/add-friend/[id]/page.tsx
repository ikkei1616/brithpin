"use client";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CardTitle from "@/app/components/CardTitle";
import { useColorContext } from "@/context/ColorContext";

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
  const { colors } = useColorContext();

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

  const backToTree = () => {
    router.push("/birth-tree");
  }

  useEffect(() => {
    getDocData(userId);
  }, [userId]);

  const handleClickButton = async () => {
    if (auth.currentUser === null) {
      return;
    }
    const currentUserdocRef = doc(db, "users", auth.currentUser.uid);
    const targetUserDocRef = doc(db, "users", userId);
    await updateDoc(currentUserdocRef, {
      friends: arrayUnion(userId),
    });
    await updateDoc(targetUserDocRef, {
      friends: arrayUnion(auth.currentUser.uid),
    });
    router.push("/birth-tree");
  };

  return (
    <div className="h-screen flex items-center justify-center pt-40">
      <div style={{ borderColor: colors.bg }} className="p-6 max-w-md rounded-3xl border-2 shadow-lg m-5 w-full mx-auto">
        <CardTitle title="FRIEND" />
        <div className="mt-3 text-center">
          {userData?.nickname && (
            <div className="text-base font-serif text-textbrawnlight mb-3">
              {userData.nickname}
            </div>
          )}
          {userData?.birthYear && userData.birthMonth && userData.birthDay && (
            <div className="text-base font-serif text-textbrawnlight mb-3">
              {userData.birthYear}/{userData.birthMonth}/{userData.birthDay}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center my-4">
          {userData?.photoURL && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md">
              <Image
                src={userData.photoURL}
                alt="Profile Image"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <button
            style={{ background: colors.bg }}
            className="flex justify-center items-center radius-lg rounded-lg p-2 w-full text-color text-sm"
            onClick={handleClickButton}
          >
            友達追加
          </button>
          <button
            style={{ borderColor: colors.bg, color: colors.bg }}
            className="flex justify-center items-center radius-lg rounded-lg p-2 border w-full text-color text-sm"
            onClick={handleClickButton}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>

  );
};

export default IdSearch;
