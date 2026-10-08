const express = require('express');
const { createPetTable } = require('./models/Pet');
const { createAdopterTable } = require('./models/Adopter');
const petRoutes = require('./routes/petRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize tables
createPetTable();
createAdopterTable();

// Routes
app.use('/api/pets', petRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

