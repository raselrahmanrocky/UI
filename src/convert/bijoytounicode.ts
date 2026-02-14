import { FontMapping } from '../types';

/**
 * Comprehensive mapping derived from SuttonyMJ/Bijoy standards with user-specific overrides.
 * Convert Bijoy/ASCII to Unicode 
 */
const UNICODE_TO_BIJOY: FontMapping = {
    "অ": "A", "আ": "Av", "ই": "B", "ঈ": "C", "উ": "D", "ঊ": "E", "ঋ": "F", "এ": "G", "ঐ": "H", "ও": "I", "ঔ": "J",
    "ক": "K", "খ": "L", "গ": "M", "ঘ": "N", "ঙ": "O", "চ": "P", "ছ": "Q", "জ": "R", "ঝ": "S", "ঞ": "T",
    "ট": "U", "ঠ": "V", "ড": "W", "ঢ": "X", "ণ": "Y", "ত": "Z", "থ": "_", "দ": "`", "ধ": "a", "ন": "b",
    "প": "c", "ফ": "d", "ব": "e", "ভ": "f", "ম": "g", "য": "h", "র": "i", "ল": "j", "শ": "k", "ষ": "l",
    "স": "m", "হ": "n", "ড়": "o", "ঢ়": "p", "য়": "q", "ৎ": "r", "ং": "s", "ঃ": "t", "ঁ": "u",
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    "া": "v", "ি": "w", "ী": "x", "ু": "y", "ূ": "~", "্য": "¨", "ৃ": "„", "ৈ": "^", "ৌ": "†Š", "ৗ": "Š", "ে": "†", "ো": "†v", "্": "&", "।": "|", "॥": "||",
    "‘": "Ô", "’": "Õ", "“": "Ò", "”": "Ó", "৳": "$",

    // Conjuncts and Special Forms
    "গু": "¸", "ক্ষ": "¶", "ম্ন": "¤œ", "ক্র": "µ", "ক্ক": "°", "ম্র": "¤ª", "ক্ট": "±", "ক্ত": "³", "ক্ব": "K¡",
    "ক্লি": "wK¬", "ক্ল": "K¬", "ক্স": "·", "খ্র": "Lª", "গ্দ": "M&`", "গ্ধ": "»", "গ্ন": "Mœ", "গ্ম": "M¥",
    "গ্র": "MÖ", "গ্ল": "Mø", "ঙ্ক": "¼", "ঙ্খ": "•L", "ঙ্গ": "½", "ঙ্ঘ": "•N", "চ্চ": "”P", "চ্ছ": "”Q",
    "জ্জ": "¾", "জ্ঝ": "À", "জ্ঞ": "Á", "জ্ব": "R¡", "জ্র": "Rª", "ঞ্চ": "Â", "ঞ্ছ": "Ã", "ঞ্জ": "Ä",
    "ঞ্ঝ": "Å", "ট্ট": "Æ", "ট্ব": "U¡", "ট্ম": "U¥", "ট্র": "Uª", "ড্ড": "Ç", "ড্র": "Wª", "ঢ্র": "Xª",
    "ণ্ট": "È", "ণ্ঠ": "É", "ণ্ড": "Ð", "ণ্ণ": "Yœ", "ত্ত": "Ë", "ত্থ": "Ì", "ত্ন": "Zœ", "ত্ম": "Z¥",
    "ত্র": "Î", "দ্দ": "Ï", "দ্ধ": "×", "দ্ব": "Ø", "দ্ভ": "™¢", "দ্ম": "Ù", "দ্র": "`ª", "ধ্ব": "aŸ",
    "ধ্ম": "a¥", "ন্ত": "šÍ", "ন্স": "Ý", "ন্থ": "š’", "ন্দ": "›`", "ন্ধ": "Ü", "ন্ন": "bœ", "ন্ম": "b¥", "প্ট": "Þ",
    "প্ত": "ß", "প্ন": "cœ", "প্প": "à", "প্র": "cÖ", "প্ল": "cø", "প্স": "á", "ফ্র": "d«", "ফ্ল": "d¬",
    "ব্জ": "â", "ব্দ": "ã", "ব্ধ": "ä", "ব্ব": "eŸ", "ব্র": "eª", "ব্ল": "eø", "ভ্র": "å", "ম্ফ": "ç",
    "ম্ব": "¤^", "ম্ভ": "¤¢", "ম্ম": "¤§", "ম্ল": "¤ø", "ল্ক": "é", "ল্গ": "ê", "ল্ট": "ë", "ল্ড": "ì",
    "ল্প": "í", "ল্ব": "j¦", "ল্ম": "j¥", "ল্ল": "jø", "শ্চ": "ð", "শ্ন": "kœ", "শ্ব": "k^", "শ্ম": "k¥",
    "শ্ল": "kø", "ষ্ক": "®‹", "ষ্ট": "ó", "ষ্ঠ": "ô", "ষ্ণ": "ò", "ষ্প": "®ú", "ষ্ফ": "õ", "ষ্ম": "®§",
    "স্ক": "¯‹", "স্খ": "ö", "স্ট": "÷", "স্ত": "¯Í", "স্থ": "¯’", "স্ন": "mœ", "স্প": "¯ú", "স্ফ": "ù",
    "স্ব": "¯^", "স্ম": "¯§", "স্ল": "¯ø", "হ্ণ": "nè", "হ্ন": "ý", "হ্ম": "þ", "হ্ল": "n¬", "হু": "û",
    "হৃ": "ü", "শু": "ï", "ক্ত্র": "³ª", "ক্ন": "Kè", "ক্ষ্ণ": "òœ", "ক্ষ্ম": "²", "ক্ষ্র": "ÿ«", "গ্ব": "M&e",
    "ঘ্ন": "Nœ", "ঘ্র": "Nª", "ঙ্গু": "½y", "জ্জ্ব": "¾¡", "ত্ত্ব": "Ë¡", "ত্রু": "Îæ", "দ্রু": "`ªæ",
    "ভ্রু": "åæ", "শ্রু": "kÖæ", "ম্প": "¤ú", "র‌্য": "i¨", "ক্য": "K¨", "ল্যু": "j¨y", "ক্লু": "K¬z",
    "ত্র্য": "Î¨", "স্থ্য": "¯’¨", "দ্য": "`¨", "ভ্য": "f¨", "ল্য": "j¨", "ম্য": "g¨", "ন্য": "b¨",
    "ণ্য": "Y¨", "ব্যু": "ey¨", "ত্ব": "Z¡", "হ্ব": "nŸ", "গ্নু": "Mœy", "ন্ত্র": "š¿", "ন্ড্র": "Ûª", "রূ": "iƒ", "স্তু": "¯‘", "ন্ড": "Û", "ন্দ্ব": "›`¦", "ন্ট": "›U", "স্ত্র": "¯¿", "স্ত্রী": "¯¿x",
};

