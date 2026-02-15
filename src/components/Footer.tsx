import React from 'react';

interface FooterProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  wordCount: number;
  currentPage: number;
  totalPages: number;
  hasDocument: boolean;
}

export const Footer: React.FC<FooterProps> = ({ zoom, setZoom, wordCount, currentPage, totalPages, hasDocument }) => {
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
        <button className="hover:text-primary transition-colors duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Print Layout">
          <span className="material-icons-outlined text-[16px]">grid_view</span>
        </button>
      </div>
    </footer>
  );
};
