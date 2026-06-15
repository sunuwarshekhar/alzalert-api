import { UserModel } from '../../shared/database/models/index.js';

const toDto = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  role: row.role,
  password_hash: row.password_hash,
  created_at: row.created_at,
});

const toAuthDto = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

export const usersRepository = {
  async findAll() {
    const rows = await UserModel.findAll({ order: [['created_at', 'DESC']] });
    return rows.map(toDto);
  },

  async findById(id) {
    const row = await UserModel.findByPk(id);
    return row ? toDto(row) : null;
  },

  async findByEmail(email) {
    const row = await UserModel.findOne({ where: { email } });
    return row ? toDto(row) : null;
  },

  async create({ name, email, password_hash, phone, role }) {
    const row = await UserModel.create({ name, email, password_hash, phone, role });
    return toDto(row);
  },

  async update(id, data) {
    const row = await UserModel.findByPk(id);
    if (!row) return null;
    await row.update(data);
    return toDto(row);
  },

  async delete(id) {
    const row = await UserModel.findByPk(id);
    if (!row) return false;
    await row.destroy();
    return true;
  },

  toAuthDto,
};