/**
 * Extended mapping for Bijoy/ASCII to Unicode conversion
 */
const BIJOY_TO_UNICODE: FontMapping = {
    ...Object.fromEntries(Object.entries(UNICODE_TO_BIJOY).map(([k, v]) => [v, k])),
    "y¨": "\u09CD\u09AF\u09C1",
    "z¨": "\u09CD\u09AF\u09C1",
    "¨y": "\u09CD\u09AF\u09C1",
    "¨z": "\u09CD\u09AF\u09C1",
    "¨~": "\u09CD\u09AF\u09C2",
    "~¨": "\u09CD\u09AF\u09C2",
    "vu": "\u09BE\u0981",
    "uv": "\u09BE\u0981",
    "^": "\u09C8",
    "ˆ": "\u09C8",
    "†": "\u09C7",
    "‡": "\u09C7",
    "‰": "\u09C8",
    "¸": "\u0997\u09C1",
    "¶": "\u0995\u09CD\u09B7",
    "¤œ": "\u09AE\u09CD\u09A8",
    "œ": "\u09CD\u09A8",
    "¤": "\u09AE",
    "y": "\u09C1",
    "z": "\u09C1",
    "©": "\u09B0\u09CD",
    "ÿ": "\u0995\u09CD\u09B7",
    "æ": "\u09C1",
    "Ö": "\u09CD\u09B0",
    "ª": "\u09CD\u09B0",
    "…": "\u09C3",
    "‚": "\u09C2",
    "¦": "\u09CD\u09AC",
    "Š": "\u09D7"
};

