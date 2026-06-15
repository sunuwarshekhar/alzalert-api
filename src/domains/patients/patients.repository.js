import { UserModel, PatientModel } from '../../shared/database/models/index.js';

const caregiverInclude = {
  model: UserModel,
  as: 'caregiver',
  attributes: ['id', 'name'],
};

const toDto = (row) => ({
  id: row.id,
  name: row.name,
  date_of_birth: row.date_of_birth,
  photo_url: row.photo_url,
  medical_notes: row.medical_notes,
  caregiver_id: row.caregiver_id,
  caregiver: row.caregiver
    ? { id: row.caregiver.id, name: row.caregiver.name }
    : null,
  created_at: row.created_at,
});

export const patientsRepository = {
  async findAll(filter = {}) {
    const where = {};
    if (filter.caregiver_id) where.caregiver_id = filter.caregiver_id;

    const rows = await PatientModel.findAll({
      where,
      include: [caregiverInclude],
      order: [['created_at', 'DESC']],
    });
    return rows.map(toDto);
  },

  async findById(id, { withCaregiver = false } = {}) {
    const row = await PatientModel.findByPk(id, {
      include: withCaregiver ? [caregiverInclude] : [],
    });
    return row ? toDto(row) : null;
  },

  async create(data) {
    const row = await PatientModel.create(data);
    await row.reload({ include: [caregiverInclude] });
    return toDto(row);
  },

  async update(id, data) {
    const row = await PatientModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    await row.reload({ include: [caregiverInclude] });
    return toDto(row);
  },

  async delete(id) {
    const row = await PatientModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  },
};
