import {
  UserModel,
  PatientModel,
  AlertModel,
  SightingModel,
} from '../../shared/database/models/index.js';

const reporterInclude = {
  model: UserModel,
  as: 'reporter',
  attributes: ['id', 'name'],
};

const alertInclude = {
  model: AlertModel,
  as: 'alert',
  include: [{ model: PatientModel, as: 'patient' }],
};

const mapAlert = (row) =>
  row
    ? {
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
      }
    : null;

const toDto = (row) => ({
  id: row.id,
  alert_id: row.alert_id,
  reported_by: row.reported_by,
  location_text: row.location_text,
  notes: row.notes,
  created_at: row.created_at,
  reporter: row.reporter
    ? { id: row.reporter.id, name: row.reporter.name }
    : null,
  alert: row.alert ? mapAlert(row.alert) : null,
});

export const sightingsRepository = {
  async findByAlertId(alertId) {
    const rows = await SightingModel.findAll({
      where: { alert_id: alertId },
      include: [reporterInclude],
      order: [['created_at', 'DESC']],
    });
    return rows.map(toDto);
  },

  async findById(id, { withAlert = false } = {}) {
    const row = await SightingModel.findByPk(id, {
      include: withAlert ? [alertInclude] : [],
    });
    return row ? toDto(row) : null;
  },

  async create(data) {
    const row = await SightingModel.create(data);
    await row.reload({ include: [reporterInclude] });
    return toDto(row);
  },

  async delete(id) {
    const row = await SightingModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  },
};
