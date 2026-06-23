import { ValidationError, NotFoundError } from '../../shared/errors/DomainErrors.js';
import { VALID_ALERT_STATUSES } from '../../shared/constants.js';
import { accessControl } from '../../shared/accessControl.js';
import { alertsRepository } from './alerts.repository.js';

export const alertsService = {
  async listAlerts(actor) {
    const filter = actor.role === 'caregiver' ? { caregiver_id: actor.id } : {};
    return alertsRepository.findAll(filter);
  },

  async getAlert(actor, id) {
    const alert = await alertsRepository.findById(id);
    if (!alert) throw new NotFoundError('Alert not found');
    await accessControl.assertCanAccessAlert(alert, actor);
    return alert;
  },

  async createAlert(actor, data) {
    accessControl.assertCanManageAlerts(actor);

    const { patient_id, description, status } = data;
    if (!patient_id) throw new ValidationError('patient_id is required');

    await accessControl.assertCanAccessPatient(patient_id, actor);

    return alertsRepository.create({
      patient_id,
      created_by: actor.id,
      description: description || null,
      status: status || 'active',
    });
  },

  async updateAlert(actor, id, data) {
    accessControl.assertCanManageAlerts(actor);

    const alert = await alertsRepository.findById(id, { withPatient: true });
    if (!alert) throw new NotFoundError('Alert not found');
    await accessControl.assertCanAccessAlert(alert, actor);

    const updates = {};
    const { status, description } = data;

    if (description !== undefined) {
      updates.description = description;
    }

    if (status !== undefined) {
      if (!VALID_ALERT_STATUSES.includes(status)) {
        throw new ValidationError('Invalid status');
      }
      updates.status = status;
      updates.resolved_at = status === 'resolved' ? new Date() : null;
    }

    return alertsRepository.update(id, updates);
  },

  async deleteAlert(actor, id) {
    accessControl.assertCanManageAlerts(actor);

    const alert = await alertsRepository.findById(id, { withPatient: true });
    if (!alert) throw new NotFoundError('Alert not found');
    await accessControl.assertCanAccessAlert(alert, actor);

    await alertsRepository.delete(id);
    return { message: 'Alert deleted' };
  },
};
