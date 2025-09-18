import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PDFDocument, PDFPage } from 'pdf-lib';

// Dynamically import react-pdf to avoid SSR issues
let Document: any = null;
let Page: any = null;
let pdfjs: any = null;

interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

interface PDFPageInfo {
  id: string;
  pageNumber: number;
  isSelected?: boolean;
}

type ViewMode = 'compress' | 'edit';

const PDFCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('compress');
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pages, setPages] = useState<PDFPageInfo[]>([]);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPageInputRef = useRef<HTMLInputElement>(null);

  // Load react-pdf dynamically on client side
  useEffect(() => {
    const loadPdfLib = async () => {
      if (typeof window !== 'undefined') {
        setIsClient(true);
        try {
          const reactPdf = await import('react-pdf');
          Document = reactPdf.Document;
          Page = reactPdf.Page;
          pdfjs = reactPdf.pdfjs;
          
          // Multiple approaches to handle PDF.js worker issues
          try {
            // Approach 1: Disable worker entirely (runs in main thread)
            pdfjs.GlobalWorkerOptions.workerSrc = false;
            
            // Also try setting these properties to ensure worker is disabled
            if (pdfjs.GlobalWorkerOptions) {
              pdfjs.GlobalWorkerOptions.workerPort = null;
            }
            
            console.log('PDF.js worker disabled - running in main thread');
          } catch (workerErr) {
            console.warn('Worker setup failed:', workerErr);
            // Continue anyway - PDF.js should fall back automatically
          }
          
          setPdfLibLoaded(true);
        } catch (err) {
          console.error('Error loading react-pdf:', err);
          setError('Error loading PDF viewer library. Please refresh the page and try again.');
        }
      }
    };

    loadPdfLib();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setStats(null);
      setCompressedBlob(null);
      setSelectedPages(new Set());
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);
        
        const pageCount = doc.getPageCount();
        setNumPages(pageCount);
        
        const pagesInfo = Array.from({ length: pageCount }, (_, i) => ({
          id: `page-${i + 1}`,
          pageNumber: i + 1,
        }));
        setPages(pagesInfo);
      } catch (err) {
        setError('Error loading PDF file');
        console.error(err);
      }
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
      setPdfDoc(null);
      setPages([]);
      setNumPages(null);
    }
  };

  const compressPDF = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // More aggressive compression techniques
      const pages = pdfDoc.getPages();
      
      // Remove metadata and unused objects
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
      pdfDoc.setKeywords([]);
      
      // Try to compress images and reduce quality
      // Note: This is limited in pdf-lib, but we can try to optimize the structure
      
      // Use more aggressive compression settings
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true, // Enable object streams for better compression
        addDefaultPage: false,
        objectsPerTick: 200, // Process more objects per tick
        updateFieldAppearances: false, // Skip unnecessary appearance updates
      });

      const originalSize = file.size;
      const compressedSize = pdfBytes.length;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

      // If no compression was achieved, try alternative approach
      if (compressionRatio <= 0) {
        // Try without object streams
        const altPdfBytes = await pdfDoc.save({
          useObjectStreams: false,
          addDefaultPage: false,
          objectsPerTick: 100,
        });
        
        const altCompressedSize = altPdfBytes.length;
        const altCompressionRatio = ((originalSize - altCompressedSize) / originalSize) * 100;
        
        if (altCompressionRatio > compressionRatio) {
          const blob = new Blob([altPdfBytes], { type: 'application/pdf' });
          setStats({
            originalSize,
            compressedSize: altCompressedSize,
            compressionRatio: Math.max(0, altCompressionRatio)
          });
          setCompressedBlob(blob);
          return;
        }
      }

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setStats({
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, compressionRatio)
      });
      
      setCompressedBlob(blob);
    } catch (err) {
      setError(`Error compressing PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedBlob || !file) return;

    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setFile(null);
    setStats(null);
    setCompressedBlob(null);
    setError(null);
    setPdfDoc(null);
    setPages([]);
    setNumPages(null);
    setViewMode('compress');
    setSelectedPages(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (addPageInputRef.current) {
      addPageInputRef.current.value = '';
    }
  };

  // PDF Editing Functions
  const handlePageReorder = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;

    setPages(prevPages => {
      const newPages = [...prevPages];
      const draggedIndex = newPages.findIndex(p => p.id === draggedId);
      const targetIndex = newPages.findIndex(p => p.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prevPages;
      
      const [draggedPage] = newPages.splice(draggedIndex, 1);
      newPages.splice(targetIndex, 0, draggedPage);
      
      return newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
        id: `page-${index + 1}`,
      }));
    });
  }, []);

  const handlePageDelete = useCallback((pageIds: string[]) => {
    if (pageIds.length === 0) return;
    
    setPages(prevPages => {
      const newPages = prevPages.filter(page => !pageIds.includes(page.id));
      return newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
        id: `page-${index + 1}`,
      }));
    });
    
    setSelectedPages(new Set());
  }, []);

  const handleAddPages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !pdfDoc) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      
      const newPdf = await PDFDocument.create();
      
      // Add existing pages in current order
      for (const pageInfo of pages) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageInfo.pageNumber - 1]);
        newPdf.addPage(copiedPage);
      }
      
      // Add all pages from the new PDF
      const sourcePageCount = sourcePdf.getPageCount();
      const sourcePages = await newPdf.copyPages(sourcePdf, Array.from({ length: sourcePageCount }, (_, i) => i));
      sourcePages.forEach(page => newPdf.addPage(page));
      
      // Update state
      setPdfDoc(newPdf);
      const totalPages = pages.length + sourcePageCount;
      setNumPages(totalPages);
      
      const newPagesInfo = Array.from({ length: totalPages }, (_, i) => ({
        id: `page-${i + 1}`,
        pageNumber: i + 1,
      }));
      setPages(newPagesInfo);
      
      // Update file for compression
      const newPdfBytes = await newPdf.save();
      const newBlob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const newFile = new File([newBlob], `merged_${file?.name || 'document.pdf'}`, { type: 'application/pdf' });
      setFile(newFile);
      
    } catch (err) {
      setError('Error adding pages from PDF');
      console.error(err);
    } finally {
      setIsProcessing(false);
      if (addPageInputRef.current) {
        addPageInputRef.current.value = '';
      }
    }
  };

  const applyPageChanges = async () => {
    if (!pdfDoc || pages.length === 0) return;

    setIsProcessing(true);
    try {
      const newPdf = await PDFDocument.create();
      
      // Add pages in the current order
      for (const pageInfo of pages) {
        const originalPageIndex = parseInt(pageInfo.id.split('-')[1]) - 1;
        if (originalPageIndex >= 0 && originalPageIndex < pdfDoc.getPageCount()) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [originalPageIndex]);
          newPdf.addPage(copiedPage);
        }
      }
      
      // Update the main PDF document
      setPdfDoc(newPdf);
      setNumPages(pages.length);
      
      // Update file for compression
      const newPdfBytes = await newPdf.save();
      const newBlob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const newFile = new File([newBlob], `edited_${file?.name || 'document.pdf'}`, { type: 'application/pdf' });
      setFile(newFile);
      
    } catch (err) {
      setError('Error applying page changes');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePageSelection = (pageId: string) => {
    setSelectedPages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(pageId)) {
        newSelection.delete(pageId);
      } else {
        newSelection.add(pageId);
      }
      return newSelection;
    });
  };

  const selectAllPages = () => {
    setSelectedPages(new Set(pages.map(p => p.id)));
  };

  const clearPageSelection = () => {
    setSelectedPages(new Set());
  };

  // PDF Document component for react-pdf
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Component for individual PDF page thumbnail
  const PageThumbnail: React.FC<{
    pageInfo: PDFPageInfo;
    fileUrl: string;
    isSelected: boolean;
    onSelect: (pageId: string) => void;
    onDragStart: (pageId: string) => void;
    onDrop: (targetPageId: string) => void;
  }> = ({ pageInfo, fileUrl, isSelected, onSelect, onDragStart, onDrop }) => {
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (draggedPageId && draggedPageId !== pageInfo.id) {
        onDrop(pageInfo.id);
      }
    };

    return (
      <div
        className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        draggable
        onDragStart={() => {
          onDragStart(pageInfo.id);
          setDraggedPageId(pageInfo.id);
        }}
        onDragEnd={() => setDraggedPageId(null)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => onSelect(pageInfo.id)}
      >
        <div className="text-center">
          <div className="border border-gray-300 rounded mb-2 overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: '120px', width: '85px' }}>
            {pdfLibLoaded && Page ? (
              <Page
                pageNumber={pageInfo.pageNumber}
                width={85}
                height={120}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            ) : (
              <div className="text-gray-400 text-xs">📄</div>
            )}
          </div>
          <div className="text-xs text-gray-600">Page {pageInfo.pageNumber}</div>
        </div>
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Editor & Compressor</h1>
          <p className="text-gray-600 text-lg">
            View, edit, reorder, and compress your PDF files. All processing happens in your browser.
          </p>
        </div>

        {/* Mode Selector */}
        {file && (
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setViewMode('compress')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'compress'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Compress Mode
              </button>
              <button
                onClick={() => pdfLibLoaded && setViewMode('edit')}
                disabled={!pdfLibLoaded}
                className={`px-4 py-2 rounded-md transition-colors relative ${
                  viewMode === 'edit' && pdfLibLoaded
                    ? 'bg-blue-500 text-white'
                    : pdfLibLoaded
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title={!pdfLibLoaded ? 'Loading PDF viewer...' : ''}
              >
                Edit Mode
                {!pdfLibLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-b-2 border-gray-400 rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!file ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-400 transition-colors">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Choose a PDF file</h3>
                <p className="text-gray-500 mb-6">Select a PDF file to compress or edit</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors font-medium"
                >
                  Select PDF File
                </label>
              </div>
            </div>
          ) : (
            <div>
              {/* File Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{file.name}</h3>
                    <p className="text-gray-500">
                      Size: {formatFileSize(file.size)} • {numPages} pages
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetAll}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Select different file"
                >
                  ✕
                </button>
              </div>

              {/* Edit Mode */}
              {viewMode === 'edit' && file && (
                <div className="space-y-6">
                  {!pdfLibLoaded ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600">Loading PDF viewer...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Page Management Controls */}
                      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={selectAllPages}
                            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            onClick={clearPageSelection}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Clear Selection
                          </button>
                          {selectedPages.size > 0 && (
                            <button
                              onClick={() => handlePageDelete(Array.from(selectedPages))}
                              className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              Delete Selected ({selectedPages.size})
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <input
                            ref={addPageInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleAddPages}
                            className="hidden"
                            id="add-pages"
                          />
                          <label
                            htmlFor="add-pages"
                            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors cursor-pointer"
                          >
                            Add Pages from PDF
                          </label>
                          
                          <button
                            onClick={applyPageChanges}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {isProcessing ? 'Processing...' : 'Apply Changes'}
                          </button>
                        </div>
                      </div>

                      {/* PDF Document for react-pdf */}
                      {Document && (
                        <Document
                          file={file}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={(error) => {
                            console.error('PDF load error:', error);
                            setError('Error loading PDF for preview. The file might be corrupted or unsupported.');
                          }}
                          loading={<div className="text-center py-8">Loading PDF...</div>}
                          error={
                            <div className="text-center py-8">
                              <div className="text-red-600 mb-2">⚠️ PDF Preview Not Available</div>
                              <div className="text-sm text-gray-600">
                                PDF compression will still work, but preview is unavailable.
                                <br />Try switching to Compress Mode to process your file.
                              </div>
                            </div>
                          }
                          options={{
                            cMapUrl: 'https://unpkg.com/pdfjs-dist@5.3.93/cmaps/',
                            cMapPacked: true,
                            workerSrc: false,
                            disableWorker: true,
                            isEvalSupported: false,
                            disableRange: false,
                            disableStream: false
                          }}
                        >
                          {/* Pages Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {pages.map((pageInfo) => (
                              <PageThumbnail
                                key={pageInfo.id}
                                pageInfo={pageInfo}
                                fileUrl={URL.createObjectURL(file)}
                                isSelected={selectedPages.has(pageInfo.id)}
                                onSelect={togglePageSelection}
                                onDragStart={setDraggedPageId}
                                onDrop={(targetId) => handlePageReorder(draggedPageId || '', targetId)}
                              />
                            ))}
                          </div>
                        </Document>
                      )}
                      
                      <div className="text-center text-sm text-gray-500 mt-4">
                        <p>💡 Drag pages to reorder • Click to select • Use controls above to manage pages</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Compress Mode */}
              {viewMode === 'compress' && (
                <div>
                  {!stats && !isCompressing && (
                    <div className="text-center">
                      <button
                        onClick={compressPDF}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                      >
                        Compress PDF
                      </button>
                    </div>
                  )}

                  {isCompressing && (
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600">Compressing PDF...</span>
                      </div>
                    </div>
                  )}

                  {stats && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Compression Results</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatFileSize(stats.originalSize)}
                            </div>
                            <div className="text-sm text-gray-500">Original Size</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {formatFileSize(stats.compressedSize)}
                            </div>
                            <div className="text-sm text-gray-500">Compressed Size</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {stats.compressionRatio.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">Size Reduction</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={downloadCompressed}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>📥</span>
                          <span>Download Compressed PDF</span>
                        </button>
                        <button
                          onClick={resetAll}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Process Another File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Your files are processed entirely in your browser. No data is sent to any server.</p>
        </div>
      </div>
    </div>
  );
};

export default PDFCompressor;
