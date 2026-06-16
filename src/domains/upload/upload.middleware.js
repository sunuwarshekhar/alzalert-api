import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { getUploadDir } from '../../shared/storage/index.js';

const UPLOAD_KEY_PATTERN = /^patients\/[0-9a-f-]{36}\.[a-zA-Z0-9]+$/;

export function validateUploadKey(req, res, next) {
  const key = req.query.key;
  if (!key || key.includes('..') || !UPLOAD_KEY_PATTERN.test(key)) {
    return res.status(400).json({ message: 'Invalid upload key' });
  }
  req.uploadKey = key;
  next();
}

const diskStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(getUploadDir(), path.dirname(req.uploadKey));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, _file, cb) => {
    cb(null, path.basename(req.uploadKey));
  },
});

export const uploadFileMiddleware = multer({
  storage: diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
}).single('file');
