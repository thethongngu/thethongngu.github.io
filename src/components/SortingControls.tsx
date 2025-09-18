import React from 'react';
import { type AlgorithmName } from './SortingAlgorithms';

interface SortingControlsProps {
  selectedAlgorithm: AlgorithmName;
  onAlgorithmChange: (algorithm: AlgorithmName) => void;
  animationSpeed: 'slow' | 'medium' | 'fast';
  onSpeedChange: (speed: 'slow' | 'medium' | 'fast') => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  isCustomArray: boolean;
  onCustomArrayToggle: (isCustom: boolean) => void;
  customArrayInput: string;
  onCustomArrayInputChange: (input: string) => void;
  onApplyCustomArray: () => void;
  onGenerateRandomArray: () => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  currentStep: number;
  totalSteps: number;
}

const algorithms: { value: AlgorithmName; label: string }[] = [
  { value: 'bubbleSort', label: 'Bubble Sort' },
  { value: 'selectionSort', label: 'Selection Sort' },
  { value: 'insertionSort', label: 'Insertion Sort' },
  { value: 'mergeSort', label: 'Merge Sort' },
  { value: 'quickSort', label: 'Quick Sort' },
];

export function SortingControls({
  selectedAlgorithm,
  onAlgorithmChange,
  animationSpeed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  isCustomArray,
  onCustomArrayToggle,
  customArrayInput,
  onCustomArrayInputChange,
  onApplyCustomArray,
  onGenerateRandomArray,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  canStepForward,
  canStepBackward,
}: SortingControlsProps) {
  return (
    <div className="w-full max-w-4xl bg-gray-800/50 rounded-lg p-6 space-y-6">
      {/* Algorithm Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm</label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmName)}
          className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          disabled={isPlaying}
        >
          {algorithms.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Array Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Array Size: {arraySize}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
            className="w-full"
            disabled={isPlaying || isCustomArray}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Speed</label>
          <select
            value={animationSpeed}
            onChange={(e) => onSpeedChange(e.target.value as 'slow' | 'medium' | 'fast')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      {/* Custom Array Toggle */}
      <div>
        <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isCustomArray}
            onChange={(e) => onCustomArrayToggle(e.target.checked)}
            className="form-checkbox h-4 w-4 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
            disabled={isPlaying}
          />
          <span>Use custom array</span>
        </label>
      </div>

      {/* Custom Array Input */}
      {isCustomArray && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Custom Array (comma-separated, values 5-300)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customArrayInput}
              onChange={(e) => onCustomArrayInputChange(e.target.value)}
              placeholder="10, 50, 30, 80, 20..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              disabled={isPlaying}
            />
            <button
              onClick={onApplyCustomArray}
              disabled={isPlaying}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Generate Random Array Button */}
      {!isCustomArray && (
        <button
          onClick={onGenerateRandomArray}
          disabled={isPlaying}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate New Array
        </button>
      )}

      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onStepBackward}
          disabled={!canStepBackward || isPlaying}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ⏮️ Step Back
        </button>
        
        {isPlaying ? (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ⏸️ Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ▶️ Play
          </button>
        )}

        <button
          onClick={onStepForward}
          disabled={!canStepForward || isPlaying}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Step Forward ⏭️
        </button>

        <button
          onClick={onReset}
          disabled={isPlaying}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
