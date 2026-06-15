import { ForbiddenError } from './errors/DomainErrors.js';
import { patientsRepository } from '../domains/patients/patients.repository.js';

const canManagePatients = (role) => role === 'admin' || role === 'caregiver';
const canManageAlerts = (role) => role === 'admin' || role === 'caregiver';
const canManageUsers = (role) => role === 'admin';

export const accessControl = {
  assertCanManagePatients(actor) {
    if (!canManagePatients(actor.role)) throw new ForbiddenError('Forbidden');
  },

  assertCanManageAlerts(actor) {
    if (!canManageAlerts(actor.role)) throw new ForbiddenError('Forbidden');
  },

  assertCanManageUsers(actor) {
    if (!canManageUsers(actor.role)) throw new ForbiddenError('Forbidden');
  },

  getPatientFilter(actor) {
    if (actor.role === 'admin') return {};
    if (actor.role === 'caregiver') return { caregiver_id: actor.id };
    return null;
  },

  async assertCanAccessPatient(patientId, actor) {
    if (actor.role === 'admin') return;

    if (actor.role === 'caregiver') {
      const patient = await patientsRepository.findById(patientId);
      if (patient?.caregiver_id === actor.id) return;
    }

    throw new ForbiddenError('Forbidden');
  },

  async assertCanAccessAlert(alert, actor) {
    if (!alert) throw new ForbiddenError('Forbidden');
    if (actor.role === 'admin' || actor.role === 'community') return;

    if (actor.role === 'caregiver') {
      const patient =
        alert.patient || (await patientsRepository.findById(alert.patient_id));
      if (patient?.caregiver_id === actor.id) return;
    }

    throw new ForbiddenError('Forbidden');
  },
};
