'use client';
import React from 'react'
import { ProfileForm } from '../../components/ProfileForm';

const ProfilePage = () => {
  return (
    <div className='h-screen flex items-center justify-center pt-6'>
      <div>
        <ProfileForm />
      </div>
    </div>
  )
}

export default ProfilePage