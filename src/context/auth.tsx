"use client"
import React from "react";
import { auth, db } from "../lib/firebase";
import { User } from "../types/user";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { collection, getDocs } from "firebase/firestore";

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // console.log(firebaseUser);
        const ref = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const appUser = (await getDoc(ref)).data() as User;
          setUser(appUser);
        } else {
          const appUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName!,
          };
          setDoc(ref, appUser).then(() => {
            setUser(appUser);
          });
        }
      } else {
        setUser(null);
      }

      return unsubscribe;
    });
  }, []);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const fetchFriendsID = async () => {
  try {
    // 特定のuidドキュメントを取得
    if (auth.currentUser?.uid == null) {
      console.log("おーい")
      return
    }

    const docRef = doc(db, "users", auth.currentUser?.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // `friend`フィールドの配列を取得
      console.log("friendフィールドの配列を取得")
      const userData = docSnap.data();
      // const userFata = docSnap.data().friend;

      return userData.friends;
    } else {
      console.log("ドキュメントが存在しません");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};


// friendListの各IDに対してFirestoreからユーザーの全データを取得
export const fetchFriends = async (friendList: string[]): Promise<any[]> => {
  console.log("わーい");
  try {
    // friendListの各IDに対してFirestoreからユーザーのドキュメントを取得
    const friendsData = await Promise.all(
      friendList.map(async (friendId) => {
        const docRef = doc(db, "users", friendId); // 各フレンドIDに基づいてドキュメントを取得
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // ドキュメントのデータを取得して返す
          const friendData = docSnap.data();
          console.log(friendData); // 取得したデータをログに出力
          return friendData; // 取得したユーザーデータを返す
        } else {
          console.log(`ユーザー ${friendId} のドキュメントが存在しません`);
          return null; // ドキュメントが存在しない場合はnullを返す
        }
      })
    );

    // nullを除外して有効なデータのみを返す
    return friendsData.filter((friend) => friend !== null);
  } catch (error) {
    console.error("フレンドのデータ取得中にエラーが発生しました:", error);
    return [];
  }
};
   
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
