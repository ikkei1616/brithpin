import React from 'react'
import { useColorContext } from "@/context/ColorContext";

interface CardTitleProps {
  title: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ title }) => {
  const { colors } = useColorContext();
  return (
    <div style={{ borderColor: colors.bg}} className="text-center text-2xl text-textbrawn font-bold mb-0 font-aboreto border-b border-dashed pb-4">
      {title}
    </div>
  );
}

export default CardTitle;
