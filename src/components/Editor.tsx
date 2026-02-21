import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DocumentState, FootnoteData, FileState, ViewMode } from '../types';
import { renderAsync } from 'docx-preview';
import { extractFootnotesFromDocx } from '../utils/extractFootnotes';

export interface DocumentStats {
  wordCount: number;
  currentPage: number;
  totalPages: number;
}

interface EditorProps {
  state: DocumentState;
  files: FileState[];
  currentIndex: number;
  onSelectFile: (index: number) => void;
  onConvertFile?: (index: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  viewMode: ViewMode;
  onStatsUpdate: (stats: DocumentStats) => void;
}

export const Editor: React.FC<EditorProps> = ({ state, files, currentIndex, onSelectFile, zoom, setZoom, viewMode, onStatsUpdate }) => {
  const currentFileState = currentIndex >= 0 && currentIndex < files.length ? files[currentIndex] : null;
  // Use converted file if available, otherwise use original
  const file = currentFileState?.convertedFile || currentFileState?.file || null;
  const isShowingConverted = currentFileState?.status === 'converted';
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const docxContainerRef2 = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showFootnotePanel, setShowFootnotePanel] = useState(false);
  const [hasFootnotes, setHasFootnotes] = useState(false);
  const [footnotes, setFootnotes] = useState<FootnoteData[]>([]);
  const [splitPageOffset, setSplitPageOffset] = useState(1);

  // Footnote Panel Resize State
  const [footnotePanelWidth, setFootnotePanelWidth] = useState(320);
  const [isResizingFootnote, setIsResizingFootnote] = useState(false);
  const resizeRef = useRef({ startX: 0, startWidth: 0 });

  // Page Navigation State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pagesRef = useRef<NodeListOf<Element> | null>(null);

