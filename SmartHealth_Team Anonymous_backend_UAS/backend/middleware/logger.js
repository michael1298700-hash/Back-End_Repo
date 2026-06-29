/**
 * Logger middleware ringan — mencatat method, URL, status, dan durasi.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const user = req.user ? `[${req.user.tipe}:${req.user.id}]` : '[guest]';
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms ${user}`);
  });
  next();
}
