import { ValidationError, NotFoundError } from '../../shared/errors/DomainErrors.js';
import { accessControl } from '../../shared/accessControl.js';
import { sightingsRepository } from './sightings.repository.js';
import { alertsRepository } from '../alerts/alerts.repository.js';

const MAX_SIGHTING_IMAGES = 3;

export const sightingsService = {
  async listSightings(actor, alertId) {
    if (!alertId) {
      throw new ValidationError('alert_id query parameter is required');
    }

    const alert = await alertsRepository.findById(alertId, { withPatient: true });
    if (!alert) throw new NotFoundError('Alert not found');
    await accessControl.assertCanAccessAlert(alert, actor);

    return sightingsRepository.findByAlertId(alertId);
  },

  async createSighting(actor, data) {
    const { alert_id, location_text, notes, image_urls } = data;

    if (!alert_id || !location_text?.trim()) {
      throw new ValidationError('alert_id and location_text are required');
    }

    if (image_urls !== undefined && image_urls !== null) {
      if (!Array.isArray(image_urls)) {
        throw new ValidationError('image_urls must be an array');
      }
      if (image_urls.length > MAX_SIGHTING_IMAGES) {
        throw new ValidationError(`At most ${MAX_SIGHTING_IMAGES} images are allowed`);
      }
      if (image_urls.some((url) => typeof url !== 'string' || !url.trim())) {
        throw new ValidationError('Each image URL must be a non-empty string');
      }
    }

    const alert = await alertsRepository.findById(alert_id, { withPatient: true });
    if (!alert) throw new NotFoundError('Alert not found');
    await accessControl.assertCanAccessAlert(alert, actor);

    if (alert.status !== 'active') {
      throw new ValidationError('Cannot add sighting to a resolved alert');
    }

    return sightingsRepository.create({
      alert_id,
      reported_by: actor.id,
      location_text,
      notes: notes || null,
      image_urls: image_urls?.length ? image_urls : [],
    });
  },

  async deleteSighting(actor, id) {
    accessControl.assertCanManageAlerts(actor);

    const sighting = await sightingsRepository.findById(id, { withAlert: true });
    if (!sighting) throw new NotFoundError('Sighting not found');
    await accessControl.assertCanAccessAlert(sighting.alert, actor);

    await sightingsRepository.delete(id);
    return { message: 'Sighting deleted' };
  },
};
