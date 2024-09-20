'use client';
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';

const ParentComponent = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]); // URLを保存するstate

  // setImage関数を定義
  const handleSetImage = (urls: string[]) => {
    console.log("Saved URLs: ", urls);
    setImageUrls(urls); // アップロードされた画像URLをstateに保存
  };

  return (
    <div>
      <h1>画像アップロード</h1>
      <FileUploader setImage={handleSetImage} />  {/* setImage関数を渡す */}
      {imageUrls.length > 0 && (
        <div>
          <h2>Uploaded Images:</h2>
          <ul>
            {imageUrls.map((url, index) => (
              <li key={index}>
                <img src={url} alt={`Uploaded ${index}`} width={100} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
