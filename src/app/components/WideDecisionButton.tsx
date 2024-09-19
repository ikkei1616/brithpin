import React from 'react';

interface WideDecisionButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const WideDecisionButton: React.FC<WideDecisionButtonProps> = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="px-14 py-3 bg-mainpink text-backgroundcolor rounded-lg transition-colors text-xs shadow-none font-serif font-bold"
      >
        Googleアカウントでログイン
      </button>
    </div>
  );
}

export default WideDecisionButton;
