const express = require('express');
const cors = require('cors');
const path = require('path');
const qrRoutes = require('./routes/qr.routes');
const urlRoutes = require('./routes/url.routes');

const app = express();

// Database connection
const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Routes
// Routes
app.use('/api/qr', qrRoutes);
app.use('/api/url', urlRoutes);
app.use('/', urlRoutes); // 👈 Needed to catch /:shortCode redirect
const emailRoutes = require('./routes/email.routes');
app.use('/api', emailRoutes);
// Catch-all for React frontend (keep this last!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});