#!/bin/bash

echo "Setting up TypeMaster project..."

# Create directories
mkdir -p src/components

# 1. Create package.json
cat << 'EOF' > package.json
{
  "name": "typemaster",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "docx-preview": "^0.3.2",
    "jszip": "^3.10.1",
    "lucide-react": "^0.303.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF

# 2. Create vite.config.ts
cat << 'EOF' > vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
EOF

# 3. Create tsconfig.json
cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# 4. Create tsconfig.node.json
cat << 'EOF' > tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# 5. Create index.html (Modified for Vite)
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeMaster - Advanced Font Editor</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Roboto:wght@300;400;500;700&family=Georgia&family=Courier+Prime&family=Fira+Code&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
      rel="stylesheet"
    />
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#135bec",
              "background-light": "#f6f6f8",
              "background-dark": "#101622",
              "paper-dark": "#1e293b",
            },
            fontFamily: {
              display: ["Inter", "sans-serif"],
              serif: ["Merriweather", "serif"],
              sans: ["Inter", "sans-serif"],
              mono: ["Fira Code", "monospace"],
            },
          },
        },
      };
    </script>
    <script>
      // Initialize theme to avoid FOUC
      try {
        const localTheme = localStorage.getItem('ui-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (localTheme === 'dark' || (!localTheme && systemDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error(e);
      }
    </script>
    <style>
      /* Custom scrollbar for webkit */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #374151;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #4b5563;
      }
      body {
        margin: 0;
        overflow: hidden; /* Prevent body scroll, handle in main */
      }
      /* docx-preview overrides */
      .docx-wrapper {
        background: transparent !important;
        padding: 0 !important;
      }
      .docx-wrapper > section.docx {
        box-shadow: none !important;
        margin-bottom: 0 !important;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
EOF

# 6. Create src/types.ts
cat << 'EOF' > src/types.ts
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  color: string;
  fontWeight: string;
}

export interface FootnoteStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
}

export interface FootnoteNumberStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  position: 'normal' | 'superscript' | 'subscript';
  accentColor: string;
}

export interface PaperStyle {
  backgroundColor: string;
}

export interface DocumentState {
  body: TextStyle;
  footnotes: FootnoteStyle;
  footnoteNumbers: FootnoteNumberStyle;
  paper: PaperStyle;
  appBackground: string; // New property for full page background
}

export const DEFAULT_STATE: DocumentState = {
  body: {
    fontFamily: 'Merriweather',
    fontSize: 17,
    lineHeight: 1.6,
    color: '#334155',
    fontWeight: '400'
  },
  footnotes: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '300'
  },
  footnoteNumbers: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    position: 'superscript',
    accentColor: '#135bec'
  },
  paper: {
    backgroundColor: '#ffffff'
  },
  appBackground: '#f6f6f8' // Default light background
};

export type UITheme = 'light' | 'dark' | 'system';
EOF

# 7. Create src/constants.ts
cat << 'EOF' > src/constants.ts
export const THEME_PRESETS = {
  Standard: {
    bodyColor: '#334155',
    accentColor: '#135bec',
    paperColor: '#ffffff',
    appBackground: '#f6f6f8'
  },
  ModernDark: {
    bodyColor: '#e2e8f0',
    accentColor: '#60a5fa',
    paperColor: '#1e293b',
    appBackground: '#0f172a'
  },
  MidnightBlue: {
    bodyColor: '#cbd5e1',
    accentColor: '#38bdf8',
    paperColor: '#172554',
    appBackground: '#020617'
  },
  SepiaWarm: {
    bodyColor: '#433422',
    accentColor: '#d97706',
    paperColor: '#fef3c7',
    appBackground: '#fffbeb'
  },
  ForestGreen: {
    bodyColor: '#f0fdf4',
    accentColor: '#4ade80',
    paperColor: '#14532d',
    appBackground: '#052e16'
  },
  Terminal: {
    bodyColor: '#4ade80',
    accentColor: '#22c55e',
    paperColor: '#0f172a',
    appBackground: '#020617'
  },
  Blueprint: {
    bodyColor: '#ffffff',
    accentColor: '#fbbf24',
    paperColor: '#1e3a8a',
    appBackground: '#172554'
  },
  Classic: {
    bodyColor: '#1f2937',
    accentColor: '#b91c1c',
    paperColor: '#fff1f2',
    appBackground: '#fff0f5'
  },
  LavenderMist: {
    bodyColor: '#4c1d95',
    accentColor: '#8b5cf6',
    paperColor: '#f3e8ff',
    appBackground: '#faf5ff'
  },
  Cyberpunk: {
    bodyColor: '#2dd4bf',
    accentColor: '#f472b6',
    paperColor: '#27272a',
    appBackground: '#18181b'
  }
};
EOF

# 8. Create src/index.tsx
cat << 'EOF' > src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# 9. Create src/App.tsx
cat << 'EOF' > src/App.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { DocumentState, DEFAULT_STATE, UITheme } from './types';

