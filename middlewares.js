
function reportQuery(req, res, next) {
    console.log(`[${new Date().toISOString()}] Consulta recibida: ${req.method} ${req.path}`);
    next();
  }
  
  module.exports = { reportQuery }; 