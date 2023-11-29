const Login = require("../models/login.models");
var jwt = require('jsonwebtoken');
// nuevo login
exports.iniciarSesion = (req, res) => {


  // Validar consulta
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
  }

  // Crear ojeto Login

  const login = new Login({
    correo: req.body.correo,
    password: req.body.password
  });

  // Autenticar

  Login.login(login, (err, data) => {
    if (err)
      res.status(500).send({
        mensaje: err.mensaje || "Error en el inicio de sesión",
        error:err
      });
    else{
      if(data.estado == 'no_encontrado'){
        res.send({mensaje:'Error, correo o contraseña no son validos', codigo:404, estado: data.estado, data:null});
        return;
      }else{
        // Crear el token

        const token = jwt.sign({
            correo: login.correo
        },process.env.SECRETO, { expiresIn: '14400s' })
        res.send({mensaje:'El usuario se autenticó correctamente', codigo:200, estado: data.estado, data:{token:token, correo:login.correo}})
      }
    }
    
  });
};
