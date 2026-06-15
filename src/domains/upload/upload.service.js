import { ValidationError } from '../../shared/errors/DomainErrors.js';
import { accessControl } from '../../shared/accessControl.js';
import { storageService } from '../../shared/storage.js';

export const uploadService = {
  async createPresignedUrl(actor, { filename, type }) {
    accessControl.assertCanManagePatients(actor);

    if (!filename || !type) {
      throw new ValidationError('filename and type are required');
    }

    return storageService.createPresignedUpload({ filename, contentType: type });
  },
};
