import React from 'react';

interface BitProps {
  bit: string;
  index: number;
  onMouseEnter: () => void;
}

export const BitflagBit: React.FC<BitProps> = ({ bit, index, onMouseEnter }) => {
  return (
    <div
      className="flex flex-col items-center justify-end w-12 h-24 cursor-pointer group"
      onMouseEnter={onMouseEnter}
    >
      <div className="text-2xl font-bold text-gray-400 group-hover:text-cyan-400 transition-colors duration-200">
        {index}
      </div>
      <div className="mt-1 w-full h-12 flex items-center justify-center text-4xl font-semibold bg-gray-700/50 group-hover:bg-cyan-500/20 border-2 border-transparent group-hover:border-cyan-500 rounded-md transition-all duration-200">
        {bit}
      </div>
    </div>
  );
};
