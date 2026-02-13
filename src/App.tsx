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
