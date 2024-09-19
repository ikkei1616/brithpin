'use client';
import AuthContext, { fetchFriendsID, fetchFriends } from "@/context/auth";
import Image from "next/image";
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

  const [friends, setFriends] = useState<FriendSchema[]>([]);

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

      const friendIDList:string[] = await fetchFriendsID();

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
    <div className="wapper">
      <div className="background">
        {sortedFriendsWithBirthDayFlag.map((friend, index) => {

          // locate配列の範囲外アクセスを防ぐ
          if (index >= locate.length) return null;

          return (
            <div key={friend.id} style={{
              position: "absolute",
              left: `${(locate[index].left / maxLeftValue) * 100}%`,
              top: `${(locate[index].top / maxTopValue) * 100}%`,
            }}>

              <img src="/fukidashi.png"
              
                className="hidden-element"
                style={{
                  position: "absolute",
                  top: -50,
                  minWidth: 70,
                  // display: friend.isBirthDayToday ? `block` : `none`,
                }}
              />
              <div
              className="font-serif text-textbrawnlight"
                style={{
                  position: "absolute",
                  top: -43,
                  left: 9,
                  width: "100%",
                  textAlign: "center",
                  fontSize: "10px", // 必要に応じてフォントサイズを調整
                }}
              >
                {`${friend.birthMonth} / ${friend.birthDay}`}
                <br />
                {friend.nickname}
              </div>
              <Image
                src={friend.photoURL}
                alt={`${friend.name}のアイコン`}
                width={50} height={50}
                className="hiyoko-active"
                style={
                  {

                    // boxShadow: `0 0 0 2px pink`, /* ピンク色の輪郭を追加 */

                    // backgroundColor: `white`,
                    // borderRadius: "50%", 
                    clipPath: `circle(50% at 50% 50%)`, /* 円形にクリッピング */
                    objectFit: "cover",

                  }
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  );
}