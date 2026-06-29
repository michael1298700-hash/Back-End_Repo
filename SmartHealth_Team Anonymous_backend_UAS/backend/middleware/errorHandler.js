/**
 * Global error handler — tangkap semua error yang di-next(err).
 */
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.stack || err.message);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * Handler untuk route yang tidak ditemukan (404).
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
}
