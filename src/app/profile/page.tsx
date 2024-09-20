'use client';
import React from 'react'
import { ProfileForm } from '../../components/ProfileForm';

const ProfilePage = () => {
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