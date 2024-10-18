'use client';
import AuthContext, { fetchFriendsID, fetchFriends } from "@/context/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export type FriendSchema = {
  id: string;
  birthMonth: number;
  birthDay: number;
  nickname: string;
  name: string;
  photoURL: string;
}

export default function BirthTree() {
  const authValue = useContext(AuthContext);
  const router = useRouter()

  const [friends, setFriends] = useState<FriendSchema[]>([]);

  const onClickRoute = () => {
    router.push('/account')
  }

  const maxLeftValue = 100;
  const maxTopValue = 100;
  const locate = [
    { left: 43, top: 0 },
    { left: 30, top: 15 },
    { left: 60, top: 20 },
    { left: 42, top: 30 },
    { left: 20, top: 43 },
    { left: 48, top: 50 },
    { left: 75, top: 57 },
    { left: 40, top: 67 },
    { left: 10, top: 73 },
  ]

  useEffect(() => {
    (async () => {

      const friendIDList: string[] = await fetchFriendsID();

      fetchFriends(friendIDList);

      const friendList = await fetchFriends(friendIDList);

      // フレンドリストのデータを保存
      setFriends(friendList);

    })()
  }, [authValue]);

  const sortFriendsByBirthday = (friendList: FriendSchema[]): FriendSchema[] => {
    const today = new Date();

    return friendList.sort((a, b) => {
      const dateA = new Date(today.getFullYear(), a.birthMonth - 1, a.birthDay + 1);
      const dateB = new Date(today.getFullYear(), b.birthMonth - 1, b.birthDay + 1);

      // 今年の誕生日がまだ来ているかどうか判断
      const nextBirthdayA = dateA >= today ? dateA : new Date(today.getFullYear() + 1, a.birthMonth - 1, a.birthDay);
      const nextBirthdayB = dateB > today ? dateB : new Date(today.getFullYear() + 1, b.birthMonth - 1, b.birthDay);

      return nextBirthdayA.getTime() - nextBirthdayB.getTime();
    });
  };

  const sortedFriends = sortFriendsByBirthday(friends);
  const sortedFriendsWithBirthDayFlag = sortedFriends.map(friend => {
    const today = new Date();
    const isBirthDayToday = (today.getMonth() + 1 === friend.birthMonth) && (today.getDate() === friend.birthDay);

    return {
      ...friend,
      isBirthDayToday
    }
  })
  // 実行
  return (
    <div className="flex w-screen h-screen justify-center items-end">
      <div 
        className="
        bg-no-repeat 
        bg-contain
        max-w-[70vw] 
        max-h-[70vh] 
        w-[100vw] 
        h-[100vh] 
        relative
        lg:max-w-[70vw] 
        lg:max-h-[70vh]
      "
        style={{ backgroundImage: "url('/tree.svg')",backgroundPosition: "bottom center", }}
      >
      </div>
    </div>
  );
}
