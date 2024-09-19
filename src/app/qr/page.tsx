'use client';
import React from 'react'
import Footer from '../components/Footer'
import CardContainer from "../components/CardContainer";
import CardTitle from "../components/CardTitle";

const QrPage = () => {
  return (
    <div className='h-screen flex flex-col'>
      <div>
        <div className="h-screen flex items-center justify-center pt-6">
          <CardContainer>
            <CardTitle title="FRIEND" />
            <div className="text-center">
            </div>
          </CardContainer>
        </div>
      </div>
      <div className='fixed bottom-0 w-full'>
        <Footer />
      </div>
    </div>
  )
}

export default QrPage