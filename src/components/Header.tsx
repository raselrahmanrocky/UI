import React, { useState, useRef, useEffect } from 'react';
import { UITheme, DocumentState } from '../types';
import { THEME_PRESETS } from '../constants';

interface HeaderProps {
  uiTheme: UITheme;
  setUiTheme: (theme: UITheme) => void;
  documentState: DocumentState;
  setDocumentState: (state: DocumentState) => void;
  onFilesUpload: (files: File[]) => void;
  onToggleSidebar?: () => void;
  onToggleFileSidebar?: () => void;
  convertedFile?: File | null;
  totalFiles: number;
}

export const Header: React.FC<HeaderProps> = ({
  uiTheme,
  setUiTheme,
  documentState,
  setDocumentState,
  onFilesUpload,
  onToggleSidebar,
  onToggleFileSidebar,
  convertedFile,
  totalFiles
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
        setShowThemeSubmenu(false); // Reset submenu when closing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (theme: UITheme) => {
    switch (theme) {
      case 'light': return 'light_mode';
      case 'dark': return 'dark_mode';
      case 'system': return 'settings_brightness';
    }
  };

  const applyThemePreset = (preset: typeof THEME_PRESETS['Standard']) => {
    setDocumentState({
      ...documentState,
      body: {
        ...documentState.body,
        color: preset.bodyColor
      },
      footnoteNumbers: {
        ...documentState.footnoteNumbers,
        accentColor: preset.accentColor
      },
      paper: {
        ...documentState.paper,
        backgroundColor: preset.paperColor
      },
      appBackground: preset.appBackground
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onFilesUpload(fileArray);
    }
    // Reset input so same file can be selected again if needed
    if (event.target) {
      event.target.value = '';
    }
  };
  const handleDownload = () => {
    if (convertedFile) {
      const url = URL.createObjectURL(convertedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = convertedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("Please convert the file first before downloading.");
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151b2b] flex items-center justify-between px-4 shrink-0 z-20 transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4 md:gap-6">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          onClick={onToggleSidebar}
        >
          <span className="material-icons-outlined">menu</span>
        </button>

        {/* Logo/Home */}
        <div className="flex items-center gap-2 text-primary font-bold text-xl cursor-pointer transition-transform hover:scale-105 duration-200">
          <span className="material-icons-outlined">description</span>
          <span className="hidden sm:inline">TypeMaster</span>
        </div>
        {/* Menus */}
        <nav className="hidden md:flex items-center gap-1">
          {['File', 'Edit', 'View', 'Insert'].map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200"
            >
              {item}
            </button>
          ))}
          <button className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-sm font-medium text-primary transition-colors duration-200">
            Format
          </button>
        </nav>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* File Upload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".docx"
          multiple
          onChange={handleFileChange}
        />
        <button
          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all duration-200 flex items-center hover:scale-110"
          onClick={() => fileInputRef.current?.click()}
          title="Open DOCX File"
        >
          <span className="material-icons-outlined text-xl">folder_open</span>
        </button>

        {/* Mobile File Sidebar Toggle */}
        <button
          className="md:hidden p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors relative"
          onClick={onToggleFileSidebar}
        >
          <span className="material-icons-outlined">folder_copy</span>
          {totalFiles > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {totalFiles}
            </span>
          )}
        </button>

        {/* UI Theme Switcher (Light/Dark Mode) */}
        <div className="relative" ref={themeMenuRef}>
          <button
            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all duration-200 flex items-center hover:scale-110"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            title="Interface Theme"
          >
            <span className="material-icons-outlined text-xl">{getThemeIcon(uiTheme)}</span>
          </button>

          {isThemeMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg py-1 z-50 animate-fadeIn transition-all duration-200 origin-top-right">
              <button
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ${uiTheme === 'light' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                onClick={() => { setUiTheme('light'); setIsThemeMenuOpen(false); }}
              >
                <span className="material-icons-outlined text-sm">light_mode</span>
                Light
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ${uiTheme === 'dark' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                onClick={() => { setUiTheme('dark'); setIsThemeMenuOpen(false); }}
              >
                <span className="material-icons-outlined text-sm">dark_mode</span>
                Dark
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ${uiTheme === 'system' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                onClick={() => { setUiTheme('system'); setIsThemeMenuOpen(false); }}
              >
                <span className="material-icons-outlined text-sm">settings_brightness</span>
                System
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1 transition-colors duration-300 hidden sm:block"></div>

        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded p-1 transition-colors duration-300">
          <button
            className="p-1.5 text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded transition-all duration-200 hover:scale-110"
            title="Undo"
          >
            <span className="material-icons-outlined text-sm">undo</span>
          </button>
          <button
            className="p-1.5 text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded transition-all duration-200 hover:scale-110"
            title="Redo"
          >
            <span className="material-icons-outlined text-sm">redo</span>
          </button>
        </div>

        <button
          onClick={handleDownload}
          disabled={!convertedFile}
          className="bg-primary hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-3 py-1.5 md:px-4 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 disabled:shadow-none"
          title={convertedFile ? "Download converted file" : "Convert file first"}
        >
          <span className="material-icons-outlined text-sm">download</span>
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden ml-2 border border-slate-700 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200 hover:scale-105"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://picsum.photos/100/100"
            />
          </div>

          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-fadeIn transition-all duration-200 origin-top-right">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-1 transition-colors duration-300">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Alex Designer</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">alex@typemaster.app</p>
              </div>

              {/* Menu Items */}
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors duration-150">
                <span className="material-icons-outlined text-lg text-slate-400">person</span>
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors duration-150">
                <span className="material-icons-outlined text-lg text-slate-400">monetization_on</span>
                Pricing
              </button>

              {/* Theme Submenu Trigger */}
              <div className="relative">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between group transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowThemeSubmenu(!showThemeSubmenu);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-lg text-slate-400">palette</span>
                    Theme
                  </div>
                  <span className={`material-icons-outlined text-slate-400 text-sm transition-transform duration-200 ${showThemeSubmenu ? 'rotate-90' : ''}`}>chevron_right</span>
                </button>

                {/* Theme Submenu */}
                {showThemeSubmenu && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-700/50 py-1 max-h-64 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out">
                    {Object.entries(THEME_PRESETS).map(([name, preset]) => (
                      <button
                        key={name}
                        onClick={() => {
                          applyThemePreset(preset);
                        }}
                        className="w-full text-left px-4 py-2 pl-11 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between group transition-colors duration-150"
                      >
                        <span>{name}</span>
                        <div className="flex gap-1">
                          <div
                            className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 transition-colors duration-300"
                            style={{ backgroundColor: preset.appBackground }}
                            title="Background"
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 transition-colors duration-300"
                            style={{ backgroundColor: preset.paperColor }}
                            title="Paper"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors duration-150">
                <span className="material-icons-outlined text-lg text-slate-400">help_outline</span>
                Support
              </button>

              <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1 transition-colors duration-300">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors duration-150">
                  <span className="material-icons-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
