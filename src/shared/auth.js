import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const passwordHasher = {
  hash: (password) => bcrypt.hash(password, 10),
  compare: (password, hash) => bcrypt.compare(password, hash),
};

export const tokenService = {
  sign: (user) =>
    jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    ),
  verify: (token) => jwt.verify(token, process.env.JWT_SECRET),
};
