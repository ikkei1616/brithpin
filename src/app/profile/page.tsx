'use client';
import React from 'react'
import { ProfileForm } from '../../components/ProfileForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth";

const ProfilePage = () => {
  const router = useRouter();
  const user = useAuth();
  useEffect(() => {
    if (user) {
      router.push('/profile');
    } else{
      router.push('/');
    }
  }, [user, router]);
  return (
    <div className='h-screen flex items-center justify-center pt-28'>
      <div>
        <ProfileForm />
      </div>
    </div>
  )
}

export default ProfilePage