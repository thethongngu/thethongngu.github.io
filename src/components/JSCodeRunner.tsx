import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface ConsoleEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: number;
}

const DEFAULT_CODE = `// Welcome to JS Code Runner!
// Type your JavaScript code here and click Run to execute

console.log("Hello, World!");

// Try some examples:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Math operations
const result = Math.random() * 100;
console.log("Random number:", Math.floor(result));

// Function example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(8):", fibonacci(8));
`;

function JSCodeRunner() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef(null);

  // Ensure Monaco only loads on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'function') return value.toString();
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (error) {
        return '[Circular Reference]';
      }
    }
    return String(value);
  };

  const addConsoleEntry = (type: ConsoleEntry['type'], ...args: any[]) => {
    const content = args.map(formatValue).join(' ');
    const newEntry: ConsoleEntry = {
      type,
      content,
      timestamp: Date.now()
    };
    setConsoleOutput(prev => [...prev, newEntry]);
  };

  const runCode = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setConsoleOutput([]);
    
    // Create a safe environment for code execution
    const safeGlobals = {
      console: {
        log: (...args: any[]) => addConsoleEntry('log', ...args),
        error: (...args: any[]) => addConsoleEntry('error', ...args),
        warn: (...args: any[]) => addConsoleEntry('warn', ...args),
        info: (...args: any[]) => addConsoleEntry('info', ...args),
      },
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      setTimeout: (callback: Function, delay: number) => {
        return setTimeout(callback, Math.min(delay, 5000)); // Max 5 seconds
      },
      setInterval: (callback: Function, delay: number) => {
        return setInterval(callback, Math.max(delay, 100)); // Min 100ms
      },
      clearTimeout,
      clearInterval,
    };

    try {
      // Create function with restricted scope
      const func = new Function(
        ...Object.keys(safeGlobals),
        code
      );
      
      // Execute with timeout
      const timeoutId = setTimeout(() => {
        addConsoleEntry('error', 'Execution timeout (5 seconds)');
        setIsRunning(false);
      }, 5000);
      
      func(...Object.values(safeGlobals));
      clearTimeout(timeoutId);
      
    } catch (error: any) {
      addConsoleEntry('error', error.message || 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const getConsoleEntryStyle = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-green-400';
    }
  };

  const getConsoleEntryPrefix = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '>';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">JS Code Runner</h1>
            <div className="flex space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning || !isClient}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isRunning || !isClient
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {!isClient ? 'Loading...' : isRunning ? 'Running...' : '▶ Run Code'}
              </button>
              <button
                onClick={clearConsole}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
              >
                🗑️ Clear Console
              </button>
            </div>
          </div>
          <a
            href="/projects"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Projects
          </a>
        </div>
      </div>
      

      {/* Main content */}
      <div className="flex h-[calc(100vh-80px)]">

        <div className="w-1/4 flex flex-col">
          {/* Problem Statement Panel */}
          <div className="h-1/2 flex flex-col border-b border-gray-700">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h2 className="font-medium text-gray-300">Problem Statement</h2>
            </div>
            <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
              <div className="text-gray-500 italic">
                Problem statement will appear here...
              </div>
            </div>
          </div>

          {/* Test Results Panel */}
          <div className="h-1/2 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h2 className="font-medium text-gray-300">Test Results</h2>
            </div>
            <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
              <div className="text-gray-500 italic">
                Test results will appear here...
              </div>
            </div>
          </div>
        </div>
        

        {/* Middle Column - Code Editor */}
        <div className="flex-1 border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <h2 className="font-medium text-gray-300">JavaScript Editor</h2>
          </div>
          {!isClient ? (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-gray-400 text-lg">Loading editor...</div>
            </div>
          ) : (
            <Editor
              ref={editorRef}
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                padding: { top: 16, bottom: 16 },
              }}
            />
          )}
        </div>

        {/* Left Column - Console Output */}
        <div className="w-1/4 flex flex-col bg-black border-r border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <h2 className="font-medium text-gray-300">Console Output</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {consoleOutput.length === 0 ? (
              <div className="text-gray-500 italic">
                Console output will appear here when you run your code...
              </div>
            ) : (
              consoleOutput.map((entry, index) => (
                <div key={index} className="mb-2 flex items-start space-x-2">
                  <span className="text-gray-400 text-xs mt-1">
                    {getConsoleEntryPrefix(entry.type)}
                  </span>
                  <pre className={`whitespace-pre-wrap break-words ${getConsoleEntryStyle(entry.type)}`}>
                    {entry.content}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JSCodeRunner;
