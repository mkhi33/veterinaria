module.exports = app => {
    const usuarioController = require("../controllers/usuario.controller.js");

    // Nuevo login
    
    app.get("/api/usuario/:email", usuarioController.obtenerUsuario)
    app.post("/api/registro", usuarioController.registro);


  

  };