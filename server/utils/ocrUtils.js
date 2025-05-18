const Tesseract = require('tesseract.js');

/**
 * Extract text from an image file using Tesseract.js
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<string>} - Extracted text from the image
 */
exports.extractTextFromImage = async (imagePath) => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'eng',
            { logger: m => console.log(m) }
        );
        return text;
    } catch (error) {
        console.error('Error in OCR processing:', error);
        throw new Error('Failed to extract text from image');
    }
};