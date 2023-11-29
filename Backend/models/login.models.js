/*
    1. Definir el modelo
        crear
        obtener
        eliminar
        actualizar

    2. Crear las rutas

    3. Requerir las rutas en el server.js

    4. Crear el controlador
*/
const sql = require('mssql');
const sqlConfig = require('./db.js');

// Definimos el constructor
const Login = function ({ correo, password }) {
    this.correo = correo;
    this.password = password;
};


// Creamos las funciones

Login.login = async (objLoging, resultado) => {
    try {
        await sql.connect(sqlConfig);
        const res = await sql.query`
        SELECT tp.correo FROM tbl_usuario tu 
	INNER JOIN tbl_persona tp 
		ON tp.id_persona = tu.id_persona 
	WHERE CAST(DECRYPTBYPASSPHRASE(${process.env.SECRETO}, tu.password) AS NVARCHAR(100)) = ${objLoging.password} AND tp.correo = ${objLoging.correo};`
        
        if (res.recordset.length) {
            resultado(null, res.recordset[0]);
            return;
        }
        resultado(null, { estado: "no_encontrado" });
    } catch (error) {
        resultado(error, null);
    }
}



module.exports = Login;