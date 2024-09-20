"use client";
import { useAuth } from "@/context/auth";
import { login, logout } from "@/lib/auth";
import { useState } from "react";
import CardContainer from "../components/CardContainer";
import CardTitle from "../components/CardTitle";
import Image from "next/image";
import WideDecisionButton from "../components/WideDecisionButton";
import Notification from "@/components/Notification";

export default function DebugPage() {
  
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
    <div className="h-screen flex items-center justify-center mt-6">
      {user === null && !waiting && (
        <CardContainer>
          <CardTitle title="LOGIN" />
          <div className="text-center">
            <div className="text-xl my-4 text-writingText font-serif">BirthPINでお誕生日を祝おう</div>
            <div className="mb-6">
              <Image src="/usericonshadow.svg" width={140} height={140} alt="user_img" className="mx-auto" />
            </div>
            <WideDecisionButton onClick={signIn} />
          </div>
        </CardContainer>
      )}
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
      <Notification />
    </div>
  );
}
