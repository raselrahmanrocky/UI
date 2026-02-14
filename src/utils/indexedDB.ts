// IndexedDB utility for storing file history
const DB_NAME = 'TypeMasterDB';
const DB_VERSION = 1;
const STORE_NAME = 'fileHistory';

interface FileHistoryItem {
    id: string;
    originalFileName: string;
    convertedFileName: string;
    originalFile?: Blob;
    convertedFile?: Blob;
    timestamp: number;
    status: 'converted' | 'downloaded';
}

// Open IndexedDB database
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('originalFileName', 'originalFileName', { unique: false });
            }
        };
    });
};

// Save file to history
export const saveToFileHistory = async (
    originalFile: File,
    convertedFile: File
): Promise<FileHistoryItem> => {
    const db = await openDB();

    const item: FileHistoryItem = {
        id: Math.random().toString(36).substring(2, 15),
        originalFileName: originalFile.name,
        convertedFileName: convertedFile.name,
        originalFile: originalFile,
        convertedFile: convertedFile,
        timestamp: Date.now(),
        status: 'converted'
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(item);

        request.onsuccess = () => resolve(item);
        request.onerror = () => reject(request.error);
    });
};

// Get all file history items
export const getFileHistory = async (): Promise<FileHistoryItem[]> => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('timestamp');
        const request = index.getAll();

        request.onsuccess = () => {
            // Sort by timestamp descending (newest first)
            const items = request.result.sort((a, b) => b.timestamp - a.timestamp);
            resolve(items);
        };
        request.onerror = () => reject(request.error);
    });
};

// Delete a file history item
export const deleteFromFileHistory = async (id: string): Promise<void> => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Clear all file history
export const clearFileHistory = async (): Promise<void> => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Download file from history
export const downloadFromHistory = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Format timestamp to readable date
export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};
