import {
  DomainError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../errors/DomainErrors.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
  if (err instanceof UnauthorizedError) return res.status(401).json({ error: err.message });
  if (err instanceof ForbiddenError) return res.status(403).json({ error: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof ConflictError) return res.status(400).json({ error: err.message });
  if (err instanceof DomainError) return res.status(400).json({ error: err.message });

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
