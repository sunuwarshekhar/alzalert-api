import { ValidationError, NotFoundError } from '../../shared/errors/DomainErrors.js';
import { accessControl } from '../../shared/accessControl.js';
import { sightingsRepository } from './sightings.repository.js';
import { alertsRepository } from '../alerts/alerts.repository.js';

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
    const { alert_id, location_text, notes } = data;

    if (!alert_id || !location_text?.trim()) {
      throw new ValidationError('alert_id and location_text are required');
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
