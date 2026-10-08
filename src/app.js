const express = require('express');
const cors = require('cors');

const loanRoutes = require('./routes/loanRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/loans', loanRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;