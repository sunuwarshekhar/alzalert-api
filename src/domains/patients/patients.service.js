import { ValidationError, NotFoundError } from '../../shared/errors/DomainErrors.js';
import { accessControl } from '../../shared/accessControl.js';
import { usersRepository } from '../users/users.repository.js';
import { patientsRepository } from './patients.repository.js';

const assertValidCaregiver = async (caregiverId) => {
  const user = await usersRepository.findById(caregiverId);
  if (!user || user.role !== 'caregiver') {
    throw new ValidationError('caregiver_id must be a valid caregiver');
  }
  return caregiverId;
};

const resolveCaregiverIdForCreate = async (actor, caregiverId) => {
  if (actor.role === 'caregiver') {
    return actor.id;
  }

  if (!caregiverId) {
    throw new ValidationError('caregiver_id is required');
  }

  return assertValidCaregiver(caregiverId);
};

export const patientsService = {
  async listPatients(actor) {
    accessControl.assertCanManagePatients(actor);
    const filter = accessControl.getPatientFilter(actor);
    return patientsRepository.findAll(filter);
  },

  async getPatient(actor, id) {
    accessControl.assertCanManagePatients(actor);
    await accessControl.assertCanAccessPatient(id, actor);

    const patient = await patientsRepository.findById(id, { withCaregiver: true });
    if (!patient) throw new NotFoundError('Patient not found');
    return patient;
  },

  async createPatient(actor, data) {
    accessControl.assertCanManagePatients(actor);

    const { name, date_of_birth, photo_url, medical_notes, caregiver_id } = data;
    if (!name?.trim()) throw new ValidationError('Name is required');

    const resolvedCaregiverId = await resolveCaregiverIdForCreate(actor, caregiver_id);

    return patientsRepository.create({
      name,
      date_of_birth: date_of_birth || null,
      photo_url: photo_url || null,
      medical_notes: medical_notes || null,
      caregiver_id: resolvedCaregiverId,
    });
  },

  async updatePatient(actor, id, data) {
    accessControl.assertCanManagePatients(actor);
    await accessControl.assertCanAccessPatient(id, actor);

    const existing = await patientsRepository.findById(id);
    if (!existing) throw new NotFoundError('Patient not found');

    const { name, date_of_birth, photo_url, medical_notes, caregiver_id } = data;
    if (name !== undefined && !name?.trim()) {
      throw new ValidationError('Name is required');
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth || null;
    if (photo_url !== undefined) updates.photo_url = photo_url;
    if (medical_notes !== undefined) updates.medical_notes = medical_notes;

    if (actor.role === 'admin' && caregiver_id !== undefined) {
      updates.caregiver_id = await assertValidCaregiver(caregiver_id);
    }

    return patientsRepository.update(id, updates);
  },

  async deletePatient(actor, id) {
    accessControl.assertCanManagePatients(actor);
    await accessControl.assertCanAccessPatient(id, actor);

    const deleted = await patientsRepository.delete(id);
    if (!deleted) throw new NotFoundError('Patient not found');
    return { message: 'Patient deleted' };
  },
};
