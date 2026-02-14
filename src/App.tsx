import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { FileSidebar } from './components/FileSidebar';
import { DocumentState, DEFAULT_STATE, UITheme, FileState } from './types';

const App: React.FC = () => {
  const [documentState, setDocumentState] = useState<DocumentState>(DEFAULT_STATE);
  const [uploadedFiles, setUploadedFiles] = useState<FileState[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [zoom, setZoom] = useState(100);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileFileSidebarOpen, setIsMobileFileSidebarOpen] = useState(false);
  const [uiTheme, setUiTheme] = useState<UITheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ui-theme') as UITheme) || 'system';
    }
    return 'system';
  });

  // Get current file
  const currentFile = currentFileIndex >= 0 && currentFileIndex < uploadedFiles.length
    ? uploadedFiles[currentFileIndex]
    : null;

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
  };

  // Handle adding new files
  const handleFilesUpload = (files: File[]) => {
    const newFileStates: FileState[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending' as const
    }));
    
    setUploadedFiles(prev => [...prev, ...newFileStates]);
    
    // Select the first new file if none selected
    if (currentFileIndex === -1 && newFileStates.length > 0) {
      setCurrentFileIndex(uploadedFiles.length);
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      
      // Adjust current index
      if (currentFileIndex === index) {
        setCurrentFileIndex(newFiles.length > 0 ? Math.min(index, newFiles.length - 1) : -1);
      } else if (currentFileIndex > index) {
        setCurrentFileIndex(currentFileIndex - 1);
      }
      
      return newFiles;
    });
  };

  // Handle file conversion status update
  const handleFileConverted = (index: number, convertedFile: File) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = {
        ...newFiles[index],
        status: 'converted',
        convertedFile
      };
      return newFiles;
    });
  };

  // Handle file conversion error
  const handleFileError = (index: number, error: string) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = {
        ...newFiles[index],
        status: 'error',
        error
      };
      return newFiles;
    });
  };

  // Handle selecting a file
  const handleSelectFile = (index: number) => {
    setCurrentFileIndex(index);
  };

  // Handle clearing all files
  const handleClearAllFiles = () => {
    setUploadedFiles([]);
    setCurrentFileIndex(-1);
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
        onFilesUpload={handleFilesUpload}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onToggleFileSidebar={() => setIsMobileFileSidebarOpen(!isMobileFileSidebarOpen)}
        convertedFile={currentFile?.convertedFile || null}
        totalFiles={uploadedFiles.length}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <FileSidebar
          files={uploadedFiles}
          currentIndex={currentFileIndex}
          onSelectFile={handleSelectFile}
          onRemoveFile={handleRemoveFile}
          onFilesUpload={handleFilesUpload}
          onFileConverted={handleFileConverted}
          onFileError={handleFileError}
          onClearAllFiles={handleClearAllFiles}
          isMobileOpen={isMobileFileSidebarOpen}
          onMobileClose={() => setIsMobileFileSidebarOpen(false)}
        />
        <Editor
          state={documentState}
          files={uploadedFiles}
          currentIndex={currentFileIndex}
          onSelectFile={handleSelectFile}
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
