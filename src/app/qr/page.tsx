'use client';
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { useColorContext } from '@/context/ColorContext';

const QrPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [uid, setUid] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const router = useRouter();
  const { colors } = useColorContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        await fetchUserData(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNickname(data.nickname);
        setBirthYear(data.birthYear);
        setBirthMonth(data.birthMonth);
        setBirthDay(data.birthDay);
      } else {
        console.log("ユーザーデータが存在しません");
      }
    } catch (error) {
      console.log("データ取得エラー:", error);
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
          <div style={{ borderColor: colors.bg }} className='max-w-md rounded-3xl border-2 shadow-lg px-16 py-3'>
            <div style={{ borderColor: colors.bg }} className='text-center text-2xl text-textbrawn font-aboreto border-b border-dashed py-2'>
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
              <div className="flex flex-col items-center justify-center px-3 pb-3rounded-md">
                <QRCodeSVG value={`https://brithpin.vercel.app/add-friend/${uid || "default"}`} size={120} />
              </div>
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
