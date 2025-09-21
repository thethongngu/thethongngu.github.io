import React, { useState, useMemo, useCallback } from 'react';

interface TreeNodeProps {
  data: any;
  keyName?: string;
  level?: number;
  isLast?: boolean;
  path?: string[];
}

function TreeNode({ data, keyName, level = 0, isLast = true, path = [] }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  const indent = '  '.repeat(level);
  const currentPath = keyName ? [...path, keyName] : path;
  
  const getValueType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };
  
  const renderValue = (value: any) => {
    const valueType = getValueType(value);
    
    if (valueType === 'string') {
      return <span className="text-green-600">"{value}"</span>;
    } else if (valueType === 'number') {
      return <span className="text-blue-600">{value}</span>;
    } else if (valueType === 'boolean') {
      return <span className="text-purple-600">{String(value)}</span>;
    } else if (valueType === 'null') {
      return <span className="text-gray-500">null</span>;
    }
    
    return <span>{String(value)}</span>;
  };
  
  if (data === null || typeof data !== 'object') {
    return (
      <div className="font-mono text-sm">
        {indent}
        {keyName && (
          <>
            <span className="text-red-600">"{keyName}"</span>
            <span className="text-gray-500">: </span>
          </>
        )}
        {renderValue(data)}
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    );
  }
  
  const isArray = Array.isArray(data);
  const entries = isArray ? data.map((item, index) => [index, item]) : Object.entries(data);
  const hasChildren = entries.length > 0;
  
  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };
  
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  
  return (
    <div className="font-mono text-sm">
      <div 
        className={`${hasChildren ? 'cursor-pointer hover:bg-gray-100' : ''}`}
        onClick={toggleExpanded}
      >
        {indent}
        {hasChildren && (
          <span className="text-gray-400 mr-1">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {keyName && (
          <>
            <span className="text-red-600">"{keyName}"</span>
            <span className="text-gray-500">: </span>
          </>
        )}
        <span className="text-gray-500">{openBracket}</span>
        {!isExpanded && hasChildren && (
          <span className="text-gray-400">...</span>
        )}
        {!hasChildren && <span className="text-gray-500">{closeBracket}</span>}
        {!isLast && !isExpanded && <span className="text-gray-500">,</span>}
      </div>
      
      {isExpanded && hasChildren && (
        <>
          {entries.map(([key, value], index) => (
            <TreeNode
              key={`${currentPath.join('.')}.${key}`}
              data={value}
              keyName={isArray ? undefined : String(key)}
              level={level + 1}
              isLast={index === entries.length - 1}
              path={currentPath}
            />
          ))}
          <div className="font-mono text-sm">
            {indent}
            <span className="text-gray-500">{closeBracket}</span>
            {!isLast && <span className="text-gray-500">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

function tryPartialJSONParse(jsonString: string) {
  const trimmed = jsonString.trim();
  
  // First try parsing the full string
  try {
    const parsed = JSON.parse(trimmed);
    return {
      parsedData: parsed,
      formattedJSON: JSON.stringify(parsed, null, 2),
      isValid: true,
      error: null,
      partiallyParsed: false
    };
  } catch (fullError) {
    // If full parsing fails, try to find the largest valid JSON from the beginning
    let bestResult = {
      parsedData: null,
      formattedJSON: trimmed,
      isValid: false,
      error: fullError instanceof Error ? fullError.message : 'Invalid JSON',
      partiallyParsed: false
    };
    
    // Try parsing progressively smaller substrings
    for (let i = trimmed.length - 1; i >= 1; i--) {
      const substring = trimmed.substring(0, i);
      try {
        const parsed = JSON.parse(substring);
        // Found a valid partial JSON
        const formatted = JSON.stringify(parsed, null, 2);
        const remaining = trimmed.substring(i);
        
        return {
          parsedData: parsed,
          formattedJSON: formatted + '\n\n/* Invalid remaining content:\n' + remaining + '\n*/',
          isValid: false,
          error: `Partially valid JSON. Error at position ${i}: ${fullError instanceof Error ? fullError.message : 'Invalid JSON'}`,
          partiallyParsed: true
        };
      } catch (partialError) {
        // Continue trying smaller substrings
        continue;
      }
    }
    
    return bestResult;
  }
}

export default function JSONFormatter() {
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York",\n  "hobbies": ["reading", "swimming"],\n  "active": true\n}');
  const [view, setView] = useState<'formatted' | 'tree'>('formatted');
  
  const { formattedJSON, parsedData, isValid, error, partiallyParsed } = useMemo(() => {
    if (!input.trim()) {
      return { 
        formattedJSON: '', 
        parsedData: null, 
        isValid: false, 
        error: 'Empty input',
        partiallyParsed: false
      };
    }
    
    return tryPartialJSONParse(input);
  }, [input]);
  
  const handleBeautify = useCallback(() => {
    if ((isValid || partiallyParsed) && parsedData !== null) {
      const beautified = JSON.stringify(parsedData, null, 2);
      setInput(beautified);
    }
  }, [isValid, partiallyParsed, parsedData]);
  
  const handleMinify = useCallback(() => {
    if ((isValid || partiallyParsed) && parsedData !== null) {
      const minified = JSON.stringify(parsedData);
      setInput(minified);
    }
  }, [isValid, partiallyParsed, parsedData]);
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText((isValid || partiallyParsed) ? formattedJSON : input);
      // You could add a toast notification here if desired
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [isValid, partiallyParsed, formattedJSON, input]);
  
  return (
    <div className="text-gray-800 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 tracking-wide">
          JSON Formatter
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Format, validate, and visualize JSON data with tree view
        </p>
      </header>
      
      {/* Validation Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isValid ? 'bg-green-500' : (partiallyParsed ? 'bg-yellow-500' : 'bg-red-500')
          }`}></div>
          <span className={`text-sm font-medium ${
            isValid ? 'text-green-600' : (partiallyParsed ? 'text-yellow-600' : 'text-red-600')
          }`}>
            {isValid ? 'Valid JSON' : (partiallyParsed ? 'Partially Valid JSON' : 'Invalid JSON')}
          </span>
          {error && (
            <span className="text-xs text-gray-500">- {error}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('formatted')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'formatted' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Formatted
          </button>
          <button
            onClick={() => setView('tree')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'tree' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={!isValid && !partiallyParsed}
          >
            Tree View
          </button>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleBeautify}
          disabled={!isValid && !partiallyParsed}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Beautify
        </button>
        <button
          onClick={handleMinify}
          disabled={!isValid && !partiallyParsed}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Minify
        </button>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Copy
        </button>
        <button
          onClick={() => setInput('')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Input JSON</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className={`w-full h-96 p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
              isValid 
                ? 'border-gray-300 focus:ring-blue-500 focus:border-transparent' 
                : 'border-red-300 focus:ring-red-500 focus:border-transparent'
            }`}
            spellCheck={false}
          />
        </div>
        
        {/* Output Panel */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            {view === 'formatted' ? 'Formatted JSON' : 'Tree View'}
          </h2>
          <div className="w-full h-96 p-4 border border-gray-300 rounded-lg overflow-auto bg-gray-50">
            {view === 'formatted' ? (
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
                {formattedJSON}
              </pre>
            ) : (
              (isValid || partiallyParsed) && parsedData !== null ? (
                <>
                  <TreeNode data={parsedData} />
                  {partiallyParsed && (
                    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      <strong>Note:</strong> Only showing tree view for the valid portion of the JSON
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 italic">
                  Please provide valid JSON to see tree view
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
