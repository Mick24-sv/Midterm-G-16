const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;

const { createPetTable }      = require('./models/Pet');
const { createAdopterTable }  = require('./models/Adopter');
const { createAdoptionTable } = require('./models/Adoption');
const petRoutes               = require('./routes/petRoutes');
const adopterRoutes           = require('./routes/adopterRoutes');
const adoptionRoutes          = require('./routes/adoptionRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize tables
createPetTable();
createAdopterTable();
createAdoptionTable();

// Routes
app.use('/api/pets',      petRoutes);
app.use('/api/adopters',  adopterRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pet Adoption API is running.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
