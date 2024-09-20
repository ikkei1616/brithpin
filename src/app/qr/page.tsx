'use client';
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

const QrPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [uid, setUid] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const router = useRouter();

  // Firebaseの認証状態を監視し、uidを取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        console.log("認証ユーザーのUID:", user.uid);  // uidのデバッグログ
        await fetchUserData(user.uid);  // ユーザーデータを取得
      } else {
        setUid(null);
        console.log("ログインしているユーザーがいません");  // ログアウト状態のデバッグログ
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestoreからユーザーデータを取得する関数
  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("取得したユーザーデータ:", data);  // デバッグ用に全データをログ出力
        setNickname(data.nickname);
        setBirthYear(data.birthYear);
        setBirthMonth(data.birthMonth);
        setBirthDay(data.birthDay);
        console.log("Nickname:", data.nickname);  // nicknameのデバッグログ
        console.log("BirthYear:", data.birthYear, "BirthMonth:", data.birthMonth, "BirthDay:", data.birthDay);  // 生年月日のデバッグログ
      } else {
        console.log("ユーザーデータが存在しません");  // データが存在しない場合のデバッグログ
      }
    } catch (error) {
      console.log("データ取得エラー:", error);  // エラーログ
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newId = event.currentTarget.value;
    setUserId(newId);
  };

  const getSearch = () => {
    if (userId.trim() !== "") {
      router.push(`add-friend/${userId}`);
    } else {
      console.log('Please enter a valid user ID.');
    }
  };

  return (
    <div className='h-screen flex relative flex-col items-center'>
      <div className='h-screen w-11/12 flex justify-center'>
        <div className="flex flex-col items-center justify-center h-[85%] mt-28">
          <div className='max-w-md rounded-3xl border-mainpink border-2 shadow-lg px-10 py-3'>
            <div className='text-center text-2xl text-textbrawn font-aboreto border-b border-mainpink border-dashed py-4'>
              <span>PROFILE</span>
            </div>
            <div className="mt-3">
              {nickname && (
                <div className="text-base font-serif text-textbrawnlight text-center mb-3">
                  {nickname}
                </div>
              )}
              {birthYear && birthMonth && birthDay && (
                <div className="text-base font-serif text-textbrawnlight text-center mb-3">
                  {birthYear}/{birthMonth}/{birthDay}
                </div>
              )}
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col items-center justify-center px-3 pb-3 bg-white rounded-md">
                <QRCodeSVG value={`http://localhost:3000/add-friend/${uid || "default"}`} size={120} />
                {uid && (
                  <div className="text-xs font-serif text-textbrawnlight mt-2">
                    ID : {uid}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ID検索の横幅をCardContainerに合わせる */}
          <div className="relative w-full">
            <label className="block text-textbrawnlight text-lg mt-1 font-serif">ID検索</label>
            <div className=''>
              <input
                type="text"
                className="p-2 pr-16 border border-mainpink rounded-lg w-full text-sm shadow-md"
                onChange={handleInputChange}
                value={userId}
              />
              <button
                className="absolute right-2 top-3/4 transform -translate-y-1/2 bg-pin text-color rounded-full w-6 h-6 flex justify-center bg-mainpink"
                onClick={getSearch}
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* フッター部分を固定して浮かせる */}
      <div className="w-full absolute bottom-0">
        <Footer />
      </div>
    </div>

  );
}

export default QrPage;
