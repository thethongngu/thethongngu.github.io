import React from 'react';

export interface HoverInfo {
  index: number;
  value: bigint;
}

interface InfoPanelProps {
  hoverInfo: HoverInfo | null;
  numberValue: bigint | null;
  error: string | null;
}

const formatBigInt = (n: bigint): string => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const BitflagInfoPanel: React.FC<InfoPanelProps> = ({ hoverInfo, numberValue, error }) => {
  const renderContent = () => {
    if (error) {
       return (
        <>
          <p className="text-sm text-red-400">Error</p>
          <p className="text-2xl font-bold text-red-400 mt-1">---</p>
        </>
      )
    }
    
    if (hoverInfo) {
      return (
        <>
          <p className="text-sm text-gray-400">Value from bit 0 to <span className="font-semibold text-cyan-400">{hoverInfo.index}</span></p>
          <p className="text-3xl font-bold text-white mt-1 break-all px-2">{formatBigInt(hoverInfo.value)}</p>
        </>
      );
    }
    
    return (
      <>
        <p className="text-sm text-gray-400">Total Decimal Value</p>
        <p className="text-3xl font-bold text-white mt-1 break-all px-2">
          {numberValue !== null ? formatBigInt(numberValue) : '---'}
        </p>
      </>
    );
  };

  return (
    <div className="w-full max-w-lg h-28 p-4 bg-gray-800 border border-gray-700 rounded-lg flex flex-col justify-center items-center text-center transition-all duration-200 ease-in-out">
      {renderContent()}
    </div>
  );
};
