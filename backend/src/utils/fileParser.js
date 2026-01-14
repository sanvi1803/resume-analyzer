/**
 * Parse PDF files
 */
export const parsePDF = async (filePath) => {
    try {
        const pdfParse = await import('pdf-parse/lib/pdf-parse.js').then(m => m.default);
        const fs = await import('fs').then(m => m.promises);

        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);

        return {
            text: data.text,
            pages: data.numpages,
            metadata: data.metadata
        };
    } catch (error) {
        throw new Error(`PDF parsing failed: ${error.message}`);
    }
};

/**
 * Parse DOCX files
 */
export const parseDOCX = async (filePath) => {
    try {
        const { Document, Packer } = await import('docx');
        const fs = await import('fs').then(m => m.promises);

        const buffer = await fs.readFile(filePath);
        // Simple text extraction from DOCX
        const text = buffer.toString('utf-8');

        return {
            text: text,
            fileName: filePath
        };
    } catch (error) {
        throw new Error(`DOCX parsing failed: ${error.message}`);
    }
};

/**
 * Generic file parser
 */
export const parseFile = async (filePath, mimeType) => {
    if (mimeType.includes('pdf')) {
        return parsePDF(filePath);
    } else if (mimeType.includes('word') || filePath.endsWith('.docx')) {
        return parseDOCX(filePath);
    } else if (mimeType.includes('text') || filePath.endsWith('.txt')) {
        const fs = await import('fs').then(m => m.promises);
        const text = await fs.readFile(filePath, 'utf-8');
        return { text };
    }

    throw new Error('Unsupported file type');
};

/**
 * Clean and normalize resume text
 */
export const normalizeResumeText = (text) => {
    return text
        .replace(/\s+/g, ' ') // Multiple spaces to single
        .replace(/[\n\r]+/g, '\n') // Normalize line breaks
        .trim();
};
