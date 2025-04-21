
function reportQuery(req, res, next) {
    console.log(`[${new Date().toISOString()}] Consulta recibida: ${req.method} ${req.path}`);
    next();
  }
  
  module.exports = { reportQuery }; 

  function reportQuery(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
      console.log({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - start,
        userAgent: req.headers['user-agent']
      });
    });
    next();
  }