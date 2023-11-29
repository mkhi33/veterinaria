const express = require('express');
const dotenv = require("dotenv")
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();


app.use(cors());
app.use(bodyParser.json());

const credentials = {
    host: 'localhost',
    user: 'sa',
    password: '@Demon2017',
    database: 'db_veterinaria',
    port: 1433
};

// Crear la conexión a la base de datos
const db = mysql.createConnection(credentials);

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

module.exports = db;


//Login

app.post('/api/registro', (req, res) => {
    const { 
        nombre, 
        apellido, 
        fecha_nacimiento, 
        telefono, 
        correo, 
        direccion,
        genero,
        estado_civil,
        password 
    } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud POST

    // Insertar un nuevo user en la base de datos
    const insertQuery = `
    EXEC dbo.RegistroUsuarios 
        @nombre = ?,
        @apellido = ?,
        @fecha_nacimiento = ?,
        @telefono = ?,
        @correo = ?',
        @direccion = ?',
        @genero = ?,
        @estado_civil = ?,
        @password = ?;
    `;
    console.log(req.body);
    db.query(insertQuery, [nombre, apellido, fecha_nacimiento, telefono, correo, direccion, genero, estado_civil, password], (err,) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        }
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Consulta la base de datos para obtener la lista de departamentos
    const query = 'SELECT * FROM login WHERE `email` = ? AND `password` = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.json("Error");
        }
        if (results.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failed")
        }
    });
});




//Departamento
app.get('/api/departamentos', (req, res) => {
    // Consulta la base de datos para obtener la lista de departamentos
    const query = 'SELECT * FROM Departamento';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            // Devuelve la lista de departamentos como respuesta
            res.status(200).json({ departamentos: results });
        }
    });
});

app.delete('/api/departamentos/:departamentoId', (req, res) => {
    const departamentoId = req.params.departamentoId;

    // Realiza una consulta para eliminar el departamento con el ID proporcionado
    const deleteQuery = 'DELETE FROM Departamento WHERE ID = ?';
    db.query(deleteQuery, [departamentoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            // Verifica si se eliminó algún registro (results.affectedRows)
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Departamento eliminado correctamente' });
            } else {
                res.status(404).json({ message: 'Departamento no encontrado' });
            }
        }
    });
});

app.put('/api/departamentos/:departamentoId', (req, res) => {
    const departamentoId = req.params.departamentoId;
    const { nombre } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud PUT

    // Actualizar los datos del departamento en la base de datos
    const updateQuery = 'UPDATE Departamento SET nombre = ? WHERE ID = ?';
    db.query(updateQuery, [nombre, departamentoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Departamento no encontrado' });
            }
        }
    });
});

app.post('/api/departamentos', (req, res) => {
    const { nombre } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud POST

    // Insertar un nuevo departamento en la base de datos
    const insertQuery = 'INSERT INTO Departamento (nombre) VALUES (?)';
    db.query(insertQuery, [nombre], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            // Devuelve el ID del nuevo departamento creado
            res.status(201).json({ message: 'Departamento creado exitosamente', departamentoId: results.insertId });
        }
    });
});


//Ciudad

app.get('/api/ciudades', (req, res) => {
    const query = 'SELECT Ciudad.*, Departamento.nombre AS nombre_departamento FROM Ciudad JOIN Departamento ON Ciudad.departamento_id = Departamento.ID';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ ciudades: results });
        }
    });
});


// POST para agregar una nueva ciudad
app.post('/api/ciudades', (req, res) => {
    const { nombre, departamento_id } = req.body;
    const insertQuery = 'INSERT INTO Ciudad (nombre, departamento_id) VALUES (?, ?)';
    db.query(insertQuery, [nombre, departamento_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Ciudad agregada exitosamente' });
        }
    });
});

// PUT para actualizar una ciudad
app.put('/api/ciudades/:ciudadId', (req, res) => {
    const ciudadId = req.params.ciudadId;
    const { nombre, departamento_id } = req.body;
    const updateQuery = 'UPDATE Ciudad SET nombre = ?, departamento_id = ? WHERE ID = ?';
    db.query(updateQuery, [nombre, departamento_id, ciudadId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Ciudad no encontrada' });
            }
        }
    });
});

