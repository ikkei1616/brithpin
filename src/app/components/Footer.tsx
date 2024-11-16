'use client';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useColorContext } from '@/context/ColorContext';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, season } = useColorContext();

  const getImageSrc = (base: string) => {
    switch (season) {
      case 'spring':
        return `${base}-spring.svg`;
      case 'summer':
        return `${base}-summer.svg`;
      case 'autumn':
        return `${base}-autumn.svg`;
      case 'winter':
        return `${base}-winter.svg`;
      default:
        return `${base}.svg`;
    }
  };

  return (
    <div style={{ borderColor: colors.bg }} className='flex justify-around py-4 border-t border-mainpink'>
      <button
        onClick={() => router.push('/account')}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-20 h-6 flex items-center justify-center">
          <Image
            src={pathname === '/account' ? getImageSrc("/getuphiyoko") : getImageSrc("/sleephiyoko")}
            width={50}
            height={46}
            alt="user_img"
          />
        </div>
        <p className='text-xs font-serif mt-2 text-textbrawnlight'>プロフィール</p>
      </button>

      <button
        onClick={() => router.push('/qr')}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-20 h-6 flex items-center justify-center">
          <Image
            src={pathname === '/qr' ? getImageSrc("/getuphiyoko") : getImageSrc("/sleephiyoko")}
            width={50}
            height={46}
            alt="user_img"
          />
        </div>
        <p className='text-xs font-serif mt-2 text-textbrawnlight'>フレンド追加</p>
      </button>

      <button
        onClick={() => router.push('/birth-tree')}
        className="flex flex-col items-center focus:outline-none"
      >
        <div className="w-20 h-6 flex items-center justify-center">
          <Image
            src={pathname === '/birth-tree' ? getImageSrc("/getuphiyoko") : getImageSrc("/sleephiyoko")}
            width={50}
            height={46}
            alt="user_img"
          />
        </div>
        <p className='text-xs font-serif mt-2 text-textbrawnlight'>誕生日ツリー</p>
      </button>
    </div>
  );
}

export default Footer;
