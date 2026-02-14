import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentState } from '../types';

interface SidebarProps {
  state: DocumentState;
  onChange: (newState: DocumentState) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onChange, onReset, isMobileOpen, onMobileClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    body: true,
    footnotes: false,
    footnoteNumbers: false,
    paper: false,
  });

  const [availableFonts, setAvailableFonts] = useState<string[]>([
    'Merriweather',
    'Inter',
    'Roboto',
    'Georgia',
    'Arial',
    'Times New Roman',
    'Verdana',
    'Courier New',
    'Courier Prime',
    'Fira Code',
    'Segoe UI',
    'Helvetica'
  ]);

  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [localFontsLoaded, setLocalFontsLoaded] = useState(false);

  // Sidebar Layout State

  // Auto-load cached local fonts on mount
  useEffect(() => {
    const cachedFonts = localStorage.getItem('local-fonts');
    if (cachedFonts) {
      try {
        const fonts = JSON.parse(cachedFonts);
        if (Array.isArray(fonts) && fonts.length > 0) {
          setAvailableFonts(prev => {
            const fontSet = new Set([...prev, ...fonts]);
            return Array.from(fontSet).sort();
          });
          setLocalFontsLoaded(true);
        }
      } catch (e) {
        console.error('Error parsing cached fonts:', e);
        localStorage.removeItem('local-fonts');
      }
    }
  }, []);
  const [width, setWidth] = useState(320);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateBody = (key: keyof DocumentState['body'], value: any) => {
    onChange({ ...state, body: { ...state.body, [key]: value } });
  };

  const updateFootnotes = (key: keyof DocumentState['footnotes'], value: any) => {
    onChange({ ...state, footnotes: { ...state.footnotes, [key]: value } });
  };

  const updateFootnoteNumbers = (key: keyof DocumentState['footnoteNumbers'], value: any) => {
    onChange({ ...state, footnoteNumbers: { ...state.footnoteNumbers, [key]: value } });
  };

  const updatePaper = (key: keyof DocumentState['paper'], value: any) => {
    onChange({ ...state, paper: { ...state.paper, [key]: value } });
  };

  const handleLoadLocalFonts = async () => {
    if ('queryLocalFonts' in window) {
      setIsLoadingFonts(true);
      try {
        // @ts-ignore - Experimental API
        const localFonts = await window.queryLocalFonts();
        const newFontNames = localFonts.map((font: { family: string }) => font.family);
        
        // Merge with existing fonts
        const fontSet = new Set([...availableFonts, ...newFontNames]);
        const mergedFonts = Array.from(fontSet).sort();
        
        setAvailableFonts(mergedFonts);
        setLocalFontsLoaded(true);
        
        // Save to localStorage for next visit
        localStorage.setItem('local-fonts', JSON.stringify(newFontNames));
      } catch (err) {
        console.error('Error loading fonts:', err);
        alert('Unable to access local fonts. Please ensure you have granted permission.');
      } finally {
        setIsLoadingFonts(false);
      }
    } else {
      alert('Your browser does not support the Local Font Access API. Please use a Chromium-based browser like Chrome or Edge.');
    }
  };

  // Resize Logic
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = document.body.clientWidth - mouseMoveEvent.clientX;
      if (newWidth > 240 && newWidth < 600) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);



  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          bg-white dark:bg-[#151b2b] border-l border-slate-200 dark:border-slate-800 flex flex-col 
          fixed inset-y-0 right-0 z-50 h-full shadow-2xl md:shadow-none
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:translate-x-0 md:z-10
        `}
        style={{
          width: window.innerWidth < 768 ? '85%' : (isCollapsed ? '3rem' : width)
        }}
      >
        {isCollapsed ? (
          <div className="hidden md:flex flex-col items-center py-4 w-full h-full animate-fadeIn">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200 mb-4 hover:scale-110"
              title="Expand Sidebar"
            >
              <span className="material-icons-outlined text-lg">tune</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full overflow-hidden animate-fadeIn">
            {/* Resize Handle (Desktop Only) */}
            <div
              className={`hidden md:block absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 z-20 transition-colors duration-200 ${isResizing ? 'bg-primary' : 'bg-transparent'}`}
              onMouseDown={startResizing}
            />

            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0 transition-colors duration-300">
              <h2 className="font-semibold text-slate-800 dark:text-white text-sm truncate animate-fadeIn">Typography & Styles</h2>
              <div className="flex items-center gap-1">
                {/* Mobile Close Button */}
                <button
                  onClick={onMobileClose}
                  className="md:hidden text-slate-400 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Close Sidebar"
                >
                  <span className="material-icons-outlined text-lg">close</span>
                </button>

                {/* Desktop Collapse Button */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="hidden md:block text-slate-400 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110"
                  title="Collapse Sidebar"
                >
                  <span className="material-icons-outlined text-lg">tune</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar animate-fadeIn">

              {/* Global Font Replacement Tool */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-primary/40">
                <div className="flex items-center justify-between mb-3 text-primary">
                  <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-lg">find_replace</span>
                    <h3 className="text-xs font-bold uppercase tracking-wide">Global Replacement</h3>
                  </div>
                  <button
                    onClick={handleLoadLocalFonts}
                    disabled={isLoadingFonts}
                    className="text-primary hover:text-blue-600 disabled:text-slate-400 transition-all duration-200 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center hover:scale-110 relative"
                    title={isLoadingFonts ? "Loading fonts..." : localFontsLoaded ? "Refresh local fonts" : "Load local fonts from computer"}
                  >
                    {isLoadingFonts ? (
                      <span className="material-icons-outlined text-lg animate-spin">refresh</span>
                    ) : (
                      <>
                        <span className="material-icons-outlined text-lg">{localFontsLoaded ? 'refresh' : 'download'}</span>
                        {localFontsLoaded && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" title="Local fonts loaded"></span>
                        )}
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors duration-300">Search for</label>
                    <div className="relative">
                      <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-3 py-2 appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
                        {availableFonts.map(font => (
                          <option key={`search-${font}`} value={font}>{font}</option>
                        ))}
                      </select>
                      <span className="material-icons-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors duration-300">Replace with</label>
                    <div className="relative">
                      <select
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-3 py-2 appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                        onChange={(e) => updateBody('fontFamily', e.target.value)}
                        value={state.body.fontFamily}
                      >
                        {availableFonts.map(font => (
                          <option key={`replace-${font}`} value={font}>{font}</option>
                        ))}
                      </select>
                      <span className="material-icons-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                    </div>
                  </div>
                  <button
                    className="w-full bg-primary hover:bg-blue-600 text-white text-sm font-medium py-2 rounded mt-2 shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] hover:shadow-primary/40"
                    onClick={() => alert("Global replacement simulated! Styles updated.")}
                  >
                    Replace All (14 matches)
                  </button>
                </div>
              </div>

              {/* Section: Body Text */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors duration-300">
                <button
                  className="w-full flex justify-between items-center mb-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded transition-all duration-200"
                  onClick={() => toggleSection('body')}
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">Body Text</span>
                  <span className={`material-icons-outlined text-slate-400 group-hover:text-primary transition-transform duration-300 text-lg ${expandedSections.body ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.body ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-1 pb-2 transition-colors duration-300">
                    {/* Font Family */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Font Family</label>
                      <div className="relative">
                        <select
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 appearance-none focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          value={state.body.fontFamily}
                          onChange={(e) => updateBody('fontFamily', e.target.value)}
                        >
                          {availableFonts.map(font => (
                            <option key={`body-${font}`} value={font}>{font}</option>
                          ))}
                        </select>
                        <span className="material-icons-outlined absolute right-2 top-1.5 text-slate-400 pointer-events-none text-base">expand_more</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Size */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Size (px)</label>
                        <input
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          type="number"
                          value={state.body.fontSize}
                          onChange={(e) => updateBody('fontSize', Number(e.target.value))}
                        />
                      </div>
                      {/* Line Height */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Line Height</label>
                        <input
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          step="0.1"
                          type="number"
                          value={state.body.lineHeight}
                          onChange={(e) => updateBody('lineHeight', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    {/* Color */}
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 transition-colors duration-300">Color</label>
                      <div className="flex items-center gap-2 cursor-pointer group relative">
                        <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-200">{state.body.color}</span>
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          value={state.body.color}
                          onChange={(e) => updateBody('color', e.target.value)}
                        />
                        <div
                          className="w-6 h-6 rounded border border-slate-600 transition-all duration-200 group-hover:scale-110 group-hover:border-primary"
                          style={{ backgroundColor: state.body.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Footnote Text */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors duration-300">
                <button
                  className="w-full flex justify-between items-center mb-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded transition-all duration-200"
                  onClick={() => toggleSection('footnotes')}
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">Footnotes</span>
                  <span className={`material-icons-outlined text-slate-400 group-hover:text-primary transition-transform duration-300 text-lg ${expandedSections.footnotes ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.footnotes ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-1 pb-2 transition-colors duration-300">
                    {/* Font Family */}
                    <div>
                      <div className="relative">
                        <select
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 appearance-none focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          value={state.footnotes.fontFamily}
                          onChange={(e) => updateFootnotes('fontFamily', e.target.value)}
                        >
                          {availableFonts.map(font => (
                            <option key={`footnote-${font}`} value={font}>{font}</option>
                          ))}
                        </select>
                        <span className="material-icons-outlined absolute right-2 top-1.5 text-slate-400 pointer-events-none text-base">expand_more</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Size */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Size (px)</label>
                        <input
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          type="number"
                          value={state.footnotes.fontSize}
                          onChange={(e) => updateFootnotes('fontSize', Number(e.target.value))}
                        />
                      </div>
                      {/* Weight */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Weight</label>
                        <div className="relative">
                          <select
                            className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 appearance-none focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                            value={state.footnotes.fontWeight}
                            onChange={(e) => updateFootnotes('fontWeight', e.target.value)}
                          >
                            <option value="300">Light</option>
                            <option value="400">Regular</option>
                            <option value="500">Medium</option>
                            <option value="700">Bold</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Footnote Numbers */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors duration-300">
                <button
                  className="w-full flex justify-between items-center mb-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded transition-all duration-200"
                  onClick={() => toggleSection('footnoteNumbers')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">Footnote Numbers</span>
                    <span className="w-2 h-2 rounded-full transition-colors duration-300" style={{ backgroundColor: state.footnoteNumbers.accentColor }}></span>
                  </div>
                  <span className={`material-icons-outlined text-slate-400 group-hover:text-primary transition-transform duration-300 text-lg ${expandedSections.footnoteNumbers ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.footnoteNumbers ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3 pl-2 border-l-2 border-primary ml-1 pb-2 transition-colors duration-300">
                    {/* Font Family - NEW */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Font Family</label>
                      <div className="relative">
                        <select
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 appearance-none focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          value={state.footnoteNumbers.fontFamily}
                          onChange={(e) => updateFootnoteNumbers('fontFamily', e.target.value)}
                        >
                          {availableFonts.map(font => (
                            <option key={`fn-num-${font}`} value={font}>{font}</option>
                          ))}
                        </select>
                        <span className="material-icons-outlined absolute right-2 top-1.5 text-slate-400 pointer-events-none text-base">expand_more</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Size */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Size (px)</label>
                        <input
                          className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                          type="number"
                          value={state.footnoteNumbers.fontSize}
                          onChange={(e) => updateFootnoteNumbers('fontSize', Number(e.target.value))}
                        />
                      </div>
                      {/* Weight */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Weight</label>
                        <div className="relative">
                          <select
                            className="w-full bg-transparent dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded px-2 py-1.5 appearance-none focus:border-primary outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                            value={state.footnoteNumbers.fontWeight}
                            onChange={(e) => updateFootnoteNumbers('fontWeight', e.target.value)}
                          >
                            <option value="400">Regular</option>
                            <option value="700">Bold</option>
                            <option value="900">Extra Bold</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {/* Position */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 transition-colors duration-300">Position</label>
                      <div className="flex bg-slate-100 dark:bg-slate-900 rounded p-1 transition-colors duration-300">
                        {['normal', 'superscript', 'subscript'].map((pos) => (
                          <button
                            key={pos}
                            className={`flex-1 py-1 text-xs capitalize rounded transition-all duration-200 ${state.footnoteNumbers.position === pos
                                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary font-medium'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            onClick={() => updateFootnoteNumbers('position', pos)}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Color Accent */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 transition-colors duration-300">Accent Color</label>
                      <div className="flex items-center gap-2 cursor-pointer group relative">
                        <span className="text-xs text-primary font-mono group-hover:text-white transition-colors duration-200">{state.footnoteNumbers.accentColor}</span>
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          value={state.footnoteNumbers.accentColor}
                          onChange={(e) => updateFootnoteNumbers('accentColor', e.target.value)}
                        />
                        <div
                          className="w-6 h-6 rounded border border-slate-600 shadow-sm shadow-primary/50 transition-all duration-200 group-hover:scale-110 group-hover:border-primary"
                          style={{ backgroundColor: state.footnoteNumbers.accentColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Paper Settings */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 transition-colors duration-300">
                <button
                  className="w-full flex justify-between items-center mb-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded transition-all duration-200"
                  onClick={() => toggleSection('paper')}
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">Paper Settings</span>
                  <span className={`material-icons-outlined text-slate-400 group-hover:text-primary transition-transform duration-300 text-lg ${expandedSections.paper ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.paper ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-1 pb-2 transition-colors duration-300">
                    {/* Paper Color */}
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 transition-colors duration-300">Background Color</label>
                      <div className="flex items-center gap-2 cursor-pointer group relative">
                        <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-200">{state.paper.backgroundColor}</span>
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          value={state.paper.backgroundColor}
                          onChange={(e) => updatePaper('backgroundColor', e.target.value)}
                        />
                        <div
                          className="w-6 h-6 rounded border border-slate-600 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:border-primary"
                          style={{ backgroundColor: state.paper.backgroundColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar Footer / Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121620] shrink-0 transition-colors duration-300">
              <button
                className="w-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 py-2 rounded text-sm font-medium transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
                onClick={onReset}
              >
                Reset to Default
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