// DELETE para eliminar una ciudad
app.delete('/api/ciudades/:ciudadId', (req, res) => {
    const ciudadId = req.params.ciudadId;
    const deleteQuery = 'DELETE FROM Ciudad WHERE ID = ?';
    db.query(deleteQuery, [ciudadId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Ciudad eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Ciudad no encontrada' });
            }
        }
    });
});



//Colonia

app.get('/api/colonias', (req, res) => {
    const query = 'SELECT Colonia.*, Ciudad.nombre AS nombre_ciudad, Departamento.nombre AS nombre_departamento FROM Colonia ' +
        'JOIN Ciudad ON Colonia.ciudad_id = Ciudad.ID ' +
        'JOIN Departamento ON Ciudad.departamento_id = Departamento.ID';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ colonias: results });
        }
    });
});

// POST para agregar una nueva colonia
app.post('/api/colonias', (req, res) => {
    const { nombre, ciudad_id } = req.body;
    const insertQuery = 'INSERT INTO Colonia (nombre, ciudad_id) VALUES (?, ?)';
    db.query(insertQuery, [nombre, ciudad_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Colonia agregada exitosamente' });
        }
    });
});

// PUT para actualizar una colonia
app.put('/api/colonias/:coloniaId', (req, res) => {
    const coloniaId = req.params.coloniaId;
    const { nombre, ciudad_id } = req.body;
    const updateQuery = 'UPDATE Colonia SET nombre = ?, ciudad_id = ? WHERE ID = ?';
    db.query(updateQuery, [nombre, ciudad_id, coloniaId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Colonia no encontrada' });
            }
        }
    });
});

// DELETE para eliminar una colonia
app.delete('/api/colonias/:coloniaId', (req, res) => {
    const coloniaId = req.params.coloniaId;
    const deleteQuery = 'DELETE FROM Colonia WHERE ID = ?';
    db.query(deleteQuery, [coloniaId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Colonia eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Colonia no encontrada' });
            }
        }
    });
});



//Sucursal 

app.get('/api/sucursales', (req, res) => {
    const query = 'SELECT Sucursal.*, Colonia.nombre AS nombre_colonia, Ciudad.nombre AS nombre_ciudad, Departamento.nombre AS nombre_departamento FROM Sucursal ' +
        'JOIN Colonia ON Sucursal.id_colonia = Colonia.ID ' +
        'JOIN Ciudad ON Colonia.ciudad_id = Ciudad.ID ' +
        'JOIN Departamento ON Ciudad.departamento_id = Departamento.ID';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.length === 0) {
                console.log('No se encontraron sucursales.');
            }
            res.status(200).json({ sucursales: results });
        }
    });
});


