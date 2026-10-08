const db = require('../database/db');

// Create the pets table if it doesn't exist
const createPetTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS pets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      species     TEXT    NOT NULL,
      breed       TEXT,
      age         INTEGER,
      owner_id    INTEGER,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating pets table:', err.message);
    } else {
      console.log('Pets table ready.');
    }
  });
};

const Pet = {
  // Create a new pet
  create(data, callback) {
    const sql = `
      INSERT INTO pets (name, species, breed, age, owner_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [data.name, data.species, data.breed ?? null, data.age ?? null, data.owner_id ?? null];
    db.run(sql, params, function (err) {
      callback(err, { id: this?.lastID, ...data });
    });
  },

  // Get all pets
  getAll(callback) {
    const sql = `SELECT * FROM pets ORDER BY created_at DESC`;
    db.all(sql, [], callback);
  },

  // Search/filter pets by name, species, or breed
  search({ name, species, breed }, callback) {
    const conditions = [];
    const params = [];

    if (name)    { conditions.push(`name LIKE ?`);    params.push(`%${name}%`);    }
    if (species) { conditions.push(`species LIKE ?`); params.push(`%${species}%`); }
    if (breed)   { conditions.push(`breed LIKE ?`);   params.push(`%${breed}%`);   }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM pets ${where} ORDER BY created_at DESC`;

    db.all(sql, params, callback);
  },

  // Get a single pet by ID
  getById(id, callback) {
    const sql = `SELECT * FROM pets WHERE id = ?`;
    db.get(sql, [id], callback);
  },

  // Update a pet by ID
  update(id, data, callback) {
    const sql = `
      UPDATE pets
      SET name = ?, species = ?, breed = ?, age = ?, owner_id = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.name, data.species, data.breed ?? null, data.age ?? null, data.owner_id ?? null, id];
    db.run(sql, params, function (err) {
      callback(err, { changes: this?.changes });
    });
  },

  // Delete a pet by ID
  delete(id, callback) {
    const sql = `DELETE FROM pets WHERE id = ?`;
    db.run(sql, [id], function (err) {
      callback(err, { changes: this?.changes });
    });
  },
};

module.exports = { Pet, createPetTable };

