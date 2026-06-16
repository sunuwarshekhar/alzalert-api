import fs from 'fs';
import path from 'path';

export const fileUploadDriver = (process.env.FILE_UPLOAD || 's3').toLowerCase();

export function getUploadDir() {
  return path.resolve(process.env.UPLOAD_DIR || './uploads');
}

export function getPublicBaseUrl() {
  return process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
}

export function ensureUploadDir() {
  if (fileUploadDriver !== 'fs') return;
  const dir = getUploadDir();
  fs.mkdirSync(dir, { recursive: true });
}

export function validateStorageConfig() {
  if (fileUploadDriver === 'fs') {
    ensureUploadDir();
    return;
  }

  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_BUCKET_NAME'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`FILE_UPLOAD=s3 requires: ${missing.join(', ')}`);
  }
}
