import { uploadService } from './upload.service.js';

export const uploadController = {
  presign: async (req, res) => {
    const result = await uploadService.createPresignedUrl(req.user, {
      filename: req.query.filename,
      type: req.query.type,
    });
    res.json(result);
  },
};
