'use client'
import React from 'react';
import { updateDoc,doc} from 'firebase/firestore';
import { db,auth} from '../../lib/firebase';

export const ProfileForm = () => {

  const DataUpdata = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();   
    const formData = new FormData(event.currentTarget);  
    
    const nickname = formData.get("nickname");
    const birthYear = Number(formData.get("birthYear"));
    const birthMonth = Number(formData.get("birthMonth"));
    const birthDay = Number(formData.get("birthDay"));
    const gender = Number(formData.get("gender"));

    try {
      if(auth.currentUser?.uid == null){

        return
      }
      const docRef = doc(db,"users",auth.currentUser.uid);
      await updateDoc(docRef,{
        nickname:nickname,
        birthYear:birthYear,
        birthMonth:birthMonth,
        birthDay:birthDay,
        gender:gender,
      });
    } catch(error){
      console.log("エラーが発生しました",error);
    }
    }

  return (
    <form className="bg-yellow p-6" onSubmit={DataUpdata}>
      <div>
        <input className="border" aria-label="nickname" name='nickname' type="text" />
      </div>
      <div>
        <input className="border" aria-label="birthYear" name='birthYear' type="number" />
        <input className="border" aria-label="birthMonth" name='birthMonth' type="number" />
        <input className="border" aria-label="birthDay" name='birthDay' type="number" />  
      </div>
      <div>
        <input className="border" aria-label="male" value={0} name='gender' type='radio' />
        <input className="border" aria-label="female" value={1} name='gender' type='radio' />
        <input className="border" aria-label="other" value={2} name='gender' type='radio' />
      </div>
      <div>
        <input className="border" value={'登録'} type='submit' />
      </div>
    </form>
  );
}

