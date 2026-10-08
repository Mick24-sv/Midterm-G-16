const db = require('../database/db');

// Create the adoptions table if it doesn't exist
const createAdoptionTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS adoptions (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id         INTEGER NOT NULL,
      adopter_id     INTEGER NOT NULL,
      adoption_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
      status         TEXT    DEFAULT 'pending',
      notes          TEXT,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adopter_id) REFERENCES adopters (id),
      FOREIGN KEY (pet_id) REFERENCES pets (id)
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating adoptions table:', err.message);
    } else {
      console.log('Adoptions table ready.');
    }
  });
};

const Adoption = {
  // Create a new adoption record
  create(data, callback) {
    const sql = `
      INSERT INTO adoptions (pet_id, adopter_id, adoption_date, status, notes)
      VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, 'pending'), ?)
    `;
    const params = [
      data.pet_id,
      data.adopter_id,
      data.adoption_date || null,
      data.status || 'pending',
      data.notes || null,
    ];
    db.run(sql, params, function (err) {
      callback(err, { id: this?.lastID, ...data });
    });
  },

  // Get all adoptions
  getAll(callback) {
    const sql = `SELECT * FROM adoptions ORDER BY created_at DESC`;
    db.all(sql, [], callback);
  },

  // Get a single adoption by ID
  getById(id, callback) {
    const sql = `SELECT * FROM adoptions WHERE id = ?`;
    db.get(sql, [id], callback);
  },

  // Get adoptions by adopter ID
  getByAdopterId(adopterId, callback) {
    const sql = `SELECT * FROM adoptions WHERE adopter_id = ? ORDER BY created_at DESC`;
    db.all(sql, [adopterId], callback);
  },

  // Get adoptions by pet ID
  getByPetId(petId, callback) {
    const sql = `SELECT * FROM adoptions WHERE pet_id = ? ORDER BY created_at DESC`;
    db.all(sql, [petId], callback);
  },

  // Get adoptions by status
  getByStatus(status, callback) {
    const sql = `SELECT * FROM adoptions WHERE status = ? ORDER BY created_at DESC`;
    db.all(sql, [status], callback);
  },

  // Filter adoptions by query parameters (status, adopter_id, pet_id)
  filter(filters, callback) {
    let sql = `SELECT * FROM adoptions WHERE 1=1`;
    const params = [];

    if (filters.status) {
      sql += ` AND status = ?`;
      params.push(filters.status);
    }
    if (filters.adopter_id) {
      sql += ` AND adopter_id = ?`;
      params.push(filters.adopter_id);
    }
    if (filters.pet_id) {
      sql += ` AND pet_id = ?`;
      params.push(filters.pet_id);
    }

    sql += ` ORDER BY created_at DESC`;
    db.all(sql, params, callback);
  },

  // Update an adoption by ID
  update(id, data, callback) {
    const sql = `
      UPDATE adoptions
      SET pet_id = COALESCE(?, pet_id),
          adopter_id = COALESCE(?, adopter_id),
          adoption_date = COALESCE(?, adoption_date),
          status = COALESCE(?, status),
          notes = COALESCE(?, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      data.pet_id !== undefined ? data.pet_id : null,
      data.adopter_id !== undefined ? data.adopter_id : null,
      data.adoption_date !== undefined ? data.adoption_date : null,
      data.status !== undefined ? data.status : null,
      data.notes !== undefined ? data.notes : null,
      id,
    ];
    db.run(sql, params, function (err) {
      callback(err, { changes: this?.changes });
    });
  },

  // Delete an adoption by ID
  delete(id, callback) {
    const sql = `DELETE FROM adoptions WHERE id = ?`;
    db.run(sql, [id], function (err) {
      callback(err, { changes: this?.changes });
    });
  },
};

module.exports = { Adoption, createAdoptionTable };

