const sql = require('mssql');
const sqlConfig = require('./db.js');
const Usuario = function (objUsuario) {
    this.nombre = objUsuario.nombre;
    this.apellido = objUsuario.apellido;
    this.fecha_nacimiento = objUsuario.fecha_nacimiento;
    this.telefono = objUsuario.telefono;
    this.correo = objUsuario.correo;
    this.direccion = objUsuario.direccion;
    this.genero = objUsuario.genero;
    this.estado_civil = objUsuario.estado_civil;
    this.password = objUsuario.password;
};

Usuario.registroUsuario = async (objUsuario, resultado) => {
    // validar si el usuario no existe
    try {
        await sql.connect(sqlConfig);

        // Validar que el usuario no este registrado

        const resUsuario = await sql.query`
        SELECT COUNT(*) AS existe FROM tbl_usuario 
        INNER JOIN tbl_persona 
            ON tbl_persona.id_persona = tbl_usuario.id_persona
        WHERE tbl_persona.correo = ${objUsuario.correo}`;

        const existeUsuario = resUsuario.recordset[0].existe;
        if(existeUsuario) {
            resultado(null, { estado: "no_permitido" });
            return;
        }

        // registrar al usuario
        console.log(objUsuario);
        const res = await sql.query`
        EXEC dbo.RegistroUsuarios 
            @nombre = ${objUsuario.nombre},
            @apellido = ${objUsuario.apellido},
            @fecha_nacimiento = ${objUsuario.fecha_nacimiento},
            @telefono = ${objUsuario.telefono},
            @correo = ${objUsuario.correo},
            @direccion = ${objUsuario.direccion},
            @genero = ${objUsuario.genero},
            @estado_civil = ${objUsuario.estado_civil},
            @password = ${objUsuario.password},
            @llave = ${process.env.SECRETO},
            @resultado = 1;
        `;
        const resultadoRegistro = res.recordset[0].resultadoRegistro;
        // Validar el resultado
        if (parseInt(resultadoRegistro) === 1) {
            resultado(null, {estado: 'success'})
            console.log('Usuario registrado correctamente.');
        } else {

            resultado({mensaje: 'Ocurrio un error al registrar el suaurio'}, null)
            console.error('Error al registrar el usuario.');
        }
    } catch (error) {
        console.log(error);
        resultado(error, null)
        return;
    }
};

Usuario.obtener = async (emailUsuario, resultado) => {
    try {
        await sql.connect(sqlConfig);
        const res = await sql.query`
        SELECT 
            id_usuario, 
            nombre, 
            apellido, 
            fecha_nacimiento, 
            fecha_nacimiento, 
            telefono, 
            correo,
            direccion, 
            genero, 
            estado_civil,
            rol_usuario  
        FROM tbl_usuario tu 
            INNER JOIN tbl_persona tp 
                ON tp.id_persona = tu.id_persona 
            WHERE tp.correo = ${emailUsuario};`
        
        if (res.recordset.length) {
            resultado(null, res.recordset[0]);
            return;
        }
        resultado(null, { estado: "no_encontrado" });
    } catch (error) {
        resultado(error, null);
    }
}
module.exports = Usuario;