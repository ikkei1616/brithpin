'use client';
import React, { useState } from 'react'
import Footer from '../components/Footer'
import CardContainer from "../components/CardContainer";
import CardTitle from "../components/CardTitle";
import { useRouter } from 'next/navigation';

const QrPage = () => {
  const [userId,setUserId] = useState<string>("");
  const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>)=> {
    const NewId = event.currentTarget.value;
    setUserId(NewId);
  };

  const getSearch=()=>{
    if(userId.trim() !== ""){
      router.push('add-friend/${userId}');
    }else{
      console.log('Please enter a valid user ID.');
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <div>
        <div className="h-screen flex items-center justify-center mt-6">
          <CardContainer>
            <CardTitle title="FRIEND" />
            <div className="text-center">
            </div>
          </CardContainer>       
        <div>
          <input 
            type="text"
            className=" p-2 border border-pin rounded-lg"
            onChange={handleInputChange}
            value={userId}
            placeholder="idを記入してください"
          />
          <button
            className="mt-4 px-4 py-2 bg-pin text-white rounded-lg"
            onClick={getSearch}
          >
            検索
          </button>
        </div>
        </div>

      </div>


      <div className='fixed bottom-0 w-full'>
        <Footer />
      </div>
    </div>
  )
}

export default QrPage