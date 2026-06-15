import { usersService } from './users.service.js';

export const usersController = {
  list: async (req, res) => {
    res.json(await usersService.listUsers(req.user));
  },

  getById: async (req, res) => {
    res.json(await usersService.getUser(req.user, req.params.id));
  },

  create: async (req, res) => {
    const user = await usersService.createUser(req.user, req.body);
    res.status(201).json(user);
  },

  update: async (req, res) => {
    const user = await usersService.updateUser(req.user, req.params.id, req.body);
    res.json(user);
  },

  remove: async (req, res) => {
    res.json(await usersService.deleteUser(req.user, req.params.id));
  },
};
