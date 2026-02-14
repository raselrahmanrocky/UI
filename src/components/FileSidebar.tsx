import React, { useState, useRef } from 'react';
import { FileState } from '../types';
import JSZip from 'jszip';
import { convertXmlDocument } from '../convert/bijoytounicode';
import { convertXmlDocumentToBijoy } from '../convert/unicodetobijoy';

interface FileSidebarProps {
  files: FileState[];
  currentIndex: number;
  onSelectFile: (index: number) => void;
  onRemoveFile: (index: number) => void;
  onFilesUpload: (files: File[]) => void;
  onFileConverted: (index: number, convertedFile: File) => void;
  onFileError: (index: number, error: string) => void;
  onClearAllFiles: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const FileSidebar: React.FC<FileSidebarProps> = ({
  files,
  currentIndex,
  onSelectFile,
  onRemoveFile,
  onFilesUpload,
  onFileConverted,
  onFileError,
  onClearAllFiles,
  isMobileOpen,
  onMobileClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [convertingIndex, setConvertingIndex] = useState<number | null>(null);
  const [conversionType, setConversionType] = useState<'legacyToUnicode' | 'unicodeToLegacy'>('legacyToUnicode');
  const [forceConvert, setForceConvert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Conversion function for a single file
  const convertFile = async (fileState: FileState, index: number) => {
    setConvertingIndex(index);

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(fileState.file);

      // Find all XML files that might contain text
      const xmlFiles = Object.keys(content.files).filter(path =>
        path.startsWith('word/') && path.endsWith('.xml')
      );

      for (const path of xmlFiles) {
        const xmlFile = content.file(path);
        if (xmlFile) {
          const xmlText = await xmlFile.async('string');
          let convertedXml: string;

          if (conversionType === 'legacyToUnicode') {
            const isStyleFile = path.includes('styles.xml');
            convertedXml = convertXmlDocument(xmlText, isStyleFile, forceConvert);
          } else {
            convertedXml = convertXmlDocumentToBijoy(xmlText);
          }

          zip.file(path, convertedXml);
        }
      }

      const convertedBlob = await zip.generateAsync({ type: 'blob' });
      const convertedFile = new File([convertedBlob], fileState.file.name, { type: fileState.file.type });

      onFileConverted(index, convertedFile);

      // Auto-select this file to show converted version
      onSelectFile(index);
    } catch (err) {
      console.error("Conversion error:", err);
      onFileError(index, 'Failed to convert file');
    } finally {
      setConvertingIndex(null);
    }
  };

  // Convert all files
  const handleConvertAll = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending' || files[i].status === 'error') {
        await convertFile(files[i], i);
      }
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const docxFiles = selectedFiles.filter(f => f.name.endsWith('.docx'));

      if (docxFiles.length > 0) {
        onFilesUpload(docxFiles);
      } else {
        alert('Please select valid .docx files.');
      }
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  // Download a single file
  const handleDownload = (fileState: FileState) => {
    const fileToDownload = fileState.convertedFile || fileState.file;
    const url = URL.createObjectURL(fileToDownload);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileToDownload.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all converted files
  const handleDownloadAll = () => {
    files.forEach((fileState, index) => {
      if (fileState.status === 'converted' || fileState.status === 'pending') {
        setTimeout(() => handleDownload(fileState), index * 200);
      }
    });
  };

  // Clear all files with confirmation
  const handleClearAll = () => {
    if (files.length > 0) {
      const confirmed = window.confirm(`Are you sure you want to remove all ${files.length} file${files.length !== 1 ? 's' : ''}?`);
      if (confirmed) {
        onClearAllFiles();
      }
    }
  };

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
          bg-white dark:bg-[#151b2b] border-r border-slate-200 dark:border-slate-800 flex flex-col 
          fixed inset-y-0 left-0 z-50 h-full shadow-2xl md:shadow-none
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:z-10
        `}
        style={{
          width: window.innerWidth < 768 ? '85%' : (isCollapsed ? '3rem' : '280px')
        }}
      >
        {isCollapsed ? (
          <div className="hidden md:flex flex-col items-center py-4 w-full h-full animate-fadeIn">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200 mb-4 hover:scale-110"
              title="Expand File Sidebar"
            >
              <span className="material-icons-outlined text-lg">folder</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full overflow-hidden animate-fadeIn">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0 transition-colors duration-300">
              <h2 className="font-semibold text-slate-800 dark:text-white text-sm truncate animate-fadeIn flex items-center gap-2">
                <span className="material-icons-outlined text-primary">folder_copy</span>
                Files ({files.length})
              </h2>
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
                  <span className="material-icons-outlined text-lg">chevron_left</span>
                </button>
              </div>
            </div>

            {/* Conversion Settings */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121620]">
              <div className="flex flex-col gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded p-1">
                  <button
                    onClick={() => setConversionType('legacyToUnicode')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-all duration-200 ${conversionType === 'legacyToUnicode'
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                  >
                    SutonnyMJ → Unicode
                  </button>
                  <button
                    onClick={() => setConversionType('unicodeToLegacy')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-all duration-200 ${conversionType === 'unicodeToLegacy'
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                  >
                    Unicode → SutonnyMJ
                  </button>
                </div>

                {conversionType === 'legacyToUnicode' && (
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forceConvert}
                      onChange={(e) => setForceConvert(e.target.checked)}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    Force Convert
                  </label>
                )}
              </div>
            </div>

            {/* Add Files Button */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".docx"
                multiple
                onChange={handleFileInputChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg"
              >
                <span className="material-icons-outlined text-sm">add</span>
                Add Files
              </button>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {files.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <span className="material-icons-outlined text-3xl mb-2 block">folder_open</span>
                  <p>No files uploaded</p>
                  <p className="mt-1">Add .docx files to start</p>
                </div>
              ) : (
                files.map((fileState, index) => (
                  <div
                    key={fileState.id}
                    className={`
                      group p-3 rounded-lg border transition-all duration-200 cursor-pointer relative
                      ${currentIndex === index
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50'
                      }
                    `}
                    onClick={() => onSelectFile(index)}
                  >
                    {/* Serial Number Badge */}
                    <div className={`
                      absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm
                      ${currentIndex === index
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }
                    `}>
                      {index + 1}
                    </div>

                    <div className="flex items-start justify-between gap-2 ml-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-icons-outlined text-sm text-slate-400">description</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {fileState.file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className={`
                            px-1.5 py-0.5 rounded-full font-medium
                            ${fileState.status === 'pending' && 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}
                            ${fileState.status === 'converting' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}
                            ${fileState.status === 'converted' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}
                            ${fileState.status === 'error' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}
                          `}>
                            {fileState.status === 'pending' && 'Pending'}
                            {fileState.status === 'converting' && 'Converting...'}
                            {fileState.status === 'converted' && 'Converted'}
                            {fileState.status === 'error' && 'Error'}
                          </span>
                          <span className="text-slate-400">
                            {(fileState.file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        {fileState.error && (
                          <p className="text-xs text-red-500 mt-1">{fileState.error}</p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFile(index);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                        title="Remove file"
                      >
                        <span className="material-icons-outlined text-sm">close</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      {fileState.status !== 'converted' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            convertFile(fileState, index);
                          }}
                          disabled={convertingIndex === index}
                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium py-1.5 px-2 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          {convertingIndex === index ? (
                            <>
                              <span className="material-icons-outlined text-xs animate-spin">refresh</span>
                              Converting
                            </>
                          ) : (
                            <>
                              <span className="material-icons-outlined text-xs">transform</span>
                              Convert
                            </>
                          )}
                        </button>
                      )}

                      {(fileState.status === 'converted' || fileState.status === 'pending') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(fileState);
                          }}
                          className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-medium py-1.5 px-2 rounded transition-all duration-200 flex items-center justify-center gap-1"
                        >
                          <span className="material-icons-outlined text-xs">download</span>
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Footer Actions */}
            {files.length > 0 && (
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121620] shrink-0 space-y-2">
                {/* Bulk Actions - Only show when multiple files */}
                {files.length > 1 && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleConvertAll}
                      disabled={files.every(f => f.status === 'converted') || convertingIndex !== null}
                      className="bg-primary hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-md shadow-blue-500/20"
                    >
                      <span className="material-icons-outlined text-sm">transform</span>
                      Convert All
                    </button>

                    <button
                      onClick={handleDownloadAll}
                      disabled={files.length === 0}
                      className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 py-2 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1"
                    >
                      <span className="material-icons-outlined text-sm">download</span>
                      Download All
                    </button>
                  </div>
                )}

                {/* Clear All - Always show when files exist */}
                <button
                  onClick={handleClearAll}
                  className="w-full border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span className="material-icons-outlined text-sm">delete_sweep</span>
                  Clear All ({files.length} file{files.length !== 1 ? 's' : ''})
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};
