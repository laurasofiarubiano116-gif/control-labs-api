const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/auth', authRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});


app.use(errorHandler);

module.exports = app;