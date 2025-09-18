import React, { useState, useMemo, useCallback } from 'react';
import { BitflagBit } from './BitflagBit';
import { BitflagInfoPanel, type HoverInfo } from './BitflagInfoPanel';

function BitflagInspector() {
  const [inputValue, setInputValue] = useState<string>('1337');
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const { numberValue, binaryString, error } = useMemo(() => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '') {
      return { numberValue: 0n, binaryString: '0', error: null };
    }
    try {
      // Allow for "0x" hex and "0b" binary prefixes, otherwise treat as decimal
      const num = BigInt(trimmedInput);
      return { numberValue: num, binaryString: num.toString(2), error: null };
    } catch (e) {
      return { numberValue: null, binaryString: 'Invalid Number', error: 'Please enter a valid integer.' };
    }
  }, [inputValue]);

  const handleMouseEnter = useCallback((mapIndex: number) => {
    if (error) return;
    const realBitIndex = binaryString.length - 1 - mapIndex;
    const subString = binaryString.slice(mapIndex);
    const value = BigInt('0b' + subString);
    setHoverInfo({ index: realBitIndex, value });
  }, [binaryString, error]);

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  return (
    <div className="text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8 select-none">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 tracking-wide">Bitflag Inspector</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Hover over a bit's index to see its cumulative value from the right.</p>
        </header>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number..."
          className={`w-full max-w-lg p-3 bg-white border-2 rounded-lg text-center text-xl text-gray-800 focus:outline-none transition-colors ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
        />

        <BitflagInfoPanel hoverInfo={hoverInfo} numberValue={numberValue} error={error} />

        {error ? (
          <div className="flex items-center justify-center h-48 text-red-500">{error}</div>
        ) : (
          <div
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-center items-end flex-wrap gap-x-1 sm:gap-x-2 gap-y-4"
            onMouseLeave={handleMouseLeave}
          >
            {binaryString.split('').map((bit, mapIndex) => (
              <BitflagBit
                key={binaryString.length - 1 - mapIndex}
                bit={bit}
                index={binaryString.length - 1 - mapIndex}
                onMouseEnter={() => handleMouseEnter(mapIndex)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BitflagInspector;
