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

export interface FootnoteData {
  id: string;
  content: string;
}

export interface FontMapping {
  [key: string]: string;
}

export type UITheme = 'light' | 'dark' | 'system';

// Multi-file state types
export interface FileState {
  id: string;
  file: File;
  status: 'pending' | 'converting' | 'converted' | 'error';
  convertedFile?: File;
  error?: string;
}
