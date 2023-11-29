module.exports = app => {
    const login = require("../controllers/login.controller.js");

    // Nuevo login
    
    app.post("/api/login", login.iniciarSesion);

  };