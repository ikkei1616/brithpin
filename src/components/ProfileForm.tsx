'use client';
import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import CardContainer from '../../src/app/components/CardContainer';
import { useRouter } from 'next/navigation';
import FileUploader from './FileUploader';

export const ProfileForm = () => {
  const [photoURL, setphotoURL] = useState<string[]>([]); // 画像URLを保存するstate
  const router = useRouter();

  // 画像URLを取得する関数
  const handleSetImage = (urls: string[]) => {
    console.log("Saved URLs: ", urls);
    setphotoURL(urls); // アップロードされた画像URLを保存
  };

  const DataUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nickname = formData.get("nickname");
    const birthYear = Number(formData.get("birthYear"));
    const birthMonth = Number(formData.get("birthMonth"));
    const birthDay = Number(formData.get("birthDay"));
    const gender = Number(formData.get("gender"));

    try {
      if (auth.currentUser?.uid == null) {
        return;
      }
      const docRef = doc(db, "users", auth.currentUser.uid);

      // Firestoreにユーザー情報と画像URLを保存
      await updateDoc(docRef, {
        nickname: nickname,
        birthYear: birthYear,
        birthMonth: birthMonth,
        birthDay: birthDay,
        gender: gender,
        photoURL: photoURL.length > 0 ? photoURL[0] : null, // 画像URLがある場合保存
      });

      console.log("Data and Images saved successfully");
      router.push('/qr'); // 保存後にページ遷移
    } catch (error) {
      console.log("エラーが発生しました", error);
    }
  };

  return (

    
    <CardContainer>
      <form onSubmit={DataUpdate}>
        <div className="flex justify-between items-center text-2xl text-textbrawnlight font-bold mb-0 font-serif border-b border-mainpinklight border-dashed pb-4 w-full">
          <div className='w-2/5'></div>
          <div className='flex justify-center w-full'>
            PROFILE
          </div>
          <div className='w-2/5 flex justify-around'>
            <input
              value={'登録'}
              type='submit'
              className="h-full rounded-lg text-base"
            />
            <div
              className="transform bg-pin text-color rounded-full bg-mainpink h-6 w-6 flex items-center"
            >
              ✓
            </div>
          </div>
        </div>
        <div className='text-center'>
          <div className="text-base my-4 text-textbrawnlight font-serif">
            あなたの情報を入力してください
          </div>

          {/* 画像アップロード機能 */}
          <div className="my-4">
            <FileUploader setImage={handleSetImage} /> {/* 画像アップロードコンポーネント */}
          </div>

          <div className="space-y-3">
            <div className=''>
              <div className='flex'>
                <label className="block text-xs font-serif text-textbrawnlight">あだ名</label>
              </div>
              <input
                className="border-2 border-mainpinklight rounded-lg p-2 w-full text-textbrawnlight"
                aria-label="nickname"
                name="nickname"
                type="text"
              />
            </div>
            <div>
              <div className='flex'>
                <label className="block text-xs font-serif text-textbrawnlight">生年月日</label>
              </div>
              <div className="flex space-x-2">
                <input
                  className="border-2 border-mainpinklight rounded-lg p-2 w-1/3 text-textbrawnlight"
                  aria-label="birthYear"
                  name="birthYear"
                  type="number"
                />
                <div className='self-center text-xs font-serif text-textbrawnlight'>年</div>
                <input
                  className="border-2 border-mainpinklight rounded-lg p-2 w-1/5 text-textbrawnlight"
                  aria-label="birthMonth"
                  name="birthMonth"
                  type="number"
                />
                <div className='self-center text-xs font-serif text-textbrawnlight'>月</div>
                <input
                  className="border-2 border-mainpinklight rounded-lg p-2 w-1/5 text-textbrawnlight"
                  aria-label="birthDay"
                  name="birthDay"
                  type="number"
                />
                <div className='self-center text-xs font-serif text-textbrawnlight'>日</div>
              </div>
            </div>
            <div>
              <div className='flex'>
                <label className="block text-xs font-serif text-textbrawnlight">性別</label>
              </div>
              <div className="flex">
                <label className="flex items-center w-1/3">
                  <input
                    className="hidden peer"
                    aria-label="male"
                    value={0}
                    name="gender"
                    type="radio"
                  />
                  <div className="w-5/6 h-10 border-2 border-mainpinklight rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-mainpink">
                    <span className="text-center font-serif text-xs text-textbrawnlight">男性</span>
                  </div>
                </label>
                <label className="flex items-center justify-center w-1/3">
                  <input
                    className="hidden peer"
                    aria-label="female"
                    value={1}
                    name="gender"
                    type="radio"
                  />
                  <div className="w-5/6 h-10 border-2 border-mainpinklight rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-mainpink">
                    <span className="text-center font-serif text-xs text-textbrawnlight">女性</span>
                  </div>
                </label>
                <label className="flex items-center justify-end w-1/3">
                  <input
                    className="hidden peer"
                    aria-label="other"
                    value={2}
                    name="gender"
                    type="radio"
                  />
                  <div className="w-5/6 h-10 border-2 border-mainpinklight rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-mainpink">
                    <span className="text-center font-serif text-xs text-textbrawnlight">その他</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </CardContainer>
  );
}
