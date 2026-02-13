import React from 'react';

interface FooterProps {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ zoom, setZoom }) => {
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  return (
    <footer className="h-8 bg-white dark:bg-[#151b2b] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 text-xs text-slate-500 dark:text-slate-400 select-none z-20 transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4">
        <span>Page 1 of 12</span>
        <span>4,238 words</span>
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
