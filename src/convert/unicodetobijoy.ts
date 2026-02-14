import { FontMapping } from '../types';

/**
 * Comprehensive mapping derived from SutonnyMJ/Bijoy standards for Unicode to Bijoy conversion.
 * Convert Unicode to Bijoy/ASCII
 */
export const UNICODE_TO_BIJOY_MAP: FontMapping = {
    "অ": "A", "আ": "Av", "ই": "B", "ঈ": "C", "উ": "D", "ঊ": "E", "ঋ": "F", "এ": "G", "ঐ": "H", "ও": "I", "ঔ": "J",
    "ক": "K", "খ": "L", "গ": "M", "ঘ": "N", "ঙ": "O", "চ": "P", "ছ": "Q", "জ": "R", "ঝ": "S", "ঞ": "T",
    "ট": "U", "ঠ": "V", "ড": "W", "ঢ": "X", "ণ": "Y", "ত": "Z", "থ": "_", "দ": "`", "ধ": "a", "ন": "b",
    "প": "c", "ফ": "d", "ব": "e", "ভ": "f", "ম": "g", "য": "h", "র": "i", "ল": "j", "শ": "k", "ষ": "l",
    "স": "m", "হ": "n", "ড়": "o", "ঢ়": "p", "য়": "q", "ৎ": "r", "ং": "s", "ঃ": "t", "ঁ": "u",
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    "া": "v", "ি": "w", "ী": "x", "ু": "y", "ূ": "~", "্য": "¨", "ৃ": "„", "ৈ": "ˆ", "ৌ": "†Š", "ৗ": "Š", "ে": "‡", "ো": "†v", "্": "&", "।": "|", "॥": "||",
    "‘": "Ô", "’": "Õ", "“": "Ò", "”": "Ó", "৳": "$", "্র্র": "Ö",

    // U-kar 
    "কু": "Kz", "ঙু": "Oz", "চু": "Pz", "ছু": "Qz", "ঝু": "Sz", "ঞু": "Tz", "টু": "Uz", "ঠু": "Vz", "ডু": "Wz", "ঢু": "Xz", "তু": "Zz", "ফু": "dz", "ভু": "fz",
    // ঊ-কার
    "ভূ": "f‚",
    // Re-kar
    "কৃ": "K…", "চৃ": "P…", "ছৃ": "Q…", "ঝৃ": "S…", "ঞৃ": "T…", "টৃ": "U…", "ঠৃ": "V…", "ডৃ": "W…", "ঢৃ": "X…", "তৃ": "Z…", "ভৃ": "f…", "ফৃ": "d…", "হৃ": "ü",
    // Conjuncts and Special Forms
    "গু": "¸", "ক্ষ": "¶", "ম্ন": "¤œ", "ক্র": "µ", "ক্ক": "°", "ম্র": "¤ª", "ক্ট": "±", "ক্ত": "³", "ক্ব": "K¡",
    "ক্লি": "wK¬", "ক্ল": "K¬", "ক্স": "·", "খ্র": "Lª", "গ্দ": "M&`", "গ্ধ": "»", "গ্ন": "Mœ", "গ্ম": "M¥",
    "গ্র": "MÖ", "গ্ল": "Mø", "ঙ্ক": "¼", "ঙ্খ": "•L", "ঙ্গ": "½", "ঙ্ঘ": "•N", "চ্চ": "”P", "চ্ছ": "”Q",
    "জ্জ": "¾", "জ্ঝ": "À", "জ্ঞ": "Á", "জ্ব": "R¡", "জ্র": "Rª", "ঞ্চ": "Â", "ঞ্ছ": "Ã", "ঞ্জ": "Ä",
    "ঞ্ঝ": "Å", "ট্ট": "Æ", "ট্ব": "U¡", "ট্ম": "U¥", "ট্র": "Uª", "ড্ড": "Ç", "ড্র": "Wª", "ঢ্র": "Xª",
    "ণ্ট": "È", "ণ্ঠ": "É", "ণ্ড": "Ð", "ণ্ণ": "Yœ", "ত্ত": "Ë", "ত্থ": "Ì", "থ্র": "_ª", "ত্ন": "Zœ", "ত্ম": "Z¥",
    "ত্র": "Î", "দ্দ": "Ï", "দ্ধ": "×", "দ্ব": "Ø", "দ্ভ": "™¢", "দ্ম": "Ù", "দ্র": "`ª", "ধ্র": "aª", "ধ্ব": "aŸ",
    "ধ্ম": "a¥", "ন্ত": "šÍ", "\u09A8\u09CD\u09A5": "š’", "ন্দ": "›`", "ন্ধ": "Ü", "ন্ন": "bœ", "ন্ম": "b¥", "প্ট": "Þ",
    "প্ত": "ß", "প্ন": "cœ", "প্প": "à", "প্র": "cÖ", "প্ল": "cø", "প্স": "á", "ফ্র": "d«", "ফ্ল": "d¬",
    "ব্জ": "â", "ব্দ": "ã", "ব্ধ": "ä", "ব্ব": "eŸ", "ব্র": "eª", "ব্ল": "eø", "ভ্র": "å", "ম্ফ": "ç",
    "ম্ব": "¤^", "ম্ভ": "¤¢", "ম্ম": "¤§", "ম্ল": "¤ø", "ল্ক": "é", "ল্গ": "ê", "ল্ট": "ë", "ল্ড": "ì",
    "ল্প": "í", "ল্ব": "j¦", "ল্ম": "j¥", "ল্ল": "jø", "শ্চ": "ð", "শ্ন": "kœ", "শ্ব": "k¦", "শ্ম": "k¥",
    "শ্ল": "kø", "ষ্ক": "®‹", "ষ্ট": "ó", "ষ্ট্র": "óª", "ষ্ঠ": "ô", "ষ্ণ": "ò", "ষ্প": "®ú", "ষ্ফ": "õ", "ষ্ম": "®§",
    "স্ক": "¯‹", "স্খ": "ö", "স্র": "¯ª", "স্ট": "÷", "স্ট্র": "÷ª", "স্ত": "¯Í", "স্ত্র": "¯¿", "\u09B8\u09CD\u09A5": "¯’", "স্ন": "mœ", "স্প": "¯ú", "স্প্র": "¯úª", "স্ফ": "ù",
    "স্ব": "¯^", "স্ম": "¯§", "স্ল": "¯ø", "হ্ণ": "nè", "হ্ন": "ý", "হ্ম": "þ", "হ্ল": "n¬", "হু": "û",
    "শু": "ï", "ক্ত্র": "³ª", "ক্ন": "Kè", "ন্স": "Ý", "ক্ষ্ণ": "òœ", "ক্ষ্ম": "²", "ক্ষ্র": "ÿ«", "গ্ব": "M&e",
    "ঘ্ন": "Nœ", "ঘ্র": "Nª", "ঙ্গু": "½y", "জ্জ্ব": "¾¡", "ত্ত্ব": "Ë¡", "ত্রু": "Îæ", "দ্রু": "`ªæ",
    "ভ্রু": "åæ", "শ্রু": "kÖæ", "ম্প": "¤ú", "ম্প্র": "¤úª", "র‌্য": "i¨", "ক্য": "K¨", "ল্যু": "jy¨", "ক্লু": "K¬z",
    "ত্র্য": "Î¨", "\u09B8\u09CD\u09A5\u09AF": "¯’¨", "দ্য": "`¨", "ভ্য": "f¨", "ল্য": "j¨", "ম্য": "g¨", "ন্য": "b¨",
    "ণ্য": "Y¨", "ব্যু": "ey¨", "ত্ব": "Z¡", "হ্ব": "nŸ", "গ্নু": "Mœy", "ন্ত্র": "š¿", "ন্ড্র": "Ûª", "রূ": "iƒ", "\u09B8\u09CD\u09A4\u09C1": "¯‘", "ণ্ড্র": "Ðª", "রু": "iæ", "ন্দ্র": "›`ª", "স্মৃ": "¯§„", "শ্র": "kÖ", "চ্যু": "Pz¨", "ন্ড": "Û", "ন্দ্ব": "›`¦", "ন্ট": "›U", "\u09B0\u09CD\u09A1": "W©",
};

