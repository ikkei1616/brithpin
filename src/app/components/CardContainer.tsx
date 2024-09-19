import React from 'react';

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <div className="p-8 max-w-md rounded-3xl border-mainpink border-2 shadow-lg m-5">
      {children}
    </div>
  );
};

export default CardContainer;
