const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;