const sortedUnicodeKeys = Object.keys(UNICODE_TO_BIJOY_MAP).sort((a, b) => b.length - a.length);

function normalizeTypography(text: string): string {
    if (!text) return "";

    let result = text;
    // ১. দাড়ির আগের স্পেস রিমুভ করা
    result = result.replace(/ +([\u0964])/gm, '$1');
    result = result.replace(/ +([\u0020])/gm, '');
    // ২. দাড়ির পরের স্পেস রিমুভ করা
    // ২. দাড়ির পরের স্পেস রিমুভ করা
    result = result.replace(/([\u0964\u0965])[ \t]*/gm, '$1');
    result = result.replace(/([।])[ \t]*/gm, '$1 ');
    result = result.replace(/([।])(?=[^ \t\r\n\u0964\u0965])/gm, '$1 ');
    return result;
}

export function convertUnicodeToBijoy(unicodeInput: string): string {
    if (!unicodeInput) return "";

    const CONSONANTS = 'কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়';
    const I_KAR = '\u09BF';
    const E_KAR = '\u09C7';
    const OI_KAR = '\u09C8';
    const O_KAR = '\u09CB';
    const OU_KAR = '\u09CC';
    const AKAR = '\u09BE';
    const OU_PART2 = '\u09D7';
    const HASANTA = '\u09CD';
    const REF = '\u09B0\u09CD';
    const RA_PHALA = '\u09CD\u09B0';

    let text = unicodeInput;
    const cluster = `(?:(?:[${CONSONANTS}]${HASANTA})+[${CONSONANTS}]|[${CONSONANTS}])`;

    text = text.replace(new RegExp(`(${cluster})(${O_KAR}|${OU_KAR})`, 'g'), (_m, base, vowel) => {
        return vowel === O_KAR ? base + E_KAR + AKAR : base + E_KAR + OU_PART2;
    });

    text = text.replace(new RegExp(`(${REF})?(${cluster})(${I_KAR}|${E_KAR}|${OI_KAR})`, 'g'), (_m, reph, base, vowel) => {
        return vowel + (reph || '') + base;
    });

    let output = "";
    let k = 0;
    while (k < text.length) {
        let found = false;

        if (text.substring(k, k + 2) === REF) {
            let matchedCluster = "";
            for (const key of sortedUnicodeKeys) {
                if (text.substring(k + 2, k + 2 + key.length) === key) {
                    matchedCluster = key;
                    break;
                }
            }
            if (matchedCluster) {
                output += UNICODE_TO_BIJOY_MAP[matchedCluster] + "©";
                k += 2 + matchedCluster.length;
                found = true;
            }
        }

        if (!found) {
            for (const key of sortedUnicodeKeys) {
                if (text.startsWith(key, k)) {
                    output += UNICODE_TO_BIJOY_MAP[key];
                    k += key.length;
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            const char = text[k];
            if (CONSONANTS.indexOf(char) !== -1 && text.substring(k + 1, k + 3) === RA_PHALA) {
                const bijoyConsonant = UNICODE_TO_BIJOY_MAP[char];
                if (bijoyConsonant) {
                    output += bijoyConsonant + "Ö"; // Changed Z to Ö (Ra-phala)
                    k += 3;
                    found = true;
                }
            }
        }

        if (!found) {
            output += text[k];
            k++;
        }
    }
    return normalizeTypography(output);
}

function parseLanguageSegments(text: string) {
    // 1. Tokenize into Types
    // Type 0: Neutral (Space, Punctuation, Symbols)
    // Type 1: Bangla (Strong)
    // Type 2: English (Strong)

    const tokens: { char: string; type: 0 | 1 | 2 }[] = [];

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const code = char.charCodeAt(0);

        // Bangla: Unicode Block (0980-09FF) + Danda (0964, 0965)
        if ((code >= 0x0980 && code <= 0x09FF) || code === 0x0964 || code === 0x0965) {
            tokens.push({ char, type: 1 });
        }
        // English: Alphanumeric (A-Z, a-z, 0-9)
        else if (/[A-Za-z0-9]/.test(char)) {
            tokens.push({ char, type: 2 });
        }
        // Neutral: Everything else
        else {
            tokens.push({ char, type: 0 });
        }
    }

    // 2. Resolver Logic: Assign Neutral tokens to a Strong type
    // Default to Bangla (1) if no context, as SutonnyMJ is the target
    // Rules:
    // - If Neutral is between English & English -> English
    // - If Neutral is between Bangla & Bangla -> Bangla
    // - If Neutral is adjacent to English (e.g. "Code.") -> English
    // - If Neutral is adjacent to Bangla (e.g. "বাংলা।") -> Bangla
    // - Priority: Look Left (Previous Strong) first, then Right (Next Strong)

    const resolvedTypes: (1 | 2)[] = new Array(tokens.length).fill(1); // Default to Bangla

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 0) {
            resolvedTypes[i] = tokens[i].type as 1 | 2;
            continue;
        }

        // It's Neutral. Look for nearest strong neighbors.
        let leftStrong: 1 | 2 | null = null;
        let rightStrong: 1 | 2 | null = null;

        // Look Left
        for (let j = i - 1; j >= 0; j--) {
            if (tokens[j].type !== 0) {
                leftStrong = tokens[j].type as 1 | 2;
                break;
            }
        }

        // Look Right
        for (let j = i + 1; j < tokens.length; j++) {
            if (tokens[j].type !== 0) {
                rightStrong = tokens[j].type as 1 | 2;
                break;
            }
        }

        // Apply Logic
        if (leftStrong === 2) {
            // Left is English -> Attach to English (e.g. "Code ")
            resolvedTypes[i] = 2;
        } else if (leftStrong === 1) {
            // Left is Bangla -> Attach to Bangla
            resolvedTypes[i] = 1;
        } else if (rightStrong === 2) {
            // No Left, but Right is English -> Attach to English (e.g. " (Code")
            resolvedTypes[i] = 2;
        } else {
            // Left is None/Bangla, Right is None/Bangla -> Default Bangla
            resolvedTypes[i] = 1;
        }
    }

    // 3. Merge contiguous Resolved Types into Segments
    const segments: { text: string; isBangla: boolean; }[] = [];
    if (tokens.length === 0) return segments;

    let currentText = tokens[0].char;
    let currentIsBangla = (resolvedTypes[0] === 1);

    for (let i = 1; i < tokens.length; i++) {
        const isBangla = (resolvedTypes[i] === 1);
        if (isBangla === currentIsBangla) {
            currentText += tokens[i].char;
        } else {
            segments.push({ text: currentText, isBangla: currentIsBangla });
            currentText = tokens[i].char;
            currentIsBangla = isBangla;
        }
    }
    segments.push({ text: currentText, isBangla: currentIsBangla });

    return segments;
}