  // Ref to suppress zoom transition during wheel zoom (avoids shake/jitter)
  const wheelZoomDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


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
          ignoreLastRenderedPageBreak: false,
          experimental: false,
          trimXmlDeclaration: true,
          useBase64URL: false,
          renderChanges: false,
          renderHeaders: true,
          renderFooters: true,
          debug: false,
        })
          .then(() => {
            setIsRendering(false);
            // Calculate document stats after rendering
            calculateAndReportStats();
          })
          .catch((err: any) => {
            console.error("Error rendering docx:", err);
            setRenderError("Failed to render document. Please ensure it is a valid .docx file.");
            setIsRendering(false);
            onStatsUpdate({ wordCount: 0, currentPage: 1, totalPages: 0 });
          });
      }

      // 2. Extract footnotes from the DOCX file
      extractFootnotesFromDocx(file).then((extractedFootnotes) => {
        setFootnotes(extractedFootnotes);
        if (extractedFootnotes.length > 0) {
          setHasFootnotes(true);
        } else {
          setHasFootnotes(false);
          setShowFootnotePanel(false);
        }
      }).catch((err) => {
        console.error("Error extracting footnotes:", err);
        setFootnotes([]);
        setHasFootnotes(false);
      });

    } else {
      setHasFootnotes(false);
      setShowFootnotePanel(false);
      // Reset stats when no file is loaded
      onStatsUpdate({ wordCount: 0, currentPage: 1, totalPages: 0 });
    }
  }, [file]);

  // Calculate word count and page count from rendered document
  const calculateAndReportStats = () => {
    if (!docxContainerRef.current) return;

    // Count words from the document content
    const textContent = docxContainerRef.current.innerText || '';
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Count pages - docx-preview creates sections with class 'docx_page'
    const pages = docxContainerRef.current.querySelectorAll('.docx_page');
    const pageCount = pages.length || 1;

    // Store pages reference and update local state
    pagesRef.current = pages;
    setTotalPages(pageCount);
    setCurrentPage(1);

    // Initial stats with page 1 as current
    onStatsUpdate({ wordCount, currentPage: 1, totalPages: pageCount });
  };

  // Scroll to a specific page
  const scrollToPage = useCallback((pageNumber: number) => {
    if (!docxContainerRef.current || !mainContainerRef.current) return;

    const pages = docxContainerRef.current.querySelectorAll('.docx_page');
    if (pages.length === 0) return;

    const targetPage = Math.min(Math.max(pageNumber, 1), pages.length);
    const pageElement = pages[targetPage - 1];

    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(targetPage);
      onStatsUpdate({
        wordCount: 0, // Keep existing word count
        currentPage: targetPage,
        totalPages: pages.length
      });
    }
  }, [onStatsUpdate]);

  // Navigate to previous page
  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1);
    }
  }, [currentPage, scrollToPage]);

  // Navigate to next page
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      scrollToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, scrollToPage]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if no input/textarea is focused
      if (document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'PageUp' || (e.key === 'ArrowUp' && !e.ctrlKey)) {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'PageDown' || (e.key === 'ArrowDown' && !e.ctrlKey)) {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToPage(totalPages);
      } else if (e.key === '+' || e.key === '=') {
        // Zoom In shortcut (+/=) — smooth transition, document stays centered via justifyContent
        e.preventDefault();
        setZoom(Math.min(zoom + 10, 200));
      } else if (e.key === '-') {
        // Zoom Out shortcut (-) — smooth transition, document stays centered via justifyContent
        e.preventDefault();
        setZoom(Math.max(zoom - 10, 50));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevPage, goToNextPage, scrollToPage, totalPages, setZoom]);

  // Track current visible page on scroll
  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container || !file) return;

    const handleScroll = () => {
      if (!docxContainerRef.current) return;

      const pages = docxContainerRef.current.querySelectorAll('.docx_page');
      if (pages.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let currentPage = 1;
      pages.forEach((page, index) => {
        const pageRect = page.getBoundingClientRect();
        // Check if page is visible in the viewport
        if (pageRect.top <= containerCenter && pageRect.bottom >= containerCenter) {
          currentPage = index + 1;
        }
      });

      // Get current word count
      const textContent = docxContainerRef.current.innerText || '';
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;

      onStatsUpdate({ wordCount, currentPage, totalPages: pages.length });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [file, onStatsUpdate]);

  // Mouse wheel zoom handler — MS Office style (CSS zoom, cursor-anchored, no transition to avoid shake)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        const delta = e.deltaY > 0 ? -10 : 10;
        const newZoom = Math.min(Math.max(zoom + delta, 50), 200);
        if (newZoom === zoom) return;

        const container = mainContainerRef.current;
        const content = contentWrapperRef.current;
        if (!container || !content) {
          setZoom(newZoom);
          return;
        }

        // Disable zoom transition during wheel zoom to prevent shake/jitter
        content.style.transition = 'none';

        // Clear any pending debounce that would restore transition
        if (wheelZoomDebounceRef.current) clearTimeout(wheelZoomDebounceRef.current);

        // Anchor scroll to cursor position so zoom feels like MS Office
        // cursor position relative to the scrollable content (before zoom)
        const cursorX = e.clientX - container.getBoundingClientRect().left + container.scrollLeft;
        const cursorY = e.clientY - container.getBoundingClientRect().top + container.scrollTop;

        const oldZoom = zoom / 100;
        const newZoomFactor = newZoom / 100;

        setZoom(newZoom);

        requestAnimationFrame(() => {
          if (!container) return;
          // Re-anchor: after zoom, scroll so cursor stays over same document point
          container.scrollLeft = (cursorX / oldZoom) * newZoomFactor - (e.clientX - container.getBoundingClientRect().left);
          container.scrollTop = (cursorY / oldZoom) * newZoomFactor - (e.clientY - container.getBoundingClientRect().top);
        });

        // Restore smooth transition after wheel stops (200ms debounce)
        wheelZoomDebounceRef.current = setTimeout(() => {
          if (content) content.style.transition = 'zoom 150ms ease-out';
        }, 200);
      }
    };

    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
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
              {isShowingConverted && (
                <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wide">
                  Converted
                </span>
              )}
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

          {/* File Navigation */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
            <button
              onClick={() => onSelectFile(currentIndex - 1)}
              disabled={currentIndex <= 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-medium rounded shadow-md shadow-blue-500/20 transition-all duration-200"
              title="Previous File"
            >
              <span className="material-icons-outlined text-sm">arrow_back</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[70px] text-center">
              {currentIndex + 1} of {files.length}
            </span>

            <button
              onClick={() => onSelectFile(currentIndex + 1)}
              disabled={currentIndex >= files.length - 1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-medium rounded shadow-md shadow-blue-500/20 transition-all duration-200"
              title="Next File"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Document Area */}
          <div
            ref={mainContainerRef as any}
            className={`
              flex-1 overflow-auto custom-scrollbar
              ${isResizingFootnote ? 'transition-none' : 'transition-all duration-300 ease-in-out'}
            `}
            style={{ position: 'relative' }}
          >
            {/* Fixed-position overlays (loading/error) centered in the viewport */}
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

            {viewMode === 'split' ? (
              // Split View — MS Office style: CSS zoom expands layout naturally in all directions
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '8px 32px',
                  boxSizing: 'border-box',
                  minWidth: 'fit-content',
                  minHeight: '100%',
                }}
              >
                <div
                  ref={contentWrapperRef}
                  className={`transition-opacity duration-200 ease-out ${isRendering ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    // CSS zoom: expands actual DOM layout (unlike transform:scale),
                    // so scroll works correctly in every direction — portrait & landscape
                    zoom: zoom / 100,
                    transition: 'zoom 150ms ease-out',
                    margin: '0 auto',
                  } as React.CSSProperties}
                >
                  <div className="split-view-container flex gap-4">
                    {/* First panel - starts from page 1 */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-center mb-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Page 1</span>
                      </div>
                      <div
                        ref={docxContainerRef}
                        className="split-layout-view w-full transition-colors duration-300"
                        style={{
                          '--docx-background': state.paper.backgroundColor
                        } as React.CSSProperties}
                      />
                    </div>
                    {/* Second panel - starts from page offset */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-center mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSplitPageOffset(Math.max(1, splitPageOffset - 1))}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                            disabled={splitPageOffset <= 1}
                          >
                            <span className="material-icons-outlined text-sm">chevron_left</span>
                          </button>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Page {splitPageOffset}</span>
                          <button
                            onClick={() => setSplitPageOffset(splitPageOffset + 1)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                          >
                            <span className="material-icons-outlined text-sm">chevron_right</span>
                          </button>
                        </div>
                      </div>
                      <div
                        ref={docxContainerRef2}
                        className="split-layout-view w-full transition-colors duration-300"
                        style={{
                          '--docx-background': state.paper.backgroundColor
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Normal View — MS Office style zoom using CSS zoom property
              // Using display:block + margin:0 auto instead of flex+justifyContent:center
              // so that wide landscape documents can be scrolled left (flex center clips left overflow)
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: viewMode === 'print' ? '32px' : '8px 32px',
                  boxSizing: 'border-box',
                  minWidth: 'fit-content',
                  minHeight: '100%',
                }}
              >
                <div
                  ref={contentWrapperRef}
                  className={`transition-opacity duration-200 ease-out ${isRendering ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    // CSS zoom: actual layout expansion — portrait & landscape both scroll correctly
                    zoom: zoom / 100,
                    transition: 'zoom 150ms ease-out',
                    margin: '0 auto',
                  } as React.CSSProperties}
                >
                  <div
                    ref={docxContainerRef}
                    className={`w-full transition-colors duration-300 ${viewMode === 'print' ? 'max-w-5xl print-layout-view' : 'web-layout-view'}`}
                    style={{
                      '--docx-background': state.paper.backgroundColor
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            )}
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
                {footnotes.length > 0 ? (
                  <div className="space-y-4">
                    {footnotes.map((footnote) => (
                      <div key={footnote.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-primary/30">
                        <div className="flex gap-2 mb-1">
                          <span
                            className="font-bold text-xs flex-shrink-0 transition-colors duration-300"
                            style={{
                              color: state.footnoteNumbers.accentColor,
                              fontFamily: state.footnoteNumbers.fontFamily
                            }}
                          >
                            {footnote.id}.
                          </span>
                          <p
                            className="text-sm text-slate-600 dark:text-slate-300 transition-all duration-300 leading-relaxed"
                            style={{
                              fontFamily: state.footnotes.fontFamily,
                              fontSize: `${state.footnotes.fontSize}px`,
                              fontWeight: state.footnotes.fontWeight
                            }}
                          >
                            {footnote.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs italic animate-fadeIn">
                    <p>No footnotes found in this document.</p>
                  </div>
                )}
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
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-2xl opacity-10" style={{ backgroundColor: state.body.color }}></div>
              <span className="material-icons-outlined text-4xl relative" style={{ color: state.body.color }}>folder_open</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 font-display text-center" style={{ color: state.body.color }}>
              No Files Selected
            </h1>
            <p className="text-sm text-center opacity-70 px-4 max-w-md mb-6" style={{ color: state.body.color }}>
              Add DOCX files using the file sidebar on the left. You can convert multiple files at once and navigate between them.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="material-icons-outlined text-sm">info</span>
              <span>Use the left sidebar to manage your files</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
