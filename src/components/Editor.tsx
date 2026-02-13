import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DocumentState } from '../types';
import { renderAsync } from 'docx-preview';
import JSZip from 'jszip';

interface EditorProps {
  state: DocumentState;
  file?: File | null;
  onCloseFile?: () => void;
  onFileUpload?: (file: File) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const Editor: React.FC<EditorProps> = ({ state, file, onCloseFile, onFileUpload, zoom, setZoom }) => {
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showFootnotePanel, setShowFootnotePanel] = useState(false);
  const [hasFootnotes, setHasFootnotes] = useState(false);

  // Conversion UI State
  const [conversionType, setConversionType] = useState<'legacyToUnicode' | 'unicodeToLegacy'>('legacyToUnicode');
  const [forceConvert, setForceConvert] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Footnote Panel Resize State
  const [footnotePanelWidth, setFootnotePanelWidth] = useState(320);
  const [isResizingFootnote, setIsResizingFootnote] = useState(false);
  const resizeRef = useRef({ startX: 0, startWidth: 0 });


  // Mobile Detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (file) {
      // 1. Render DOCX
      if (docxContainerRef.current) {
        setIsRendering(true);
        setRenderError(null);
        docxContainerRef.current.innerHTML = ''; // Clear previous content

        renderAsync(file, docxContainerRef.current, undefined, {
          className: 'docx_viewer',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: false,
          trimXmlDeclaration: true,
          useBase64URL: false,
          renderChanges: false,
          debug: false,
        })
          .then(() => {
            setIsRendering(false);
          })
          .catch((err: any) => {
            console.error("Error rendering docx:", err);
            setRenderError("Failed to render document. Please ensure it is a valid .docx file.");
            setIsRendering(false);
          });
      }

