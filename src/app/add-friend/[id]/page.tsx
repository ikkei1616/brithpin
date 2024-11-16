"use client";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CardTitle from "@/app/components/CardTitle";
import { useColorContext } from "@/context/ColorContext";
import { useAuth } from "@/context/auth";

interface User {
  nickname: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: number;
  photoURL: string;
}

const IdSearch = ({ params }: { params: { id: string } }) => {
  const [friendData, setFriendData] = useState<User | undefined>(undefined);
  const router = useRouter();
  const { colors } = useColorContext();
  const auth = useAuth();
  const friendId = params.id;

  // ログイン状態を確認
  useEffect(() => {
    if (auth === undefined) return; // ローディング状態を待つ
    if (auth === null) {
      alert("ログインしてからもう一度お試しください");
      router.push("/");
    }
  }, [auth, router]);

  // 友人データを取得
  useEffect(() => {
    const fetchFriendData = async (id: string) => {
      try {
        const friendRef = doc(db, "users", id);
        const friendDoc = await getDoc(friendRef);
        if (friendDoc.exists()) {
          setFriendData(friendDoc.data() as User);
        } else {
          console.error("Friend data not found.");
        }
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };

    if (friendId) fetchFriendData(friendId);
  }, [friendId]);

  // 友達追加処理
  const handleAddFriend = async () => {
    if (!auth) return;

    try {
      const authRef = doc(db, "users", auth.id);
      const friendRef = doc(db, "users", friendId);

      await updateDoc(authRef, {
        friends: arrayUnion(friendId),
      });

      await updateDoc(friendRef, {
        friends: arrayUnion(auth.id),
      });

      router.push("/birth-tree");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const backToTree = () => {
    router.push("/birth-tree");
  };

  return (
    <div className="h-screen flex items-center justify-center pt-40">
      <div
        style={{ borderColor: colors.bg }}
        className="p-6 max-w-md rounded-3xl border-2 shadow-lg m-5 w-full mx-auto"
      >
        <CardTitle title="FRIEND" />
        <div className="mt-3 text-center">
          {friendData?.nickname && (
            <div className="text-base font-serif text-textbrawnlight mb-3">
              {friendData.nickname}
            </div>
          )}
          {friendData?.birthYear &&
            friendData.birthMonth &&
            friendData.birthDay && (
              <div className="text-base font-serif text-textbrawnlight mb-3">
                {friendData.birthYear}/{friendData.birthMonth}/{friendData.birthDay}
              </div>
            )}
        </div>
        <div className="flex justify-center items-center my-4">
          {friendData?.photoURL && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md">
              <Image
                src={friendData.photoURL}
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
            onClick={handleAddFriend}
          >
            友達追加
          </button>
          <button
            style={{ borderColor: colors.bg, color: colors.bg }}
            className="flex justify-center items-center radius-lg rounded-lg p-2 border w-full text-color text-sm"
            onClick={backToTree}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdSearch;
