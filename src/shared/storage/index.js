import { fileUploadDriver } from './config.js';
import { s3Storage } from './s3Storage.js';
import { fsStorage } from './fsStorage.js';

export { fileUploadDriver, getUploadDir, ensureUploadDir, validateStorageConfig } from './config.js';

export const storageService = fileUploadDriver === 'fs' ? fsStorage : s3Storage;
