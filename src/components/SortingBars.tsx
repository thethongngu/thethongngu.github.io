import React from 'react';

interface SortingBarsProps {
  array: number[];
  comparisons: number[];
  swaps: number[];
  maxValue: number;
}

export function SortingBars({ array, comparisons, swaps, maxValue }: SortingBarsProps) {
  const maxHeight = 400; // Maximum height in pixels

  const getBarColor = (index: number) => {
    if (swaps.includes(index)) {
      return 'bg-red-500'; // Red for elements being swapped
    } else if (comparisons.includes(index)) {
      return 'bg-yellow-400'; // Yellow for elements being compared
    } else {
      return 'bg-cyan-400'; // Default cyan color
    }
  };

  const getBarHeight = (value: number) => {
    return Math.max((value / maxValue) * maxHeight, 4); // Minimum height of 4px
  };

  return (
    <div className="w-full bg-gray-800/30 rounded-lg p-4 overflow-x-auto">
      <div 
        className="flex items-end justify-center gap-1 min-w-max mx-auto"
        style={{ minHeight: maxHeight + 40 }} // Extra space for labels
      >
        {array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            style={{ minWidth: Math.max(array.length > 50 ? 8 : 12, 100 / array.length) }}
          >
            {/* Bar */}
            <div
              className={`${getBarColor(index)} rounded-t transition-all duration-150 flex items-end justify-center relative`}
              style={{ 
                height: getBarHeight(value),
                width: '100%',
                minWidth: array.length > 50 ? 6 : 10
              }}
            >
              {/* Value label - only show for smaller arrays */}
              {array.length <= 30 && (
                <span 
                  className="text-xs text-white font-bold mb-1 drop-shadow-lg"
                  style={{ 
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {value}
                </span>
              )}
            </div>
            
            {/* Index label - only show for smaller arrays */}
            {array.length <= 30 && (
              <span className="text-xs text-gray-400 mt-1 select-none">
                {index}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-cyan-400 rounded"></div>
          <span className="text-gray-300">Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-gray-300">Comparing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-300">Swapping</span>
        </div>
      </div>
    </div>
  );
}