export function convertXmlDocumentToBijoy(xmlText: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const textNodes = xmlDoc.getElementsByTagName('w:t');

    // List of common English fonts to ignore (preserve as English)
    // Expanded to include coding fonts and other common English fonts
    const IGNORED_FONTS = [
        'calibri', 'arial', 'times new roman', 'cambria', 'verdana', 'tahoma',
        'segoe ui', 'trebuchet ms', 'courier new', 'georgia', 'garamond', 'helvetica',
        'consolas', 'courier', 'monaco', 'menlo', 'lucida', 'fira', 'roboto', 'open sans', 'lato'
    ];

    // Convert live collection to array to safely modify
    const textNodesArray = Array.from(textNodes);

    for (const node of textNodesArray) {
        if (!node.textContent) continue;

        let shouldConvert = true;
        const runNode = node.parentNode as Element;

        // Check if font is English/Ignored
        if (runNode && runNode.tagName === 'w:r') {
            const rPr = runNode.getElementsByTagName('w:rPr')[0];
            if (rPr) {
                const rFonts = rPr.getElementsByTagName('w:rFonts')[0];
                if (rFonts) {
                    const attrs = ['w:ascii', 'w:hAnsi', 'w:cs'];
                    for (const attr of attrs) {
                        const val = rFonts.getAttribute(attr);
                        if (val && IGNORED_FONTS.some(ignored => val.toLowerCase().includes(ignored))) {
                            shouldConvert = false;
                            break;
                        }
                    }
                }
            }
        }

        if (shouldConvert) {
            const originalText = node.textContent;
            const segments = parseLanguageSegments(originalText);

            // If completely non-Bangla, skip conversion entirely
            const hasBangla = segments.some(s => s.isBangla);
            if (!hasBangla) continue;

            const parentParagraph = runNode.parentNode;
            if (parentParagraph && runNode.tagName === 'w:r') {
                const fragment = xmlDoc.createDocumentFragment();

                for (const segment of segments) {
                    const newRun = runNode.cloneNode(true) as Element;
                    const tNode = newRun.getElementsByTagName('w:t')[0];

                    if (tNode) {
                        if (segment.isBangla) {
                            tNode.textContent = convertUnicodeToBijoy(segment.text);

                            // Force SutonnyMJ for Bangla segments
                            let rPr = newRun.getElementsByTagName('w:rPr')[0];
                            if (!rPr) {
                                rPr = xmlDoc.createElement('w:rPr');
                                if (newRun.firstChild) {
                                    newRun.insertBefore(rPr, newRun.firstChild);
                                } else {
                                    newRun.appendChild(rPr);
                                }
                            }

                            let rFonts = rPr.getElementsByTagName('w:rFonts')[0];
                            if (!rFonts) {
                                rFonts = xmlDoc.createElement('w:rFonts');
                                rPr.appendChild(rFonts);
                            }

                            rFonts.setAttribute('w:ascii', 'SutonnyMJ');
                            rFonts.setAttribute('w:hAnsi', 'SutonnyMJ');
                            rFonts.setAttribute('w:cs', 'SutonnyMJ');
                        } else {
                            // Keep English text as is, do not force SutonnyMJ
                            tNode.textContent = segment.text;
                        }
                    }
                    fragment.appendChild(newRun);
                }
                parentParagraph.replaceChild(fragment, runNode);
            }
        }
    }

    // Process ALL paragraphs to ensure they use SutonnyMJ for paragraph mark
    // This fixes line spacing issues
    const paragraphs = xmlDoc.getElementsByTagName('w:p');
    for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];

        // Ensure w:pPr exists
        let pPr = p.getElementsByTagName('w:pPr')[0];
        if (!pPr) {
            pPr = xmlDoc.createElement('w:pPr');
            if (p.firstChild) {
                p.insertBefore(pPr, p.firstChild);
            } else {
                p.appendChild(pPr);
            }
        }

        // Ensure w:rPr exists within w:pPr
        let rPr = pPr.getElementsByTagName('w:rPr')[0];
        if (!rPr) {
            rPr = xmlDoc.createElement('w:rPr');
            pPr.appendChild(rPr);
        }

        // Ensure w:rFonts exists within w:rPr
        let rFonts = rPr.getElementsByTagName('w:rFonts')[0];
        if (!rFonts) {
            rFonts = xmlDoc.createElement('w:rFonts');
            rPr.appendChild(rFonts);
        }

        // Force SutonnyMJ for paragraph mark (influences line spacing)
        rFonts.setAttribute('w:ascii', 'SutonnyMJ');
        rFonts.setAttribute('w:hAnsi', 'SutonnyMJ');
        rFonts.setAttribute('w:cs', 'SutonnyMJ');
    }
    return new XMLSerializer().serializeToString(xmlDoc);
}
