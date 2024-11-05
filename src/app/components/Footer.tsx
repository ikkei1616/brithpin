'use client';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='flex justify-around py-2 border-t border-mainpink'>
      <button
        onClick={() => router.push('/account')}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-20 h-16 flex items-center justify-center">
          <Image
            src={pathname === '/account' ? "/getuphiyoko.svg" : "/sleephiyoko.svg"}
            width={76}
            height={70}
            alt="user_img"
          />
        </div>
        <p className='text-sm font-serif mt-2 text-textbrawnlight'>プロフィール</p>
      </button>

      <button
        onClick={() => router.push('/qr')}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-20 h-16 flex items-center justify-center">
          <Image
            src={pathname === '/qr' ? "/getuphiyoko.svg" : "/sleephiyoko.svg"}
            width={76}
            height={70}
            alt="user_img"
          />
        </div>
        <p className='text-sm font-serif mt-2 text-textbrawnlight'>フレンド追加</p>
      </button>

      <button
        onClick={() => router.push('/birth-tree')}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-20 h-16 flex items-center justify-center">
          <Image
            src={pathname === '/birth-tree' ? "/getuphiyoko.svg" : "/sleephiyoko.svg"}
            width={76}
            height={70}
            alt="user_img"
          />
        </div>
        <p className='text-sm font-serif mt-2 text-textbrawnlight'>誕生日ツリー</p>
      </button>
    </div>
  );
}

export default Footer;
