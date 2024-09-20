"use client";
import React, { useEffect } from 'react'
import { requestPermission } from '../lib/firebase';

const Notification = () => {

  useEffect(() => {
    requestPermission();
  }, []);
  return (
    <div>Notification</div>
  )
}

export default Notification