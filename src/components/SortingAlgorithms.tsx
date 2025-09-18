export interface SortingStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  description?: string;
}

export type AlgorithmName = 'bubbleSort' | 'selectionSort' | 'insertionSort' | 'mergeSort' | 'quickSort';

class SortingSteps {
  private steps: SortingStep[] = [];

  addStep(array: number[], comparing?: number[], swapping?: number[], description?: string) {
    this.steps.push({
      array: [...array],
      comparing: comparing ? [...comparing] : [],
      swapping: swapping ? [...swapping] : [],
      description,
    });
  }

  getSteps(): SortingStep[] {
    return this.steps;
  }
}

// Bubble Sort Implementation
function bubbleSort(arr: number[]): SortingStep[] {
  const steps = new SortingSteps();
  const array = [...arr];
  const n = array.length;

  steps.addStep(array, [], [], 'Starting Bubble Sort');

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      steps.addStep(array, [j, j + 1], [], `Comparing ${array[j]} and ${array[j + 1]}`);

      if (array[j] > array[j + 1]) {
        // Swap elements
        steps.addStep(array, [], [j, j + 1], `Swapping ${array[j]} and ${array[j + 1]}`);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.addStep(array, [], [], `Swapped ${array[j + 1]} and ${array[j]}`);
      }
    }
  }

  steps.addStep(array, [], [], 'Bubble Sort Complete!');
  return steps.getSteps();
}

// Selection Sort Implementation
function selectionSort(arr: number[]): SortingStep[] {
  const steps = new SortingSteps();
  const array = [...arr];
  const n = array.length;

  steps.addStep(array, [], [], 'Starting Selection Sort');

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    steps.addStep(array, [i], [], `Finding minimum from position ${i}`);

    for (let j = i + 1; j < n; j++) {
      steps.addStep(array, [minIndex, j], [], `Comparing ${array[minIndex]} with ${array[j]}`);
      
      if (array[j] < array[minIndex]) {
        minIndex = j;
        steps.addStep(array, [minIndex], [], `New minimum found: ${array[minIndex]}`);
      }
    }

    if (minIndex !== i) {
      steps.addStep(array, [], [i, minIndex], `Swapping ${array[i]} with ${array[minIndex]}`);
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      steps.addStep(array, [], [], `Position ${i} now has ${array[i]}`);
    }
  }

  steps.addStep(array, [], [], 'Selection Sort Complete!');
  return steps.getSteps();
}

// Insertion Sort Implementation
function insertionSort(arr: number[]): SortingStep[] {
  const steps = new SortingSteps();
  const array = [...arr];
  const n = array.length;

  steps.addStep(array, [], [], 'Starting Insertion Sort');

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    steps.addStep(array, [i], [], `Inserting ${key} into sorted portion`);

    while (j >= 0 && array[j] > key) {
      steps.addStep(array, [j, j + 1], [], `Comparing ${array[j]} with ${key}`);
      
      steps.addStep(array, [], [j, j + 1], `Moving ${array[j]} to the right`);
      array[j + 1] = array[j];
      steps.addStep(array, [], [], `${array[j + 1]} moved to position ${j + 1}`);
      
      j--;
    }

    array[j + 1] = key;
    steps.addStep(array, [], [j + 1], `Placed ${key} at position ${j + 1}`);
  }

  steps.addStep(array, [], [], 'Insertion Sort Complete!');
  return steps.getSteps();
}

// Merge Sort Implementation
function mergeSort(arr: number[]): SortingStep[] {
  const steps = new SortingSteps();
  const array = [...arr];

  steps.addStep(array, [], [], 'Starting Merge Sort');

  function merge(left: number, middle: number, right: number) {
    const leftArray = array.slice(left, middle + 1);
    const rightArray = array.slice(middle + 1, right + 1);

    let i = 0, j = 0, k = left;

    steps.addStep(array, Array.from({length: right - left + 1}, (_, idx) => left + idx), [], 
      `Merging subarrays [${left}..${middle}] and [${middle + 1}..${right}]`);

    while (i < leftArray.length && j < rightArray.length) {
      steps.addStep(array, [k], [], `Comparing ${leftArray[i]} and ${rightArray[j]}`);

      if (leftArray[i] <= rightArray[j]) {
        array[k] = leftArray[i];
        steps.addStep(array, [], [k], `Placed ${leftArray[i]} at position ${k}`);
        i++;
      } else {
        array[k] = rightArray[j];
        steps.addStep(array, [], [k], `Placed ${rightArray[j]} at position ${k}`);
        j++;
      }
      k++;
    }

    while (i < leftArray.length) {
      array[k] = leftArray[i];
      steps.addStep(array, [], [k], `Placed remaining ${leftArray[i]} at position ${k}`);
      i++;
      k++;
    }

    while (j < rightArray.length) {
      array[k] = rightArray[j];
      steps.addStep(array, [], [k], `Placed remaining ${rightArray[j]} at position ${k}`);
      j++;
      k++;
    }
  }

  function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      const middle = Math.floor((left + right) / 2);

      steps.addStep(array, [], [], `Dividing array: [${left}..${middle}] and [${middle + 1}..${right}]`);

      mergeSortHelper(left, middle);
      mergeSortHelper(middle + 1, right);
      merge(left, middle, right);
    }
  }

  mergeSortHelper(0, array.length - 1);
  steps.addStep(array, [], [], 'Merge Sort Complete!');
  return steps.getSteps();
}

// Quick Sort Implementation
function quickSort(arr: number[]): SortingStep[] {
  const steps = new SortingSteps();
  const array = [...arr];

  steps.addStep(array, [], [], 'Starting Quick Sort');

  function partition(low: number, high: number): number {
    const pivot = array[high];
    steps.addStep(array, [high], [], `Pivot selected: ${pivot} at position ${high}`);

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.addStep(array, [j, high], [], `Comparing ${array[j]} with pivot ${pivot}`);

      if (array[j] < pivot) {
        i++;
        steps.addStep(array, [], [i, j], `Swapping ${array[i]} and ${array[j]}`);
        [array[i], array[j]] = [array[j], array[i]];
        steps.addStep(array, [], [], `Elements ${array[i]} and ${array[j]} swapped`);
      }
    }

    steps.addStep(array, [], [i + 1, high], `Moving pivot ${pivot} to correct position`);
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.addStep(array, [], [], `Pivot ${array[i + 1]} now at position ${i + 1}`);

    return i + 1;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      steps.addStep(array, Array.from({length: high - low + 1}, (_, idx) => low + idx), [], 
        `Sorting subarray [${low}..${high}]`);

      const pivotIndex = partition(low, high);

      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    }
  }

  quickSortHelper(0, array.length - 1);
  steps.addStep(array, [], [], 'Quick Sort Complete!');
  return steps.getSteps();
}

export const SortingAlgorithms: Record<AlgorithmName, (arr: number[]) => SortingStep[]> = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
};
