"use client";
import { useEffect, useState,useRef } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import CardContainer from "./components/CardContainer";
import CardTitle from "./components/CardTitle";
import Image from "next/image";
import WideDecisionButton from "./components/WideDecisionButton";
import { login, logout } from "@/lib/auth";
import SplashScreen from "@/components/splashscreen";
import {usePathname} from "next/navigation"


export default function Home() {
  const user = useAuth(); // useAuthで現在のユーザー情報を取得
  const router = useRouter();
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isLoading, setIsLoading] = useState(isHome)
  const hasMounted = useRef(false);
  const hasExecuted = useRef(false);



  const finishLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (hasExecuted.current) {
      // 2回目以降のisLoadingの変化では何もしない
      console.log("isloading1回目")
      return;
    }

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
    hasExecuted.current = true;
  }, [isLoading]);

  useEffect(() => {
    if (!hasMounted.current) {
      // 初回レンダー時は処理をスキップ
      console.log("user,auth2回目")
      hasMounted.current = true;
      return;
    }
    
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
  }, [user]);




  return (
    <>
      {isLoading && isHome ? (
        <SplashScreen finishLoading = {finishLoading}/>
      ) : (
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
      )}
      
    </>
  );
}
