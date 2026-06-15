import { UserModel, PatientModel, AlertModel } from '../../shared/database/models/index.js';

const patientInclude = (attrs = ['id', 'name', 'photo_url', 'caregiver_id'], where = {}) => ({
  model: PatientModel,
  as: 'patient',
  attributes: attrs,
  ...(Object.keys(where).length ? { where, required: true } : {}),
});

const creatorInclude = {
  model: UserModel,
  as: 'creator',
  attributes: ['id', 'name'],
};

const toDto = (row) => ({
  id: row.id,
  patient_id: row.patient_id,
  created_by: row.created_by,
  status: row.status,
  last_seen_location: row.last_seen_location,
  created_at: row.created_at,
  resolved_at: row.resolved_at,
  patient: row.patient
    ? {
        id: row.patient.id,
        name: row.patient.name,
        photo_url: row.patient.photo_url,
        caregiver_id: row.patient.caregiver_id,
      }
    : null,
  creator: row.creator
    ? { id: row.creator.id, name: row.creator.name }
    : null,
});

export const alertsRepository = {
  async findAll({ caregiver_id = null } = {}) {
    const include = [creatorInclude];
    if (caregiver_id) {
      include.unshift(
        patientInclude(['id', 'name', 'photo_url', 'caregiver_id'], { caregiver_id })
      );
    } else {
      include.unshift(patientInclude());
    }

    const rows = await AlertModel.findAll({ include, order: [['created_at', 'DESC']] });
    return rows.map(toDto);
  },

  async findById(id, { withPatient = true, withCreator = true } = {}) {
    const include = [];
    if (withPatient) include.push(patientInclude());
    if (withCreator) include.push(creatorInclude);

    const row = await AlertModel.findByPk(id, { include });
    return row ? toDto(row) : null;
  },

  async create(data) {
    const row = await AlertModel.create(data);
    await row.reload({
      include: [patientInclude(['id', 'name', 'photo_url']), creatorInclude],
    });
    return toDto(row);
  },

  async update(id, data) {
    const row = await AlertModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    await row.reload({
      include: [patientInclude(['id', 'name', 'photo_url']), creatorInclude],
    });
    return toDto(row);
  },

  async delete(id) {
    const row = await AlertModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  },
};
