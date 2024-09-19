"use client";
import {doc,getDoc} from "firebase/firestore";
import { db,} from '../../../lib/firebase';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface User{
  nickname: string;
  birthDay:number;
  birthMonth:number;
  birthYear:number;
  gender:number;
  photoURL:string;
}

const IdSearch = ({params}:{params:{id:string}})=>{
  const [userId] = useState<string>(params.id);
  const [userData,setUserData] = useState<User|undefined>(undefined);
  const router = useRouter();

  const getDocData = async (id:string) => {
    const docRef = doc(db,"users",id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
      console.log("Document data:",docSnap.data());
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
    }else{
      console.log('No such document!');
    }
  };

  useEffect(() => {
    getDocData(userId)
  }, [userId]);

  const handleClickButton = () => {
    router.push(`/birth-tree`);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className='flex-grow'>
        <p>{userData?.nickname}</p>
        <p>{userData?.birthYear}</p>
        <p>{userData?.birthMonth}</p>
        <p>{userData?.birthDay}</p>
        {userData?.photoURL && <Image src={userData.photoURL} alt="img" width={100} height={100} />}
        <div>
        <button
          className="mt-4 px-4 py-2 bg-pin text-white rounded-lg"
          onClick={handleClickButton}
        >
          友達追加
        </button>
      </div>      
    </div>
    </div>
  );
};


export default IdSearch;