app.post('/api/sucursales', (req, res) => {
    const { nombre, direccion, telefono, correo, id_colonia, fecha_apertura, hora_apertura, hora_cierre, estado } = req.body;
    const insertQuery = `
        INSERT INTO Sucursal (nombre, direccion, telefono, correo, id_colonia, fecha_apertura, hora_apertura, hora_cierre, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertQuery, [nombre, direccion, telefono, correo, id_colonia, fecha_apertura, hora_apertura, hora_cierre, estado], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Sucursal agregada exitosamente' });
        }
    });
});

app.put('/api/sucursales/:sucursalId', (req, res) => {
    const sucursalId = req.params.sucursalId;
    const { nombre, direccion, telefono, correo, id_colonia, fecha_apertura, hora_apertura, hora_cierre, estado } = req.body;

    // Obtener el estado actual antes de la actualización
    const obtenerEstadoActualQuery = 'SELECT estado FROM Sucursal WHERE id = ?';
    db.query(obtenerEstadoActualQuery, [sucursalId], (errEstadoActual, resultsEstadoActual) => {
        if (errEstadoActual) {
            console.error(errEstadoActual);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            const estadoAnterior = resultsEstadoActual[0].estado;

            // Actualizar la sucursal
            const updateQuery = `
                UPDATE Sucursal
                SET nombre = ?, direccion = ?, telefono = ?, correo = ?, id_colonia = ?, fecha_apertura = ?, hora_apertura = ?, hora_cierre = ?, estado = ?
                WHERE id = ?`;

            db.query(updateQuery, [nombre, direccion, telefono, correo, id_colonia, fecha_apertura, hora_apertura, hora_cierre, estado, sucursalId], (errUpdate, resultsUpdate) => {
                if (errUpdate) {
                    console.error(errUpdate);
                    res.status(500).json({ message: 'Error en el servidor' });
                } else {
                    if (resultsUpdate.affectedRows > 0) {
                        // Insertar en HistoricoSucursal
                        const historicoQuery = `
                            INSERT INTO HistoricoSucursal (id_sucursal, fecha_cambio, hora_cambio, estado_anterior, estado_actual)
                            VALUES (?, CURDATE(), CURTIME(), ?, ?)`;

                        db.query(historicoQuery, [sucursalId, estadoAnterior, estado], (errHistorico) => {
                            if (errHistorico) {
                                console.error(errHistorico);
                                res.status(500).json({ message: 'Error en el servidor' });
                            } else {
                                res.status(200).json({ message: 'Cambios guardados exitosamente' });
                            }
                        });
                    } else {
                        res.status(404).json({ message: 'Sucursal no encontrada' });
                    }
                }
            });
        }
    });
});


app.delete('/api/sucursales/:sucursalId', (req, res) => {
    const sucursalId = req.params.sucursalId;
    const deleteQuery = 'DELETE FROM Sucursal WHERE id = ?';
    db.query(deleteQuery, [sucursalId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Sucursal no encontrada' });
            }
        }
    });
});


//Historico sucursal

// Listar historial de cambios de todas las sucursales
app.get('/api/historico-sucursales', (req, res) => {
    const query = `
        SELECT HistoricoSucursal.*, Sucursal.nombre AS nombre_sucursal
        FROM HistoricoSucursal
        JOIN Sucursal ON HistoricoSucursal.id_sucursal = Sucursal.id`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.length === 0) {
                console.log('No se encontró historial para ninguna sucursal.');
            }
            res.status(200).json({ historicoSucursales: results });
        }
    });
});






//Tipos de Documentos

// Obtener todos los tipos de documentos
app.get('/api/tipos_documentos', (req, res) => {
    const query = 'SELECT * FROM tipoDocumentoEmpleado';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ tiposDocumento: results });
        }
    });
});

// Eliminar un tipo de documento por ID
app.delete('/api/tipos_documentos/:tipoDocumentoId', (req, res) => {
    const tipoDocumentoId = req.params.tipoDocumentoId;
    const deleteQuery = 'DELETE FROM tipoDocumentoEmpleado WHERE id = ?';
    db.query(deleteQuery, [tipoDocumentoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Tipo de documento eliminado correctamente' });
            } else {
                res.status(404).json({ message: 'Tipo de documento no encontrado' });
            }
        }
    });
});

// Actualizar un tipo de documento por ID
app.put('/api/tipos_documentos/:tipoDocumentoId', (req, res) => {
    const tipoDocumentoId = req.params.tipoDocumentoId;
    const { nombre } = req.body;

    const updateQuery = 'UPDATE tipoDocumentoEmpleado SET nombre = ? WHERE id = ?';
    db.query(updateQuery, [nombre, tipoDocumentoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Tipo de documento no encontrado' });
            }
        }
    });
});

// Crear un nuevo tipo de documento
app.post('/api/tipos_documentos', (req, res) => {
    const { nombre } = req.body;

    const insertQuery = 'INSERT INTO tipoDocumentoEmpleado (nombre) VALUES (?)';
    db.query(insertQuery, [nombre], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Tipo de documento creado exitosamente', tipoDocumentoId: results.insertId });
        }
    });
});




//Puesto
// Obtener todos los puestos
app.get('/api/puestos', (req, res) => {
    const query = 'SELECT * FROM Puesto';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ puestos: results });
        }
    });
});

// Eliminar un puesto por ID
app.delete('/api/puestos/:puestoId', (req, res) => {
    const puestoId = req.params.puestoId;
    const deleteQuery = 'DELETE FROM Puesto WHERE id = ?';
    db.query(deleteQuery, [puestoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Puesto eliminado correctamente' });
            } else {
                res.status(404).json({ message: 'Puesto no encontrado' });
            }
        }
    });
});

// Actualizar un puesto por ID
app.put('/api/puestos/:puestoId', (req, res) => {
    const puestoId = req.params.puestoId;
    const { nombre, salario } = req.body;

    const updateQuery = 'UPDATE Puesto SET nombre = ?, salario = ? WHERE id = ?';
    db.query(updateQuery, [nombre, salario, puestoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Puesto no encontrado' });
            }
        }
    });
});

// Crear un nuevo puesto
app.post('/api/puestos', (req, res) => {
    const { nombre, salario } = req.body;

    const insertQuery = 'INSERT INTO Puesto (nombre, salario) VALUES (?, ?)';
    db.query(insertQuery, [nombre, salario], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Puesto creado exitosamente', puestoId: results.insertId });
        }
    });
});



//Empleado 

// Obtener todos los empleados con información detallada
app.get('/api/empleados', (req, res) => {
    const query = `
        SELECT
            Empleado.*,
            Puesto.nombre AS nombre_puesto,
            Puesto.salario,
            TipoDocumentoEmpleado.nombre AS nombre_documento
        FROM
            Empleado
        JOIN Puesto ON Empleado.id_puesto = Puesto.id
        JOIN TipoDocumentoEmpleado ON Empleado.id_tipo_documento = TipoDocumentoEmpleado.id`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de empleados:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.length === 0) {
                console.log('No se encontraron empleados.');
            }
            res.status(200).json({ empleados: results });
        }
    });
});

app.post('/api/empleados', (req, res) => {
    const {
        nombre,
        apellido,
        fecha_nacimiento,
        fecha_contratacion,
        numero_contratacion,
        genero,
        estado_civil,
        rtn,
        documento,
        id_tipo_documento,
        id_puesto
    } = req.body;

    const insertQuery = `
        INSERT INTO Empleado (
            nombre,
            apellido,
            fecha_nacimiento,
            fecha_contratacion,
            numero_contratacion,
            genero,
            estado_civil,
            rtn,
            documento,
            id_tipo_documento,
            id_puesto
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        insertQuery,
        [
            nombre,
            apellido,
            fecha_nacimiento,
            fecha_contratacion,
            numero_contratacion,
            genero,
            estado_civil,
            rtn,
            documento,
            id_tipo_documento,
            id_puesto
        ],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error en el servidor' });
            } else {
                res.status(201).json({ message: 'Empleado agregado exitosamente' });
            }
        }
    );
});

