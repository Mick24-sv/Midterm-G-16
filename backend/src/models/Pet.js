const db = require('../config/db');

// Create the pets table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS pets (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    species   TEXT    NOT NULL,
    breed     TEXT,
    age       INTEGER,
    owner_id  INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const Pet = {
  // Get all pets
  findAll() {
    return db.prepare('SELECT * FROM pets').all();
  },

  // Get a single pet by ID
  findById(id) {
    return db.prepare('SELECT * FROM pets WHERE id = ?').get(id);
  },

  // Create a new pet
  create({ name, species, breed, age, owner_id }) {
    const stmt = db.prepare(
      'INSERT INTO pets (name, species, breed, age, owner_id) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, species, breed ?? null, age ?? null, owner_id ?? null);
    return { id: result.lastInsertRowid, name, species, breed, age, owner_id };
  },

  // Update a pet by ID
  update(id, { name, species, breed, age, owner_id }) {
    const stmt = db.prepare(
      'UPDATE pets SET name = ?, species = ?, breed = ?, age = ?, owner_id = ? WHERE id = ?'
    );
    stmt.run(name, species, breed ?? null, age ?? null, owner_id ?? null, id);
    return this.findById(id);
  },

  // Delete a pet by ID
  delete(id) {
    return db.prepare('DELETE FROM pets WHERE id = ?').run(id);
  },
};

module.exports = Pet;

