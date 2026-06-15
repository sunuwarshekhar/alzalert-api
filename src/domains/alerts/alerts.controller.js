import { alertsService } from './alerts.service.js';

export const alertsController = {
  list: async (req, res) => {
    res.json(await alertsService.listAlerts(req.user));
  },

  getById: async (req, res) => {
    res.json(await alertsService.getAlert(req.user, req.params.id));
  },

  create: async (req, res) => {
    const alert = await alertsService.createAlert(req.user, req.body);
    res.status(201).json(alert);
  },

  update: async (req, res) => {
    const alert = await alertsService.updateAlert(req.user, req.params.id, req.body);
    res.json(alert);
  },

  remove: async (req, res) => {
    res.json(await alertsService.deleteAlert(req.user, req.params.id));
  },
};
