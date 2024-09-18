"use client";
import { useAuth } from "@/context/auth";
import { login, logout } from "@/lib/auth";
import { useState } from "react";
import Notification from "@/components/Notification";
import Footer from "../components/Footer";

export default function Home() {
  
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);

  const signIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };
  return (
    <div>
      {user === null && !waiting && <button onClick={signIn}>ログイン</button>}
      {user && <button onClick={logout}>ログアウト</button>}
      <Notification />
      <Footer />
    </div>
  );
}
