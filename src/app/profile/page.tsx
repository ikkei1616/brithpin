'use client';
import React, { useEffect } from 'react'
import { ProfileForm } from "../components/form";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from '@/context/auth';

const ProfilePage = () => {
  const router = useRouter();
  const user = useAuth();
  useEffect(() => {
    if (user == null) {
      router.push('/');
    }
  }, [user, router]);
  return (
    <div className='h-screen flex items-center justify-center pt-6'>
      <div>
        <ProfileForm />
      </div>
      {/* {user && (
        <button
          onClick={() => {
            logout();
          }}
          className="px-8 py-3 bg-pin text-defaultBackGround rounded-lg transition-colors text-lg shadow-md font-serif"
        >
          ログアウト
        </button>
      )} */}
    </div>
  )
}

export default ProfilePage