app.put('/api/empleados/:empleadoId', (req, res) => {
    const empleadoId = req.params.empleadoId;
    const {
        nombre,
        apellido,
        fecha_nacimiento,
        fecha_contratacion,
        numero_contratacion,
        genero,
        estado_civil,
        rtn,
        documento,
        id_tipo_documento,
        id_puesto,
    } = req.body;

    const updateQuery = 'UPDATE Empleado SET nombre = ?, apellido = ?, fecha_nacimiento = ?, fecha_contratacion = ?, numero_contratacion = ?, genero = ?, estado_civil = ?, rtn = ?, documento = ?, id_tipo_documento = ?, id_puesto = ? WHERE id = ?';

    db.query(
        updateQuery,
        [nombre, apellido, fecha_nacimiento, fecha_contratacion, numero_contratacion, genero, estado_civil, rtn, documento, id_tipo_documento, id_puesto, empleadoId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error en el servidor' });
            } else {
                if (results.affectedRows > 0) {
                    res.status(200).json({ message: 'Cambios guardados exitosamente' });
                } else {
                    res.status(404).json({ message: 'Empleado no encontrado' });
                }
            }
        }
    );
});


app.delete('/api/empleados/:empleadoId', (req, res) => {
    const empleadoId = req.params.empleadoId;
    const deleteQuery = 'DELETE FROM Empleado WHERE id = ?';
    db.query(deleteQuery, [empleadoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Empleado eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Empleado no encontrado' });
            }
        }
    });
});


