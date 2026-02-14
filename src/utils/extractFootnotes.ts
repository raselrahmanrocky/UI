import JSZip from 'jszip';
import { FootnoteData } from '../types';

/**
 * Extracts footnotes from a DOCX file
 * @param file - The DOCX file to extract footnotes from
 * @returns Promise<FootnoteData[]> - Array of footnote data
 */
export async function extractFootnotesFromDocx(file: File): Promise<FootnoteData[]> {
  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    
    // Check if footnotes.xml exists
    const footnotesFile = content.file("word/footnotes.xml");
    if (!footnotesFile) {
      return [];
    }

    const xmlText = await footnotesFile.async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    
    const footnotes: FootnoteData[] = [];
    const footnoteElements = xmlDoc.getElementsByTagName('w:footnote');
    
    for (let i = 0; i < footnoteElements.length; i++) {
      const footnote = footnoteElements[i];
      const id = footnote.getAttribute('w:id');
      
      // Skip separator and continuationSeparator footnotes
      if (!id || id === '-1' || id === '0') {
        continue;
      }

      // Extract text content from the footnote
      let content = '';
      const textElements = footnote.getElementsByTagName('w:t');
      for (let j = 0; j < textElements.length; j++) {
        const textNode = textElements[j];
        if (textNode.textContent) {
          content += textNode.textContent;
        }
      }

      if (content.trim()) {
        footnotes.push({
          id: id,
          content: content.trim()
        });
      }
    }

    return footnotes;
  } catch (error) {
    console.error('Error extracting footnotes:', error);
    return [];
  }
}
