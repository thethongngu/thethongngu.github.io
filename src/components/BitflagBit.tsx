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
      <div className="text-2xl font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
        {index}
      </div>
      <div className="mt-1 w-full h-12 flex items-center justify-center text-4xl font-semibold bg-gray-100 group-hover:bg-blue-50 border-2 border-gray-200 group-hover:border-blue-500 rounded-md transition-all duration-200">
        {bit}
      </div>
    </div>
  );
};
