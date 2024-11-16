'use client';
import { useAuth } from "@/context/auth";
import { logout } from "@/lib/auth";
import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import CardContainer from '../../src/app/components/CardContainer';
import { useRouter } from 'next/navigation';
import FileUploader from './FileUploader';
import { z } from 'zod';
import { useColorContext } from '@/context/ColorContext';

const birthDateSchema = z
  .object({
    birthYear: z.number().min(1900, "1900年以降の年を入力してください").max(new Date().getFullYear(), "未来の年は入力できません"),
    birthMonth: z.number().min(1, "1〜12の間の月を入力してください").max(12, "1〜12の間の月を入力してください"),
    birthDay: z.number().min(1, "1〜31の間の日付を入力してください").max(31, "1〜31の間の日付を入力してください"),
  })
  .refine((data) => {
    const { birthYear, birthMonth, birthDay } = data;
    const isValidDate = new Date(birthYear, birthMonth - 1, birthDay).getDate() === birthDay;
    return isValidDate;
  }, "実在する日付を入力してください");

export const ProfileForm = () => {
  const { colors } = useColorContext();
  const [photoURL, setphotoURL] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useAuth();

  const handleSetImage = (urls: string[]) => {
    setphotoURL(urls);
  };

  const DataUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nickname = formData.get("nickname")?.toString();
    const birthYear = Number(formData.get("birthYear"));
    const birthMonth = Number(formData.get("birthMonth"));
    const birthDay = Number(formData.get("birthDay"));
    const gender = Number(formData.get("gender"));

    const validationResult = birthDateSchema.safeParse({ birthYear, birthMonth, birthDay });

    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    try {
      if (auth.currentUser?.uid == null) {
        return;
      }
      const docRef = doc(db, "users", auth.currentUser.uid);

      await updateDoc(docRef, {
        nickname: nickname,
        birthYear: birthYear,
        birthMonth: birthMonth,
        birthDay: birthDay,
        gender: gender,
        photoURL: photoURL.length > 0 ? photoURL[0] : null,
      });

      setError(null);
      router.push('/birth-tree');
    } catch (error) {
      setError("データの保存に失敗しました。もう一度お試しください。");
      console.log("エラーが発生しました", error);
    }
  };

  return (
    <CardContainer>
      <form onSubmit={DataUpdate}>
        <div className="flex justify-between items-center text-2xl text-textbrawnlight font-bold mb-0 font-serif border-b border-mainpinklight border-dashed pb-4 w-full">
          <div className='w-2/5 flex justify-end'>
            {user && (
              <button
                onClick={() => {
                  logout();
                }}
                className="text-sm font-serif text-textbrawnlight"
              >
                ログアウト
              </button>
            )}
          </div>
          <div className='flex justify-center w-full'>
            PROFILE
          </div>
          <div className='w-2/5 flex justify-around'>
            <input
              value={'登録'}
              type='submit'
              className="h-full rounded-lg text-base"
            />
            <div style={{ background: colors.bg }} className="transform bg-pin text-color rounded-full h-6 w-6 flex items-center">
              ✓
            </div>
          </div>
        </div>
        <div className='text-center'>
          <div className="text-base my-4 text-textbrawnlight font-serif">
            あなたの情報を入力してください
          </div>

          <div className="my-4">
            <FileUploader setImage={handleSetImage} />
          </div>

          <div className="space-y-3">
            <div className=''>
              <div className='flex'>
                <label className="block text-xs font-serif text-textbrawnlight">あだ名</label>
              </div>
              <input
                style={{ borderColor: colors.bg }}
                className="border-2 rounded-lg p-2 w-full text-textbrawnlight"
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
                  style={{ borderColor: colors.bg }}
                  className="border-2  rounded-lg p-2 w-1/3 text-textbrawnlight"
                  aria-label="birthYear"
                  name="birthYear"
                  type="number"
                />
                <div className='self-center text-xs font-serif text-textbrawnlight'>年</div>
                <input
                  style={{ borderColor: colors.bg }}
                  className="border-2 rounded-lg p-2 w-1/5 text-textbrawnlight"
                  aria-label="birthMonth"
                  name="birthMonth"
                  type="number"
                />
                <div className='self-center text-xs font-serif text-textbrawnlight'>月</div>
                <input
                  style={{ borderColor: colors.bg }}
                  className="border-2 rounded-lg p-2 w-1/5 text-textbrawnlight"
                  aria-label="birthDay"
                  name="birthDay"
                  type="number"
                />
                <div className='self-center text-xs font-serif text-textbrawnlight'>日</div>
              </div>
              {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
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
                  <div style={{ borderColor: colors.bg }} className="w-5/6 h-10 border-2 rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-mainpink">
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
                  <div style={{ borderColor: colors.bg }} className="w-5/6 h-10 border-2 rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-mainpink">
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
                  <div style={{ borderColor: colors.bg }} className="w-5/6 h-10 border-2 rounded-lg flex items-center justify-center peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-mainpink">
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
};
