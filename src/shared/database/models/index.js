import UserModel from './UserModel.js';
import PatientModel from './PatientModel.js';
import AlertModel from './AlertModel.js';
import SightingModel from './SightingModel.js';

UserModel.hasMany(PatientModel, { foreignKey: 'caregiver_id', as: 'patients' });
PatientModel.belongsTo(UserModel, { foreignKey: 'caregiver_id', as: 'caregiver' });

UserModel.hasMany(AlertModel, { foreignKey: 'created_by', as: 'alertsCreated' });
AlertModel.belongsTo(UserModel, { foreignKey: 'created_by', as: 'creator' });

PatientModel.hasMany(AlertModel, { foreignKey: 'patient_id', as: 'alerts' });
AlertModel.belongsTo(PatientModel, { foreignKey: 'patient_id', as: 'patient' });

UserModel.hasMany(SightingModel, { foreignKey: 'reported_by', as: 'sightings' });
SightingModel.belongsTo(UserModel, { foreignKey: 'reported_by', as: 'reporter' });

AlertModel.hasMany(SightingModel, { foreignKey: 'alert_id', as: 'sightings' });
SightingModel.belongsTo(AlertModel, { foreignKey: 'alert_id', as: 'alert' });

export { UserModel, PatientModel, AlertModel, SightingModel };