//Historial Puestos

app.get('/api/historico-puestos', (req, res) => {
    const query = `
        SELECT historicoPuesto.*, Empleado.nombre AS nombre_empleado,
        Puesto.nombre AS nombre_puesto_anterior, PuestoActual.nombre AS nombre_puesto_actual
        FROM historicoPuesto
        JOIN Empleado ON historicoPuesto.id_empleado = Empleado.id
        JOIN Puesto ON historicoPuesto.puesto_anterior = Puesto.id
        JOIN Puesto AS PuestoActual ON historicoPuesto.puesto_actual = PuestoActual.id`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.length === 0) {
                console.log('No se encontró historial para ningún empleado.');
            }
            res.status(200).json({ historicoPuestos: results });
        }
    });
});



// CorreoEmpleado

// Obtener todos los correos de empleados
app.get('/api/correos-empleados', (req, res) => {
    const query = 'SELECT ce.*, e.nombre AS nombre_empleado, e.apellido FROM CorreoEmpleados ce JOIN Empleado e ON ce.id_empleado = e.id';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ correosEmpleados: results });
        }
    });
});

app.post('/api/correos-empleados', (req, res) => {
    const { id_empleado, tipo, correo } = req.body;
    const insertQuery = 'INSERT INTO CorreoEmpleados (id_empleado, tipo, correo) VALUES (?, ?, ?)';
    const values = [id_empleado, tipo, correo];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Correo de empleado agregado exitosamente' });
        }
    });
});

// Actualizar un correo de empleado por ID
app.put('/api/correos-empleados/:correoEmpleadoId', (req, res) => {
    const correoEmpleadoId = req.params.correoEmpleadoId;
    const { id_empleado, tipo, correo } = req.body;
    const updateQuery = 'UPDATE CorreoEmpleados SET id_empleado = ?, tipo = ?, correo = ? WHERE id = ?';
    db.query(updateQuery, [id_empleado, tipo, correo, correoEmpleadoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Correo de empleado no encontrado' });
            }
        }
    });
});

// Eliminar un correo de empleado por ID
app.delete('/api/correos-empleados/:correoEmpleadoId', (req, res) => {
    const correoEmpleadoId = req.params.correoEmpleadoId;
    const deleteQuery = 'DELETE FROM CorreoEmpleados WHERE id = ?';
    db.query(deleteQuery, [correoEmpleadoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Correo de empleado eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Correo de empleado no encontrado' });
            }
        }
    });
});




//Telefon Empleado 

app.get('/api/telefonos-empleados', (req, res) => {
    const query = 'SELECT te.*, e.nombre AS nombre_empleado, e.apellido FROM TelefonosEmpleados te JOIN Empleado e ON te.id_empleado = e.id';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ telefonosEmpleados: results });
        }
    });
});

app.post('/api/telefonos-empleados', (req, res) => {
    const { id_empleado, tipo, telefono } = req.body;
    const insertQuery = 'INSERT INTO TelefonosEmpleados (id_empleado, tipo, telefono) VALUES (?, ?, ?)';
    const values = [id_empleado, tipo, telefono];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Teléfono de empleado agregado exitosamente' });
        }
    });
});

app.put('/api/telefonos-empleados/:telefonoEmpleadoId', (req, res) => {
    const telefonoEmpleadoId = req.params.telefonoEmpleadoId;
    const { id_empleado, tipo, telefono } = req.body;
    const updateQuery = 'UPDATE TelefonosEmpleados SET id_empleado = ?, tipo = ?, telefono = ? WHERE id = ?';

    db.query(updateQuery, [id_empleado, tipo, telefono, telefonoEmpleadoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Teléfono de empleado no encontrado' });
            }
        }
    });
});

