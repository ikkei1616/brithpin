'use client';
import React from 'react';
import { useColorContext } from '@/context/ColorContext';

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  const { colors } = useColorContext();

  return (
    <div style={{ borderColor: colors.bg }} className="p-6 max-w-md rounded-3xl border-2 shadow-lg m-5">
      {children}
    </div>
  );
};

export default CardContainer;
