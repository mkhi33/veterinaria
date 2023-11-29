const Usuario = require('../models/usuario.model.js');

exports.registro = (req, res) => {
    // Validar consulta
    if (!req.body) {
        res.status(400).send({
            message: "El contenido no puede ser vacio"
        });
    }

    const usuario = new Usuario({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        telefono: req.body.telefono,
        correo: req.body.correo,
        direccion: req.body.direccion,
        genero: req.body.genero,
        estado_civil: req.body.estado_civil,
        password: req.body.password
    });

    Usuario.registroUsuario(usuario, (err, data) => {
        if(err) {
            console.log(err)
            res.status(500).send({
                mensaje: err.mensaje || "Ocurrió un error al guardar el usuario en la base de datos.",
                error: err
            });

        }else  {
            console.log(data);
            if(data.estado == 'no_permitido'){
                res.send({mensaje:'Ya existe un usuario registrado con el correo electrónico', codigo:406, estado: data.estado, data:null});
                return;
              }else{
                res.send({mensaje:'El usuario fue registrado en la base de datos.', codigo:200, estado: data.estado, data:null})
              }
        }
    } );
}

exports.obtenerUsuario = (req, res) => {
    let correoUsuario = req.params.email;
    console.log(req.params)
    if (!correoUsuario) {
        res.status(400).send({
            message: "El contenido no puede ser vacio"
        });
    }
    Usuario.obtener(correoUsuario, (err, data) => {
        if(err) {
            res.status(500).send({
                mensaje: err.mensaje || "Error al obtener el usuario",
                error: err
            });
        }else {
            if(data.estado == 'no_encontrado'){
                res.send({mensaje: 'No se encontro un usuario registrado para este correo', codigo: 406, estado: data.estado})
            }else{
                res.send({mensaje:'Usuario obtenido correctamente', codigo:200, estado: data.estado, data})
            }
        }
    })
}