import React from 'react';
import { ViewMode } from '../types';

interface FooterProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  wordCount: number;
  currentPage: number;
  totalPages: number;
  hasDocument: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ zoom, setZoom, wordCount, currentPage, totalPages, hasDocument, viewMode, setViewMode }) => {
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  // Format word count with commas
  const formattedWordCount = wordCount.toLocaleString();

  return (
    <footer className="h-8 bg-white dark:bg-[#151b2b] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 text-xs text-slate-500 dark:text-slate-400 select-none z-20 transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4">
        {hasDocument ? (
          <>
            <span>Page {currentPage} of {totalPages}</span>
            <span>{formattedWordCount} words</span>
          </>
        ) : (
          <>
            <span className="text-slate-400 dark:text-slate-500">No document</span>
            <span className="text-slate-400 dark:text-slate-500">0 words</span>
          </>
        )}
        <span>English (US)</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            className="hover:text-primary transition-colors duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <span className="material-icons-outlined text-[14px]">remove</span>
          </button>
          <span className="font-medium min-w-[3ch] text-center transition-all duration-200">{zoom}%</span>
          <button
            className="hover:text-primary transition-colors duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <span className="material-icons-outlined text-[14px]">add</span>
          </button>
        </div>
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
          <button
            className={`p-1 rounded transition-all duration-200 ${viewMode === 'print' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            onClick={() => setViewMode('print')}
            title="Print Layout - Show pages with boundaries"
          >
            <span className="material-icons-outlined text-[14px]">article</span>
          </button>
          <button
            className={`p-1 rounded transition-all duration-200 ${viewMode === 'web' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            onClick={() => setViewMode('web')}
            title="Web Layout - Continuous scroll without page breaks"
          >
            <span className="material-icons-outlined text-[14px]">view_agenda</span>
          </button>
          <button
            className={`p-1 rounded transition-all duration-200 ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            onClick={() => setViewMode('split')}
            title="Split View - Show two pages side by side"
          >
            <span className="material-icons-outlined text-[14px]">view_column</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
