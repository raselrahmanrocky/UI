import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { FileSidebar } from './components/FileSidebar';
import { DocumentState, DEFAULT_STATE, UITheme, FileState, ViewMode } from './types';
import { saveToFileHistory } from './utils/indexedDB';

// Unified history type that tracks all app state
interface AppState {
  documentState: DocumentState;
  uploadedFiles: FileState[];
  currentFileIndex: number;
}

const createInitialState = (): AppState => ({
  documentState: DEFAULT_STATE,
  uploadedFiles: [],
  currentFileIndex: -1
});

const App: React.FC = () => {
  const [documentState, setDocumentState] = useState<DocumentState>(DEFAULT_STATE);
  const [uploadedFiles, setUploadedFiles] = useState<FileState[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<ViewMode>('print');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Document stats for footer
  const [wordCount, setWordCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobileFileSidebarOpen, setIsMobileFileSidebarOpen] = useState(false);
  const [uiTheme, setUiTheme] = useState<UITheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ui-theme') as UITheme) || 'system';
    }
    return 'system';
  });

  // Unified Undo/Redo History State - tracks entire app state
  const [history, setHistory] = useState<AppState[]>([createInitialState()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Computed values for undo/redo availability
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Handle undo - restore entire app state
  const handleUndo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      setHistoryIndex(newIndex);
      setDocumentState(prevState.documentState);
      setUploadedFiles(prevState.uploadedFiles);
      setCurrentFileIndex(prevState.currentFileIndex);
    }
  };

  // Handle redo - restore entire app state
  const handleRedo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setHistoryIndex(newIndex);
      setDocumentState(nextState.documentState);
      setUploadedFiles(nextState.uploadedFiles);
      setCurrentFileIndex(nextState.currentFileIndex);
    }
  };

  // Helper to add current state to history
  const addToHistory = (newState: AppState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistoryIndex(newHistory.length - 1);
    }

    setHistory(newHistory);
  };

  // Update document state with history tracking
  const handleDocumentStateChange = (newState: DocumentState) => {
    const newAppState: AppState = {
      documentState: newState,
      uploadedFiles,
      currentFileIndex
    };

    addToHistory(newAppState);
    setDocumentState(newState);
  };

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
    handleDocumentStateChange(DEFAULT_STATE);
  };

  // Handle adding new files - with history tracking
  const handleFilesUpload = (files: File[]) => {
    const newFileStates: FileState[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending' as const
    }));

    const newUploadedFiles = [...uploadedFiles, ...newFileStates];
    const newFileIndex = currentFileIndex === -1 && newFileStates.length > 0
      ? uploadedFiles.length
      : currentFileIndex;

    // Add to history
    const newAppState: AppState = {
      documentState,
      uploadedFiles: newUploadedFiles,
      currentFileIndex: newFileIndex
    };
    addToHistory(newAppState);

    setUploadedFiles(newUploadedFiles);
    setCurrentFileIndex(newFileIndex);
  };

  // Handle file removal - with history tracking
  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newIndex = currentFileIndex === index
      ? (newFiles.length > 0 ? Math.min(index, newFiles.length - 1) : -1)
      : (currentFileIndex > index ? currentFileIndex - 1 : currentFileIndex);

    // Add to history
    const newAppState: AppState = {
      documentState,
      uploadedFiles: newFiles,
      currentFileIndex: newIndex
    };
    addToHistory(newAppState);

    setUploadedFiles(newFiles);
    setCurrentFileIndex(newIndex);
  };

  // Handle file conversion status update
  const handleFileConverted = async (index: number, convertedFile: File) => {
    // Save to IndexedDB history (persistent storage)
    const originalFile = uploadedFiles[index]?.file;
    if (originalFile) {
      try {
        await saveToFileHistory(originalFile, convertedFile);
      } catch (err) {
        console.error('Error saving to file history:', err);
      }
    }

    // Create new array with updated file - using functional update to get latest state
    setUploadedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles[index] = {
        ...newFiles[index],
        status: 'converted',
        convertedFile
      };
      return newFiles;
    });
  };

  // Handle file conversion error - with history tracking
  const handleFileError = (index: number, error: string) => {
    const newFiles = [...uploadedFiles];
    newFiles[index] = {
      ...newFiles[index],
      status: 'error',
      error
    };

    // Add to history
    const newAppState: AppState = {
      documentState,
      uploadedFiles: newFiles,
      currentFileIndex
    };
    addToHistory(newAppState);

    setUploadedFiles(newFiles);
  };

  // Handle selecting a file
  const handleSelectFile = (index: number) => {
    setCurrentFileIndex(index);
  };

  // Handle clearing all files - with history tracking
  const handleClearAllFiles = () => {
    // Add to history
    const newAppState: AppState = {
      documentState,
      uploadedFiles: [],
      currentFileIndex: -1
    };
    addToHistory(newAppState);

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
        setDocumentState={handleDocumentStateChange}
        onFilesUpload={handleFilesUpload}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onToggleFileSidebar={() => setIsMobileFileSidebarOpen(!isMobileFileSidebarOpen)}
        convertedFile={currentFile?.convertedFile || null}
        totalFiles={uploadedFiles.length}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
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
          viewMode={viewMode}
          onStatsUpdate={(stats) => {
            setWordCount(stats.wordCount);
            setCurrentPage(stats.currentPage);
            setTotalPages(stats.totalPages);
          }}
        />
        <Sidebar
          state={documentState}
          onChange={handleDocumentStateChange}
          onReset={handleReset}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      <Footer
        zoom={zoom}
        setZoom={setZoom}
        wordCount={wordCount}
        currentPage={currentPage}
        totalPages={totalPages}
        hasDocument={currentFile !== null}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
};

export default App;
