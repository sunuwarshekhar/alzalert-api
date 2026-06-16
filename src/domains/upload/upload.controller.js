import { uploadService } from './upload.service.js';

export const uploadController = {
  presign: async (req, res) => {
    const result = await uploadService.createPresignedUrl(req.user, {
      filename: req.query.filename,
      type: req.query.type,
    });
    res.json(result);
  },

  uploadFile: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ ok: true });
  },
};
