import express from 'express';
import multer from 'multer';
import { performAudit, getAuditHistory, getAuditById, deleteAudit, togglePinAudit } from '../controllers/auditController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Configure multer memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

// Define endpoints with JWT authentication middleware
router.post('/upload', authMiddleware, upload.single('screenshot'), performAudit);
router.get('/history', authMiddleware, getAuditHistory);
router.get('/:id', authMiddleware, getAuditById);
router.delete('/:id', authMiddleware, deleteAudit);
router.patch('/:id/pin', authMiddleware, togglePinAudit);

export default router;
