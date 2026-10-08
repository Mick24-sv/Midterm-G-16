const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;

const { createAdopterTable } = require('./models/Adopter');
const adopterRoutes          = require('./routes/adopterRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize tables
createAdopterTable();

// Routes
app.use('/api/adopters', adopterRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pet Adoption API is running.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

