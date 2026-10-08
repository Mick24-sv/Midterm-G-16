const db = require('../database/db');

// Create the adopters table if it doesn't exist
const createAdopterTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS adopters (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name  TEXT    NOT NULL,
      last_name   TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      phone       TEXT    NOT NULL,
      address     TEXT    NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating adopters table:', err.message);
    } else {
      console.log('Adopters table ready.');
    }
  });
};

const Adopter = {
  // Create a new adopter
  create(data, callback) {
    const sql = `
      INSERT INTO adopters (first_name, last_name, email, phone, address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [data.first_name, data.last_name, data.email, data.phone, data.address];
    db.run(sql, params, function (err) {
      callback(err, { id: this?.lastID, ...data });
    });
  },

  // Get all adopters
  getAll(callback) {
    const sql = `SELECT * FROM adopters ORDER BY created_at DESC`;
    db.all(sql, [], callback);
  },

  // Get a single adopter by ID
  getById(id, callback) {
    const sql = `SELECT * FROM adopters WHERE id = ?`;
    db.get(sql, [id], callback);
  },

  // Update an adopter by ID
  update(id, data, callback) {
    const sql = `
      UPDATE adopters
      SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.first_name, data.last_name, data.email, data.phone, data.address, id];
    db.run(sql, params, function (err) {
      callback(err, { changes: this?.changes });
    });
  },

  // Delete an adopter by ID
  delete(id, callback) {
    const sql = `DELETE FROM adopters WHERE id = ?`;
    db.run(sql, [id], function (err) {
      callback(err, { changes: this?.changes });
    });
  },
};

module.exports = { Adopter, createAdopterTable };

