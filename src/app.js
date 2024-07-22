const express = require('express');
const userRoutes = require('./api/user-routes');

const app = express();
app.use(express.json());

app.use('/api', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;