const MANUAL_ANSI_FIXES: FontMapping = {
    "GZ†": "G†Z",
    "†ga¨": "g†a¨",
    "P&P": "”P",
    "¨y": "y¨",
    "©„": "©…",
    "vu": "uv",
    "xu": "ux"
};

const sortedUnicodeKeys = Object.keys(UNICODE_TO_BIJOY).sort((a, b) => b.length - a.length);
const sortedBijoyKeys = Object.keys(BIJOY_TO_UNICODE).sort((a, b) => b.length - a.length);



function normalizeTypography(text: string): string {
    if (!text) return "";

    let result = text;
    // ১. দাড়ির আগের স্পেস রিমুভ করা
    result = result.replace(/ +([\u0964\u0965])/gm, '$1');
    // result = result.replace(/ +([\u0020])/gm, ''); // BUG: This was removing all spaces incorrectly.

    // ২. দাড়ির পরের স্পেস ঠিক করা
    result = result.replace(/([\u0964\u0965])\s*/gm, '$1 ');
    return result;
}



export function fixAnsiText(text: string): string {
    let fixed = text;
    for (const [wrong, correct] of Object.entries(MANUAL_ANSI_FIXES)) {
        fixed = fixed.split(wrong).join(correct);
    }
    return normalizeTypography(fixed);
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
                output += UNICODE_TO_BIJOY[matchedCluster] + "©";
                k += 2 + matchedCluster.length;
                found = true;
            }
        }

        if (!found) {
            for (const key of sortedUnicodeKeys) {
                if (text.startsWith(key, k)) {
                    output += UNICODE_TO_BIJOY[key];
                    k += key.length;
                    found = true;
                    break;
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

export function convertBijoyToUnicode(bijoyInput: string): string {
    if (!bijoyInput) return "";

    let text = fixAnsiText(bijoyInput);
    let unicode = "";
    let i = 0;

    // Step 1: Mapping
    while (i < text.length) {
        let matched = false;
        for (const key of sortedBijoyKeys) {
            if (text.startsWith(key, i)) {
                unicode += BIJOY_TO_UNICODE[key];
                i += key.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            unicode += text[i];
            i++;
        }
    }

    const U_CONSONANTS = '[\\u0995-\\u09B9\\u09DC-\\u09DF]';
    const U_HASANTA = '\\u09CD';
    const U_REF = '\\u09B0' + U_HASANTA;
    const U_VOWELS = '[\\u09BE-\\u09C4\\u09C7-\\u09C8\\u09CB-\\u09CC\\u09D7]';
    const U_YA_PHALA = '\\u09CD\\u09AF';

    // Step 2: Vowel/Consonant Cluster Reordering
    const clusterPattern = `(${U_CONSONANTS}(?:${U_HASANTA}${U_CONSONANTS})*(?:${U_VOWELS})?)`;
    unicode = unicode.replace(new RegExp(`${clusterPattern}(${U_REF})`, 'g'), '$2$1');

    const leadingVowels = '[\\u09BF\\u09C7\\u09C8]';
    const clusterNoVowel = `(?:${U_REF})?(?:${U_CONSONANTS}(?:${U_HASANTA}${U_CONSONANTS})*)`;
    unicode = unicode.replace(new RegExp(`(${leadingVowels})(${clusterNoVowel})`, 'g'), '$2$1');

    const allVowels = '[\\u09BE-\\u09C4\\u09C7-\\u09C8\\u09CB-\\u09CC\\u09D7\\u09BF]';
    unicode = unicode.replace(new RegExp(`(${allVowels})(${U_YA_PHALA})`, 'g'), '$2$1');

    // Combine split vowels
    unicode = unicode.replace(/\u09C7\u09BE/g, '\u09CB');
    unicode = unicode.replace(/\u09C7\u09D7/g, '\u09CC');

    // Final Cleanup
    let result = unicode.replace(/\|/gm, '\u0964');

    return normalizeTypography(result);
}

/**
 * Robust heuristic to determine if text is Bijoy/SutonnyMJ encoded.
 * Returns true only if text should be converted to Unicode Bangla.
 */
function isLikelyBijoy(text: string): boolean {
    if (!text || text.trim() === '') return false;

    // 1. If text contains Unicode Bangla, it's already converted or native Unicode.
    const banglaUnicodeRange = /[\u0980-\u09FF]/;
    if (banglaUnicodeRange.test(text)) return false;

    // 2. Check for Bijoy-specific characters and extended ASCII.
    // † (\u2020) and ‡ (\u2021) are common for E-kar in some encodings.
    const hasBijoyMarkers = /[\x80-\xFF\u2020\u2021]/.test(text);
    if (hasBijoyMarkers) return true;

    // 3. Characteristic ASCII sequences for Bijoy
    const bijoyAsciiPatterns = [
        /[A-Za-z]v[A-Za-z]/, // Aakar in middle
        /^[G][A-Za-z]/, // E-kar sequence
        /[†‡][A-Za-z]/, // Vowel lead
        /\|$/, // Dari
    ];
    if (bijoyAsciiPatterns.some(p => p.test(text))) return true;

    // 4. Common English Word check (case-insensitive)
    // If text contains common English words, it might be English.
    const commonEnglishWords = /\b(the|and|this|that|with|from|your|have|will|shall|been|should|would|could|about|which|there|their|after|before|between|under|over|through|during|including|against|during|without|because|although|though|since|until|while)\b/i;

    // 5. Check if it's clearly English (letters, numbers, common punctuation)
    // We only skip if it looks like English AND doesn't have Bijoy signals from above.
    const simpleEnglish = /^[a-zA-Z0-9\s.,;:!?'"()\-\/\\@#$%&*+=\[\]{}<>|_]+$/;
    if (simpleEnglish.test(text)) {
        // If it contains common English words, it's very likely English.
        if (commonEnglishWords.test(text)) return false;

        // If it's short and simple English, it might be English.
        // But we no longer reject long sentences just because they are ASCII.
    }

    // Default to true if Force Convert is on as we already filtered strong English signals.
    return true;
}

/**
 * Robust surgical converter for Word 2007 (Docx) 
 */
export function convertXmlDocument(xmlText: string, isStyleFile: boolean = false, forceConvert: boolean = false): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

    // Universal node finder
    const getNodes = (parent: Element | Document, tag: string) => {
        const local = parent.getElementsByTagName(tag);
        if (local.length > 0) return Array.from(local);
        return Array.from(parent.getElementsByTagNameNS(ns, tag));
    };

    const getWAttr = (el: Element, name: string) => {
        return el.getAttribute(`w:${name}`) || el.getAttribute(name) || el.getAttributeNS(ns, name);
    };

    const setWAttr = (el: Element, name: string, val: string) => {
        el.setAttribute(`w:${name}`, val);
    };

    // 1. Process Styles
    if (isStyleFile) {
        const rFonts = getNodes(xmlDoc, 'rFonts');
        for (const rf of rFonts) {
            const attrs = ['ascii', 'hAnsi', 'cs', 'eastAsia', 'hint'];
            for (const a of attrs) {
                const val = getWAttr(rf, a);
                if (val && (val.toLowerCase().includes('sutonny') || val.toLowerCase().includes('suttony'))) {
                    setWAttr(rf, a, 'Bornomala');
                }
            }
        }
        return new XMLSerializer().serializeToString(xmlDoc);
    }

    // List of common English and Bangla Unicode fonts to ignore even in Force Mode
    const IGNORED_FONTS = [
        'calibri', 'arial', 'times new roman', 'cambria', 'verdana', 'tahoma',
        'segoe ui', 'trebuchet ms', 'courier new', 'georgia', 'garamond', 'helvetica',
        // Bangla Unicode Fonts
        'vrinda', 'nikosh', 'solaimanlipi', 'kalpurush', 'siyam rupali', 'adelon',
        'akashee', 'ani', 'asomiya', 'benesen', 'beneseniap', 'bengali', 'mukti',
        'sagormy', 'shonar'
    ];

    // 2. Process Runs
    const runs = getNodes(xmlDoc, 'r');
    for (const run of runs) {
        // Run-level decision based on Font and Content
        let isSutonny = false;
        let isKnownEnglish = false;

        const rPrs = getNodes(run, 'rPr');

        // Check for Style (Run or Paragraph level)
        const pStyle = getNodes(run.parentElement || xmlDoc, 'pStyle')[0];
        const rStyle = rPrs.length > 0 ? getNodes(rPrs[0], 'rStyle')[0] : null;

        const checkFontVal = (val: string | null) => {
            if (!val) return;
            const lowerVal = val.toLowerCase();
            if (lowerVal.includes('sutonny') || lowerVal.includes('suttony') || lowerVal.includes('bijoy')) {
                isSutonny = true;
            }
            if (IGNORED_FONTS.some(ignored => lowerVal.includes(ignored))) {
                isKnownEnglish = true;
            }
        };

        // Check Font attribute in run properties
        if (rPrs.length > 0) {
            const rfNodes = getNodes(rPrs[0], 'rFonts');
            if (rfNodes.length > 0) {
                const rf = rfNodes[0];
                ['ascii', 'hAnsi', 'cs', 'eastAsia'].forEach(a => checkFontVal(getWAttr(rf, a)));
            }
        }

        // Check Style names if not already detected
        if (!isSutonny && !isKnownEnglish) {
            if (rStyle) checkFontVal(getWAttr(rStyle, 'val'));
            if (pStyle) checkFontVal(getWAttr(pStyle, 'val'));
        }

        // Decision logic:
        // 1. Explicit SutonnyMJ -> Convert.
        // 2. Explicit English -> Skip.
        // 3. Fallback (forceConvert) -> Convert only if it passes heuristic.
        let shouldConvertRecord = isSutonny;
        if (!isSutonny && !isKnownEnglish && forceConvert) {
            shouldConvertRecord = true;
        }

        if (shouldConvertRecord) {
            const ts = getNodes(run, 't');
            for (const t of ts) {
                if (t.textContent) {
                    let proceed = isSutonny;

                    if (!proceed && !isKnownEnglish && forceConvert) {
                        proceed = isLikelyBijoy(t.textContent);
                    }

                    // Special Rule: If Force Convert is on and font is explicitly Sutonny, override heuristic.
                    if (isSutonny && forceConvert) {
                        proceed = true;
                    }

                    if (proceed) {
                        // Change font display name in docx if it was SutonnyMJ
                        if (isSutonny && rPrs.length > 0) {
                            const rfNodes = getNodes(rPrs[0], 'rFonts');
                            if (rfNodes.length > 0) {
                                const rf = rfNodes[0];
                                ['ascii', 'hAnsi', 'cs', 'eastAsia'].forEach(a => {
                                    if (getWAttr(rf, a)) setWAttr(rf, a, 'Bornomala');
                                });
                            }
                        }

                        // Convert text
                        const converted = convertBijoyToUnicode(t.textContent);
                        t.textContent = converted;
                        t.setAttribute('xml:space', 'preserve');
                    }
                }
            }
        }
    }

    return new XMLSerializer().serializeToString(xmlDoc);
}
