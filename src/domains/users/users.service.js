import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../../shared/errors/DomainErrors.js';
import { VALID_ROLES, EMAIL_REGEX } from '../../shared/constants.js';
import { passwordHasher } from '../../shared/auth.js';
import { accessControl } from '../../shared/accessControl.js';
import { usersRepository } from './users.repository.js';

const toPublic = ({ password_hash, ...user }) => user;

export const usersService = {
  async listUsers(actor) {
    accessControl.assertCanManageUsers(actor);
    const users = await usersRepository.findAll();
    return users.map(toPublic);
  },

  async getUser(actor, id) {
    accessControl.assertCanManageUsers(actor);
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return toPublic(user);
  },

  async createUser(actor, data) {
    accessControl.assertCanManageUsers(actor);
    const { name, email, password, phone, role } = data;

    if (!name?.trim() || !email?.trim() || !password || !role) {
      throw new ValidationError('Name, email, password, and role are required');
    }
    if (!EMAIL_REGEX.test(email)) throw new ValidationError('Invalid email format');
    if (!VALID_ROLES.includes(role)) throw new ValidationError('Invalid role');

    const existing = await usersRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already exists');

    const password_hash = await passwordHasher.hash(password);
    const user = await usersRepository.create({ name, email, password_hash, phone, role });
    return toPublic(user);
  },

  async updateUser(actor, id, data) {
    accessControl.assertCanManageUsers(actor);
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    const { name, email, password, phone, role } = data;

    if (email && !EMAIL_REGEX.test(email)) {
      throw new ValidationError('Invalid email format');
    }
    if (role && !VALID_ROLES.includes(role)) {
      throw new ValidationError('Invalid role');
    }
    if (email && email !== user.email) {
      const existing = await usersRepository.findByEmail(email);
      if (existing) throw new ConflictError('Email already exists');
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (role) updates.role = role;
    if (password) updates.password_hash = await passwordHasher.hash(password);

    const updated = await usersRepository.update(id, updates);
    return toPublic(updated);
  },

  async deleteUser(actor, id) {
    accessControl.assertCanManageUsers(actor);
    const deleted = await usersRepository.delete(id);
    if (!deleted) throw new NotFoundError('User not found');
    return { message: 'User deleted' };
  },
};
