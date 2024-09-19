"use client";
import CardContainer from '../components/CardContainer'
import React, { useState  } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth';
import { logout } from '@/lib/auth';

const Page = () => {
  const [userId, setUserId] = useState<string>(''); // ユーザーIDのステート
  const user = useAuth();

  // Firestoreからドキュメントを取得する関数
  const getDocData = async (id: string) => {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      console.log('No such document!');
    }
  };

  // 入力が変更されたときに呼び出される関数
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value;
    setUserId(newId);
  };

  // ユーザーIDが変更されたときにデータを取得
  const handleSearch = () => {
    if (userId.trim() !== '') {
      getDocData(userId);
    } else {
      console.log('Please enter a valid user ID.');
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex-grow'>
        <CardContainer>
          <input
            type="text"
            className="w-full p-2 border border-pin rounded-lg"
            placeholder="HtPHOggYTBVWOf0nNqBQSbqR4Yf1"
            value={userId}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 px-4 py-2 bg-pin text-white rounded-lg"
            onClick={handleSearch}
          >
            検索
          </button>
        </CardContainer>
      </div>
      {user && (
        <button
          onClick={() => {
            logout();
          }}
          className="px-8 py-3 bg-pin text-defaultBackGround rounded-lg transition-colors text-lg shadow-md font-serif"
        >
          ログアウト
        </button>
      )}
    </div>
  );
};

export default Page;
