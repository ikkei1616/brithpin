"use client"
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';

const Loading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0); // 3秒後にローディングを非表示（時間は調整可能）

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  if (!isLoading) return null; // ローディングを非表示にする場合

  return(
    <>
      <Stack
        sx={{ 
          justifyContent: 'center',
          alignItems: 'center',        
          height: '100vh',
          width: '100vw' ,
        }} 
        spacing={2} 
        direction="row"
        >
        <CircularProgress color="secondary" 
          size = {200}
          thickness = {1.2}
          sx={{ 
          color: '#FEB69F',
          }} 
        />
      </Stack>  
    </>
  )
}

export default Loading