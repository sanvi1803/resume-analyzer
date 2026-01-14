import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import resumeController from '../controllers/resumeController.js';
import { verifyClerkToken, requireAuth } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, '../../uploads');

// Ensure uploads directory exists
try {
    mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
    console.error('Failed to create uploads directory:', err);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'));
        }
    }
});
const router = express.Router();
// Routes with authentication
router.post('/analyze', verifyClerkToken, requireAuth, upload.single('resume'), resumeController.analyzeResume);
router.post('/analyze-with-jd', verifyClerkToken, requireAuth, upload.single('resume'), resumeController.analyzeWithJobDescription);
router.get('/history', verifyClerkToken, requireAuth, resumeController.getAnalysisHistory);
router.get('/history/:analysisId', verifyClerkToken, requireAuth, resumeController.getAnalysis);
router.delete('/history/:analysisId', verifyClerkToken, requireAuth, resumeController.deleteAnalysis);
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default router;