app.delete('/api/telefonos-empleados/:telefonoEmpleadoId', (req, res) => {
    const telefonoEmpleadoId = req.params.telefonoEmpleadoId;
    const deleteQuery = 'DELETE FROM TelefonosEmpleados WHERE id = ?';

    db.query(deleteQuery, [telefonoEmpleadoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Teléfono de empleado eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Teléfono de empleado no encontrado' });
            }
        }
    });
});




//Tipo de documento Cliente

// Obtener todos los tipos de documentos para clientes
app.get('/api/tipos_documentos_cliente', (req, res) => {
    const query = 'SELECT * FROM tipoDocumentoCliente';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ tiposDocumentoCliente: results });
        }
    });
});

// Eliminar un tipo de documento para clientes por ID
app.delete('/api/tipos_documentos_cliente/:tipoDocumentoId', (req, res) => {
    const tipoDocumentoId = req.params.tipoDocumentoId;
    const deleteQuery = 'DELETE FROM tipoDocumentoCliente WHERE tipoDocumentoID = ?';
    db.query(deleteQuery, [tipoDocumentoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Tipo de documento para clientes eliminado correctamente' });
            } else {
                res.status(404).json({ message: 'Tipo de documento para clientes no encontrado' });
            }
        }
    });
});

// Actualizar un tipo de documento para clientes por ID
app.put('/api/tipos_documentos_cliente/:tipoDocumentoId', (req, res) => {
    const tipoDocumentoId = req.params.tipoDocumentoId;
    const { nombre } = req.body;

    const updateQuery = 'UPDATE tipoDocumentoCliente SET nombre = ? WHERE tipoDocumentoID = ?';
    db.query(updateQuery, [nombre, tipoDocumentoId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Tipo de documento para clientes no encontrado' });
            }
        }
    });
});

// Crear un nuevo tipo de documento para clientes
app.post('/api/tipos_documentos_cliente', (req, res) => {
    const { nombre } = req.body;

    const insertQuery = 'INSERT INTO tipoDocumentoCliente (nombre) VALUES (?)';
    db.query(insertQuery, [nombre], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Tipo de documento para clientes creado exitosamente', tipoDocumentoId: results.insertId });
        }
    });
});




//Cliente

app.get('/api/clientes', (req, res) => {
    const query = `
        SELECT
            Cliente.*,
            TipoDocumentoCliente.nombre AS nombre_documento
        FROM
            Cliente
        JOIN TipoDocumentoCliente ON Cliente.tipoDocumentoID = TipoDocumentoCliente.tipoDocumentoID`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener la lista de clientes:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.length === 0) {
                console.log('No se encontraron clientes.');
            }
            res.status(200).json({ clientes: results });
        }
    });
});

app.post('/api/clientes', (req, res) => {
    const { tipoDocumentoID, nombre, apellido, fechaNacimiento, genero, estadoCivil, rtn, numeroDocumento } = req.body;

    const insertQuery = 'INSERT INTO Cliente (tipoDocumentoID, nombre, apellido, fechaNacimiento, genero, estadoCivil, rtn, numeroDocumento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [tipoDocumentoID, nombre, apellido, fechaNacimiento, genero, estadoCivil, rtn, numeroDocumento], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Cliente creado exitosamente', clienteId: results.insertId });
        }
    });
});

app.put('/api/clientes/:clienteId', (req, res) => {
    const clienteId = req.params.clienteId;
    const { tipoDocumentoID, nombre, apellido, fechaNacimiento, genero, estadoCivil, rtn, numeroDocumento } = req.body;

    const updateQuery = 'UPDATE Cliente SET tipoDocumentoID = ?, nombre = ?, apellido = ?, fechaNacimiento = ?, genero = ?, estadoCivil = ?, rtn = ?, numeroDocumento = ? WHERE clienteID = ?';
    db.query(updateQuery, [tipoDocumentoID, nombre, apellido, fechaNacimiento, genero, estadoCivil, rtn, numeroDocumento, clienteId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        }
    });
});

