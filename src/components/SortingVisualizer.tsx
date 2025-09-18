import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SortingAlgorithms, type SortingStep, type AlgorithmName } from './SortingAlgorithms';
import { SortingControls } from './SortingControls';
import { SortingBars } from './SortingBars';

const INITIAL_ARRAY_SIZE = 30;
const MIN_VALUE = 5;
const MAX_VALUE = 300;
const ANIMATION_SPEEDS = {
  slow: 800,
  medium: 400,
  fast: 100,
};

function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>('bubbleSort');
  const [animationSpeed, setAnimationSpeed] = useState<keyof typeof ANIMATION_SPEEDS>('medium');
  const [arraySize, setArraySize] = useState(INITIAL_ARRAY_SIZE);
  const [isCustomArray, setIsCustomArray] = useState(false);
  const [customArrayInput, setCustomArrayInput] = useState('');

  // Generate random array
  const generateRandomArray = useCallback((size: number) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE)
    );
    setArray(newArray);
    setCurrentStep(-1);
    setSteps([]);
    setIsPlaying(false);
  }, []);

  // Initialize with random array
  useEffect(() => {
    generateRandomArray(arraySize);
  }, [generateRandomArray, arraySize]);

  // Handle custom array input
  const applyCustomArray = useCallback(() => {
    try {
      const customArray = customArrayInput
        .split(',')
        .map(str => parseInt(str.trim(), 10))
        .filter(num => !isNaN(num) && num >= MIN_VALUE && num <= MAX_VALUE);
      
      if (customArray.length > 0) {
        setArray(customArray);
        setCurrentStep(-1);
        setSteps([]);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Invalid array input');
    }
  }, [customArrayInput]);

  // Generate steps when algorithm or array changes
  useEffect(() => {
    if (array.length > 0) {
      const newSteps = SortingAlgorithms[selectedAlgorithm]([...array]);
      setSteps(newSteps);
      setCurrentStep(-1);
      setIsPlaying(false);
    }
  }, [array, selectedAlgorithm]);

  // Animation control
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, ANIMATION_SPEEDS[animationSpeed]);

    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, steps.length, animationSpeed]);

  // Get current array state based on step
  const currentArray = useMemo(() => {
    if (currentStep === -1 || steps.length === 0) return array;
    return steps[currentStep].array;
  }, [array, steps, currentStep]);

  const currentComparisons = useMemo(() => {
    if (currentStep === -1 || steps.length === 0) return [];
    return steps[currentStep].comparing || [];
  }, [steps, currentStep]);

  const currentSwaps = useMemo(() => {
    if (currentStep === -1 || steps.length === 0) return [];
    return steps[currentStep].swapping || [];
  }, [steps, currentStep]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(-1);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-mono select-none">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 tracking-wide">
            Sorting Visualizer
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Watch how different sorting algorithms work step by step
          </p>
        </header>

        <SortingControls
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
          animationSpeed={animationSpeed}
          onSpeedChange={setAnimationSpeed}
          arraySize={arraySize}
          onArraySizeChange={setArraySize}
          isCustomArray={isCustomArray}
          onCustomArrayToggle={setIsCustomArray}
          customArrayInput={customArrayInput}
          onCustomArrayInputChange={setCustomArrayInput}
          onApplyCustomArray={applyCustomArray}
          onGenerateRandomArray={() => generateRandomArray(arraySize)}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          canStepForward={currentStep < steps.length - 1}
          canStepBackward={currentStep > -1}
          currentStep={currentStep}
          totalSteps={steps.length}
        />

        <SortingBars
          array={currentArray}
          comparisons={currentComparisons}
          swaps={currentSwaps}
          maxValue={MAX_VALUE}
        />

        {steps.length > 0 && (
          <div className="text-center text-gray-400 text-sm">
            <p>Step {Math.max(0, currentStep + 1)} of {steps.length}</p>
            {currentStep >= 0 && steps[currentStep].description && (
              <p className="mt-1 text-cyan-300">{steps[currentStep].description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SortingVisualizer;