const App: React.FC = () => {
  const [documentState, setDocumentState] = useState<DocumentState>(DEFAULT_STATE);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [uiTheme, setUiTheme] = useState<UITheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ui-theme') as UITheme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (theme: UITheme) => {
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
      localStorage.setItem('ui-theme', theme);
    };

    applyTheme(uiTheme);

    // Listener for system changes if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (uiTheme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [uiTheme]);

  const handleReset = () => {
    setDocumentState(DEFAULT_STATE);
    setUploadedFile(null);
    setZoom(100);
  };

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden text-slate-800 dark:text-slate-200 font-display transition-colors duration-300"
      style={{ backgroundColor: documentState.appBackground }}
    >
      <Header 
        uiTheme={uiTheme} 
        setUiTheme={setUiTheme} 
        documentState={documentState}
        setDocumentState={setDocumentState}
        onFileUpload={setUploadedFile}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <Editor 
          state={documentState} 
          file={uploadedFile} 
          onCloseFile={() => setUploadedFile(null)}
          onFileUpload={setUploadedFile}
          zoom={zoom}
          setZoom={setZoom}
        />
        <Sidebar 
          state={documentState} 
          onChange={setDocumentState} 
          onReset={handleReset}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      <Footer zoom={zoom} setZoom={setZoom} />
    </div>
  );
};

export default App;
EOF

# 10. Create src/components/Header.tsx
cat << 'EOF' > src/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { UITheme, DocumentState } from '../types';
import { THEME_PRESETS } from '../constants';

interface HeaderProps {
  uiTheme: UITheme;
  setUiTheme: (theme: UITheme) => void;
  documentState: DocumentState;
  setDocumentState: (state: DocumentState) => void;
  onFileUpload: (file: File) => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ uiTheme, setUiTheme, documentState, setDocumentState, onFileUpload, onToggleSidebar }) => {
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
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset input so same file can be selected again if needed
    if (event.target) {
      event.target.value = '';
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
          onChange={handleFileChange}
        />
        <button
          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all duration-200 flex items-center hover:scale-110"
          onClick={() => fileInputRef.current?.click()}
          title="Open DOCX File"
        >
          <span className="material-icons-outlined text-xl">folder_open</span>
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
        
        <button className="bg-primary hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95">
          <span className="material-icons-outlined text-sm">save</span>
          <span className="hidden sm:inline">Save</span>
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
EOF

# 11. Create src/components/Footer.tsx
cat << 'EOF' > src/components/Footer.tsx
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
EOF

# 12. Create src/components/Sidebar.tsx
cat << 'EOF' > src/components/Sidebar.tsx
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
  
  // Sidebar Layout State
  const [width, setWidth] = useState(320);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        const fontSet = new Set(availableFonts);
        for (const font of localFonts) {
          fontSet.add(font.family);
        }
        setAvailableFonts(Array.from(fontSet).sort());
      } catch (err) {
        console.error('Error loading fonts:', err);
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
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
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
          transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:translate-x-0 md:z-10
          ${isResizing ? 'transition-none' : ''}
        `}
        style={{ width: isMobile ? '85%' : (isCollapsed ? '4rem' : width) }}
      >
        {/* Resize Handle (Desktop Only) */}
        {!isCollapsed && !isMobile && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 z-20 transition-colors duration-200 ${isResizing ? 'bg-primary' : 'bg-transparent'}`}
            onMouseDown={startResizing}
          />
        )}

        {/* Sidebar Header */}
        <div className={`p-4 border-b border-slate-200 dark:border-slate-800 flex ${isCollapsed ? 'justify-center px-0' : 'justify-between'} items-center shrink-0 transition-colors duration-300`}>
          {!isCollapsed && (
            <h2 className="font-semibold text-slate-800 dark:text-white text-sm truncate animate-fadeIn">Typography & Styles</h2>
          )}
          <div className="flex items-center gap-1">
            {/* Mobile Close Button */}
            <button 
              onClick={onMobileClose}
              className="md:hidden text-slate-400 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Close Sidebar"
            >
              <span className="material-icons-outlined text-lg">close</span>
            </button>

            {/* Desktop Collapse/Expand Button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block text-slate-400 hover:text-primary transition-all duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <span className="material-icons-outlined text-lg">{isCollapsed ? 'tune' : 'chevron_right'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar animate-fadeIn">
          {isCollapsed ? (
             // Collapsed Icons
             <div className="flex flex-col gap-6 items-center mt-2">
                <span className="material-icons-outlined text-slate-400 text-xl hover:text-primary cursor-pointer transition-colors" title="Typography">text_fields</span>
                <span className="material-icons-outlined text-slate-400 text-xl hover:text-primary cursor-pointer transition-colors" title="Colors">palette</span>
                <span className="material-icons-outlined text-slate-400 text-xl hover:text-primary cursor-pointer transition-colors" title="Settings">settings</span>
             </div>
          ) : (
            // Full Content
            <>
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
                    className="text-primary hover:text-blue-600 disabled:text-slate-400 transition-all duration-200 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center hover:scale-110"
                    title={isLoadingFonts ? "Loading fonts..." : "Load local fonts from computer"}
                  >
                    {isLoadingFonts ? (
                      <span className="material-icons-outlined text-lg animate-spin">refresh</span>
                    ) : (
                      <span className="material-icons-outlined text-lg">download</span>
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
                            className={`flex-1 py-1 text-xs capitalize rounded transition-all duration-200 ${
                              state.footnoteNumbers.position === pos 
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

            </>
          )}
        </div>

        {/* Sidebar Footer / Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121620] shrink-0 transition-colors duration-300">
            <button 
              className="w-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 py-2 rounded text-sm font-medium transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
              onClick={onReset}
            >
              Reset to Default
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
