import { v4 as uuidv4 } from 'uuid';
import { getPublicBaseUrl } from './config.js';

export const fsStorage = {
  async createPresignedUpload({ filename }) {
    const ext = filename.split('.').pop();
    const key = `patients/${uuidv4()}.${ext}`;
    const fileUrl = `${getPublicBaseUrl()}/uploads/${key}`;
    const uploadUrl = `/api/upload/file?key=${encodeURIComponent(key)}`;

    return { uploadUrl, fileUrl, method: 'POST', key };
  },
};