      // 2. Check for footnotes using JSZip
      const zip = new JSZip();
      zip.loadAsync(file).then((content) => {
        // Check if word/footnotes.xml exists in the zip structure
        if (content.file("word/footnotes.xml")) {
          setHasFootnotes(true);
        } else {
          setHasFootnotes(false);
          setShowFootnotePanel(false);
        }
      }).catch((err) => {
        console.error("Error checking footnotes:", err);
        setHasFootnotes(false);
      });

    } else {
      setHasFootnotes(false);
      setShowFootnotePanel(false);
    }
  }, [file]);

  // Mouse wheel zoom handler with cursor focus
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        const newZoom = Math.min(Math.max(zoom + delta, 50), 200);

        if (newZoom !== zoom && mainContainerRef.current && contentWrapperRef.current) {
          // Calculate cursor position relative to the content
          const rect = contentWrapperRef.current.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;

          // Calculate the percentage position of the cursor
          const percentX = offsetX / rect.width;
          const percentY = offsetY / rect.height;

          setZoom(newZoom);

          // Adjust scroll position after zoom to keep cursor focused
          // We need to wait for the render cycle to update the scale
          requestAnimationFrame(() => {
            if (mainContainerRef.current && contentWrapperRef.current) {
              const newRect = contentWrapperRef.current.getBoundingClientRect();
              const newScrollLeft = mainContainerRef.current.scrollLeft + (newRect.width * percentX) - offsetX;
              const newScrollTop = mainContainerRef.current.scrollTop + (newRect.height * percentY) - offsetY;

              mainContainerRef.current.scrollLeft = newScrollLeft;
              mainContainerRef.current.scrollTop = newScrollTop;
            }
          });
        } else {
          setZoom(newZoom);
        }
      }
    };

    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [zoom, setZoom]);

  // Robust Footnote Resize Logic
  const startResizingFootnote = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Store initial values in ref to avoid closure staleness issues
    resizeRef.current = {
      startX: e.clientX,
      startWidth: footnotePanelWidth
    };

    setIsResizingFootnote(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const { startX, startWidth } = resizeRef.current;
      const deltaX = moveEvent.clientX - startX;

      // Dragging left (negative delta) increases width because panel is on the right
      const newWidth = startWidth - deltaX;

      if (newWidth > 200 && newWidth < 800) {
        setFootnotePanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingFootnote(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [footnotePanelWidth]);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && onFileUpload) {
      const file = droppedFiles[0];
      if (file.name.endsWith('.docx')) {
        onFileUpload(file);
      } else {
        alert('Please drop a valid .docx file.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onFileUpload) {
      const file = e.target.files[0];
      if (file.name.endsWith('.docx')) {
        onFileUpload(file);
      } else {
        alert('Please select a valid .docx file.');
      }
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };




  // If a file is loaded, show the DOCX viewer
  if (file) {
    return (
      <main
        className="flex-1 relative overflow-hidden flex flex-col transition-colors duration-300 ease-in-out"
        style={{ backgroundColor: state.appBackground }}
      >
        {/* Toolbar for Document */}
        <div className="w-full px-4 py-2 flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 transition-colors duration-300">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300 max-w-[200px] sm:max-w-xs">
              <span className="material-icons-outlined text-primary">description</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</span>
            </div>

            {hasFootnotes && (
              <button
                onClick={() => setShowFootnotePanel(!showFootnotePanel)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded shadow-sm border transition-all duration-200 text-sm font-medium ${showFootnotePanel ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                title="Toggle Footnotes Panel"
              >
                <span className="material-icons-outlined text-sm">vertical_split</span>
                <span className="hidden sm:inline">{showFootnotePanel ? 'Hide Footnotes' : 'Show Footnotes'}</span>
              </button>
            )}
          </div>
          <button
            onClick={onCloseFile}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 text-sm font-medium"
          >
            <span className="material-icons-outlined text-sm">close</span>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Document Area */}
          <div
            ref={mainContainerRef as any}
            className={`
              flex-1 overflow-y-auto p-2 md:p-8 custom-scrollbar flex justify-center 
              ${isResizingFootnote ? 'transition-none' : 'transition-all duration-300 ease-in-out'}
            `}
          >
            {isRendering && (
              <div className="flex flex-col items-center justify-center h-64 w-full animate-fadeIn">
                <span className="material-icons-outlined text-4xl text-primary animate-spin mb-2">refresh</span>
                <p className="text-slate-500 dark:text-slate-400">Rendering Document...</p>
              </div>
            )}

            {renderError && (
              <div className="flex flex-col items-center justify-center h-64 w-full text-red-500 animate-fadeIn">
                <span className="material-icons-outlined text-4xl mb-2">error_outline</span>
                <p>{renderError}</p>
              </div>
            )}

            <div
              ref={contentWrapperRef}
              className={`transition-transform duration-200 ease-out origin-top-left ${isRendering ? 'opacity-0' : 'opacity-100'}`}
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center top'
              }}
            >
              <div
                ref={docxContainerRef}
                className="w-full max-w-5xl transition-colors duration-300"
                style={{
                  '--docx-background': state.paper.backgroundColor
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Footnote Panel (Split View) */}
          <div
            className={`
              fixed inset-0 z-50 md:relative md:z-20
              border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2330] flex flex-col shadow-xl 
              ${isResizingFootnote ? 'transition-none' : 'transition-[width] duration-300 ease-in-out'}
              ${showFootnotePanel ? (isMobile ? 'translate-x-0' : '') : (isMobile ? 'translate-x-full' : '')}
            `}
            style={{
              width: isMobile ? '100%' : (showFootnotePanel ? footnotePanelWidth : 0),
              minWidth: showFootnotePanel ? (isMobile ? '100%' : 200) : 0,
              maxWidth: isMobile ? '100%' : 800,
              borderLeftWidth: (showFootnotePanel && !isMobile) ? '1px' : '0px',
              overflow: 'hidden'
            }}
          >
            {/* Inner container to prevent content squishing during transition */}
            <div className="w-full h-full flex flex-col" style={{ minWidth: isMobile ? 'auto' : footnotePanelWidth }}>

              {/* Resize Handle - Increased hit area (Desktop only) */}
              {!isMobile && showFootnotePanel && (
                <div
                  className={`absolute left-0 top-0 bottom-0 w-4 -ml-2 cursor-ew-resize z-30 flex justify-center items-center group ${isResizingFootnote ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
                  onMouseDown={startResizingFootnote}
                >
                  <div className={`w-1 h-8 rounded-full transition-colors ${isResizingFootnote ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-primary'}`} />
                </div>
              )}

              {/* Overlay to catch events during resize */}
              {isResizingFootnote && (
                <div className="fixed inset-0 z-50 cursor-ew-resize" />
              )}

              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300 min-w-[200px]">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                  <span className="material-icons-outlined text-primary">notes</span>
                  Footnotes
                </h3>
                <button
                  onClick={() => setShowFootnotePanel(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  <span className="material-icons-outlined text-sm">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-w-[200px]">
                {/* Placeholder for extracted footnotes - in a real app, we'd parse these from the docx */}
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-primary/30">
                    <div className="flex gap-2 mb-1">
                      <span
                        className="font-bold text-xs transition-colors duration-300"
                        style={{
                          color: state.footnoteNumbers.accentColor,
                          fontFamily: state.footnoteNumbers.fontFamily
                        }}
                      >1.</span>
                      <p
                        className="text-sm text-slate-600 dark:text-slate-300 transition-all duration-300"
                        style={{
                          fontFamily: state.footnotes.fontFamily,
                          fontSize: `${state.footnotes.fontSize}px`,
                          fontWeight: state.footnotes.fontWeight
                        }}
                      >
                        This is a simulated footnote extracted from the document context. Real extraction would require deeper parsing of the DOCX structure.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-primary/30">
                    <div className="flex gap-2 mb-1">
                      <span
                        className="font-bold text-xs transition-colors duration-300"
                        style={{
                          color: state.footnoteNumbers.accentColor,
                          fontFamily: state.footnoteNumbers.fontFamily
                        }}
                      >2.</span>
                      <p
                        className="text-sm text-slate-600 dark:text-slate-300 transition-all duration-300"
                        style={{
                          fontFamily: state.footnotes.fontFamily,
                          fontSize: `${state.footnotes.fontSize}px`,
                          fontWeight: state.footnotes.fontWeight
                        }}
                      >
                        Another footnote example to demonstrate the split view capability.
                      </p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-slate-400 text-xs italic animate-fadeIn">
                    <p>Footnote extraction from DOCX is simulated in this preview.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Default Dummy Editor View (No file loaded) - Now with Batch Conversion UI
  return (
    <main
      ref={mainContainerRef as any}
      className="flex-1 relative overflow-y-auto flex justify-center p-4 md:p-8 custom-scrollbar transition-colors duration-300 ease-in-out"
      style={{ backgroundColor: state.appBackground }}
    >
      <div
        ref={contentWrapperRef}
        className="transition-transform duration-200 ease-out origin-top w-full flex justify-center"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center top'
        }}
      >
        {/* Paper Container */}
        <div
          className="w-full max-w-3xl min-h-[600px] md:min-h-[1000px] shadow-lg dark:shadow-2xl dark:shadow-black/50 p-6 md:p-16 rounded-sm relative selection:bg-primary/30 selection:text-primary-content transition-all duration-300 ease-out"
          style={{
            backgroundColor: state.paper.backgroundColor,
          }}
        >
          {/* Conversion UI Content */}
          <div className="flex flex-col items-center h-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 font-display text-center" style={{ color: state.body.color }}>
              Batch Document Conversion
            </h1>

            {/* Toggles */}
            <div className="flex flex-col sm:flex-row p-1 rounded-xl sm:rounded-full mb-6 w-full sm:w-auto relative">
              {/* Background for toggles to ensure visibility on any paper color */}
              <div className="absolute inset-0 rounded-xl sm:rounded-full opacity-10" style={{ backgroundColor: state.body.color }}></div>

              <button
                onClick={() => setConversionType('legacyToUnicode')}
                className={`px-6 py-2 rounded-lg sm:rounded-full text-sm font-medium transition-all relative z-10 ${conversionType === 'legacyToUnicode'
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:opacity-80'
                  }`}
                style={conversionType !== 'legacyToUnicode' ? { color: state.body.color, opacity: 0.7 } : {}}
              >
                Legacy (Bijoy) → Unicode
              </button>
              <button
                onClick={() => setConversionType('unicodeToLegacy')}
                className={`px-6 py-2 rounded-lg sm:rounded-full text-sm font-medium transition-all relative z-10 ${conversionType === 'unicodeToLegacy'
                  ? 'bg-primary text-white shadow-sm'
                  : 'hover:opacity-80'
                  }`}
                style={conversionType !== 'unicodeToLegacy' ? { color: state.body.color, opacity: 0.7 } : {}}
              >
                Unicode → Legacy (Bijoy)
              </button>
            </div>

            <p className="mb-4 text-sm text-center opacity-70 px-4" style={{ color: state.body.color }}>
              Upload .docx files to convert {conversionType === 'legacyToUnicode' ? 'SuttonyMJ/Bijoy to Unicode' : 'Unicode to SuttonyMJ/Bijoy'}.
            </p>

            {/* Checkbox - Only show for Legacy to Unicode */}
            <div
              className={`
                  overflow-hidden transition-all duration-300 ease-in-out w-full flex justify-center
                  ${conversionType === 'legacyToUnicode' ? 'max-h-20 opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}
                `}
            >
              <div className="flex items-center gap-2 px-4 text-center">
                <input
                  type="checkbox"
                  id="forceConvert"
                  checked={forceConvert}
                  onChange={(e) => setForceConvert(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="forceConvert" className="text-sm font-medium select-none cursor-pointer" style={{ color: state.body.color }}>
                  Force Convert (Use if file font isn't detected)
                </label>
              </div>
            </div>

            {/* Spacer if checkbox is hidden to maintain layout balance */}
            {conversionType !== 'legacyToUnicode' && <div className="mb-12 transition-all duration-300"></div>}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".docx"
              onChange={handleFileInputChange}
            />

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                  w-full max-w-2xl h-56 md:h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                  ${isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'hover:border-primary/50'
                }
                `}
              style={{
                borderColor: isDragging ? undefined : state.body.color,
                opacity: isDragging ? 1 : 0.6
              }}
            >
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-xl opacity-10" style={{ backgroundColor: state.body.color }}></div>
                <span className="material-icons-outlined text-2xl relative" style={{ color: state.body.color }}>cloud_upload</span>
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: state.body.color }}>Drop Word Documents</h3>
              <p className="text-sm mb-4 opacity-60" style={{ color: state.body.color }}>Select multiple files to batch convert</p>
              <span
                className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full uppercase"
                style={{
                  backgroundColor: state.body.color,
                  color: state.paper.backgroundColor,
                  opacity: 0.8
                }}
              >
                {conversionType === 'legacyToUnicode' ? 'SuttonyMJ / Bijoy Only' : 'Unicode Only'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
