"use client";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import CardContainer from "@/app/components/CardContainer";
import CardTitle from "@/app/components/CardTitle";
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
  const auth = useAuth();
  const friendId = params.id;

  useEffect(() => {
    if (auth === undefined) return;
    if (auth === null) {
      alert("ログインしてからもう一度お試しください");
      router.push("/");
    }
  }, [auth, router]);

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

  return (
    <div className="h-screen flex flex-col justify-around pt-4">
      <CardContainer>
        <CardTitle title="FRIEND" />
        <div className="mt-3">
          {friendData?.nickname && (
            <div className="text-base font-serif text-textbrawnlight text-center mb-3">
              {friendData.nickname}
            </div>
          )}
          {friendData?.birthYear &&
            friendData.birthMonth &&
            friendData.birthDay && (
              <div className="text-base font-serif text-textbrawnlight text-center mb-3">
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
        <div className="flex justify-center items-center bg-mainpink radius-lg rounded-lg p-2">
          <button className="text-color text-sm" onClick={handleAddFriend}>
            友達追加
          </button>
        </div>
      </CardContainer>
      <div className="w-full absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default IdSearch;
