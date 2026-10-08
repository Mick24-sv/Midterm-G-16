const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;

<<<<<<< HEAD
const { createAdopterTable } = require('./models/Adopter');
const adopterRoutes          = require('./routes/adopterRoutes');
=======
const { createPetTable }      = require('./models/Pet');
const { createAdopterTable }  = require('./models/Adopter');
const { createAdoptionTable } = require('./models/Adoption');
const petRoutes               = require('./routes/petRoutes');
const adopterRoutes           = require('./routes/adopterRoutes');
const adoptionRoutes          = require('./routes/adoptionRoutes');
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize tables
<<<<<<< HEAD
createAdopterTable();

// Routes
app.use('/api/adopters', adopterRoutes);
=======
createPetTable();
createAdopterTable();
createAdoptionTable();

// Routes
app.use('/api/pets',      petRoutes);
app.use('/api/adopters',  adopterRoutes);
app.use('/api/adoptions', adoptionRoutes);
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pet Adoption API is running.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
<<<<<<< HEAD

=======
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944
