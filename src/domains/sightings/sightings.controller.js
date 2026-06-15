import { sightingsService } from './sightings.service.js';

export const sightingsController = {
  list: async (req, res) => {
    res.json(await sightingsService.listSightings(req.user, req.query.alert_id));
  },

  create: async (req, res) => {
    const sighting = await sightingsService.createSighting(req.user, req.body);
    res.status(201).json(sighting);
  },

  remove: async (req, res) => {
    res.json(await sightingsService.deleteSighting(req.user, req.params.id));
  },
};