app.delete('/api/clientes/:clienteId', (req, res) => {
    const clienteId = req.params.clienteId;
    const deleteQuery = 'DELETE FROM Cliente WHERE clienteID = ?';
    db.query(deleteQuery, [clienteId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cliente eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        }
    });
});



//Correo Cliente

// Obtener todos los correos de clientes
app.get('/api/correos-clientes', (req, res) => {
    const query = 'SELECT cc.*, c.nombre AS nombre_cliente, c.apellido FROM CorreoCliente cc JOIN Cliente c ON cc.clienteID = c.clienteID';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ correosClientes: results });
        }
    });
});

// Agregar un nuevo correo de cliente
app.post('/api/correos-clientes', (req, res) => {
    const { clienteID, tipo, direccionCorreo } = req.body;
    const insertQuery = 'INSERT INTO CorreoCliente (clienteID, tipo, direccionCorreo) VALUES (?, ?, ?)';
    const values = [clienteID, tipo, direccionCorreo];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Correo de cliente agregado exitosamente' });
        }
    });
});

// Actualizar un correo de cliente por ID
app.put('/api/correos-clientes/:correoClienteId', (req, res) => {
    const correoClienteId = req.params.correoClienteId;
    const { clienteID, tipo, direccionCorreo } = req.body;
    const updateQuery = 'UPDATE CorreoCliente SET clienteID = ?, tipo = ?, direccionCorreo = ? WHERE correoID = ?';

    db.query(updateQuery, [clienteID, tipo, direccionCorreo, correoClienteId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Correo de cliente no encontrado' });
            }
        }
    });
});

// Eliminar un correo de cliente por ID
app.delete('/api/correos-clientes/:correoClienteId', (req, res) => {
    const correoClienteId = req.params.correoClienteId;
    const deleteQuery = 'DELETE FROM CorreoCliente WHERE correoID = ?';

    db.query(deleteQuery, [correoClienteId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Correo de cliente eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Correo de cliente no encontrado' });
            }
        }
    });
});





//Telefono Cliente 

// Obtener todos los teléfonos de clientes
app.get('/api/telefonos-clientes', (req, res) => {
    const query = 'SELECT tc.*, c.nombre AS nombre_cliente, c.apellido FROM TelefonoCliente tc JOIN Cliente c ON tc.clienteID = c.clienteID';

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(200).json({ telefonosClientes: results });
        }
    });
});

// Agregar un nuevo teléfono de cliente
app.post('/api/telefonos-clientes', (req, res) => {
    const { clienteID, tipo, numeroTelefono } = req.body;
    const insertQuery = 'INSERT INTO TelefonoCliente (clienteID, tipo, numeroTelefono) VALUES (?, ?, ?)';
    const values = [clienteID, tipo, numeroTelefono];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            res.status(201).json({ message: 'Teléfono de cliente agregado exitosamente' });
        }
    });
});

// Actualizar un teléfono de cliente por ID
app.put('/api/telefonos-clientes/:telefonoClienteId', (req, res) => {
    const telefonoClienteId = req.params.telefonoClienteId;
    const { clienteID, tipo, numeroTelefono } = req.body;
    const updateQuery = 'UPDATE TelefonoCliente SET clienteID = ?, tipo = ?, numeroTelefono = ? WHERE telefonoID = ?';

    db.query(updateQuery, [clienteID, tipo, numeroTelefono, telefonoClienteId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Cambios guardados exitosamente' });
            } else {
                res.status(404).json({ message: 'Teléfono de cliente no encontrado' });
            }
        }
    });
});

// Eliminar un teléfono de cliente por ID
app.delete('/api/telefonos-clientes/:telefonoClienteId', (req, res) => {
    const telefonoClienteId = req.params.telefonoClienteId;
    const deleteQuery = 'DELETE FROM TelefonoCliente WHERE telefonoID = ?';

    db.query(deleteQuery, [telefonoClienteId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Teléfono de cliente eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Teléfono de cliente no encontrado' });
            }
        }
    });
});




//Raza



app.listen(4000, () => {
    console.log('Servidor corriendo en el puesto 4000');
});