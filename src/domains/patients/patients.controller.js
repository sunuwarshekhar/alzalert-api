import { patientsService } from './patients.service.js';

export const patientsController = {
  list: async (req, res) => {
    res.json(await patientsService.listPatients(req.user));
  },

  getById: async (req, res) => {
    res.json(await patientsService.getPatient(req.user, req.params.id));
  },

  create: async (req, res) => {
    const patient = await patientsService.createPatient(req.user, req.body);
    res.status(201).json(patient);
  },

  update: async (req, res) => {
    const patient = await patientsService.updatePatient(req.user, req.params.id, req.body);
    res.json(patient);
  },

  remove: async (req, res) => {
    res.json(await patientsService.deletePatient(req.user, req.params.id));
  },
};
