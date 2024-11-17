"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import CardContainer from "./components/CardContainer";
import CardTitle from "./components/CardTitle";
import Image from "next/image";
import WideDecisionButton from "./components/WideDecisionButton";
import { login, logout } from "@/lib/auth";

export default function Home() {
  const user = useAuth(); // useAuthで現在のユーザー情報を取得
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) {
      // ロード中の場合は何もしない
      return;
    }

    if (user === null) {
      // ユーザーがログインしていない場合
      return;
    }

    // birthMonth と birthDay の存在でリダイレクト先を決定
    if (user.birthMonth) {
      router.push("/birth-tree");
    } else {
      router.push("/profile");
    }
  }, [user, router]);

  return (
    <div className="h-screen flex items-center justify-center pt-6">
      {user === null && (
        <CardContainer>
          <CardTitle title="LOGIN" />
          <div className="text-center">
            <div className="text-xl my-4 text-textbrawnlight font-serif">
              BirthPINでお誕生日を祝おう
            </div>
            <div className="mb-6">
              <Image
                src="/usericonshadow.svg"
                width={140}
                height={140}
                alt="user_img"
                className="mx-auto"
              />
            </div>
            <WideDecisionButton onClick={login} />
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
    </div>
  );
}
