import {
  ValidationError,
  UnauthorizedError,
  ConflictError,
} from '../../shared/errors/DomainErrors.js';
import { VALID_ROLES, EMAIL_REGEX } from '../../shared/constants.js';
import { passwordHasher, tokenService } from '../../shared/auth.js';
import { usersRepository } from '../users/users.repository.js';

export const authService = {
  async register({ name, email, password, phone, role }) {
    if (!name?.trim() || !email?.trim() || !password || !role) {
      throw new ValidationError('Name, email, password, and role are required');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new ValidationError('Invalid email format');
    }
    if (!VALID_ROLES.includes(role)) {
      throw new ValidationError('Invalid role');
    }

    const existing = await usersRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already registered');

    const password_hash = await passwordHasher.hash(password);
    const user = await usersRepository.create({ name, email, password_hash, phone, role });
    const token = tokenService.sign(user);

    return { token, user: usersRepository.toAuthDto(user) };
  },

  async login({ email, password }) {
    if (!email?.trim() || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await usersRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const valid = await passwordHasher.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedError('Invalid email or password');

    const token = tokenService.sign(user);
    return { token, user: usersRepository.toAuthDto(user) };
  },
};
