-- DROP SCHEMA dbo;

CREATE SCHEMA dbo;
-- db_veterinaria.dbo.horario_laboral definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.horario_laboral;

CREATE TABLE db_veterinaria.dbo.horario_laboral (
	id_horario_lab int IDENTITY(1,1) NOT NULL,
	hora_inicio time NOT NULL,
	hora_fin time NOT NULL,
	dia_semana varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	duracion varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	jornada varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT horario_laboral_PK PRIMARY KEY (id_horario_lab)
);


-- db_veterinaria.dbo.metodo_pago definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.metodo_pago;

CREATE TABLE db_veterinaria.dbo.metodo_pago (
	id_metodo_pago int IDENTITY(1,1) NOT NULL,
	nombre varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	descripcion varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT metodo_pago_PK PRIMARY KEY (id_metodo_pago)
);


-- db_veterinaria.dbo.rol_usuario definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.rol_usuario;

CREATE TABLE db_veterinaria.dbo.rol_usuario (
	id_rol_usuario int IDENTITY(1,1) NOT NULL,
	rol varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	descripcion varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT rol_usuario_PK PRIMARY KEY (id_rol_usuario)
);


-- db_veterinaria.dbo.tbl_persona definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.tbl_persona;

CREATE TABLE db_veterinaria.dbo.tbl_persona (
	id_persona int IDENTITY(1,1) NOT NULL,
	nombre varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	apellido varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	fecha_nacimiento date NOT NULL,
	telefono varchar(12) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	correo varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	direccion text COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	genero varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	estado_civil varchar(12) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT tbl_persona_PK PRIMARY KEY (id_persona)
);
ALTER TABLE db_veterinaria.dbo.tbl_persona WITH NOCHECK ADD CONSTRAINT CK__tbl_perso__gener__18EBB532 CHECK ([genero]='F' OR [genero]='M');
ALTER TABLE db_veterinaria.dbo.tbl_persona WITH NOCHECK ADD CONSTRAINT CK__tbl_perso__estad__19DFD96B CHECK ([estado_civil]='union libre' OR [estado_civil]='divorciado' OR [estado_civil]='casado' OR [estado_civil]='soltero');


-- db_veterinaria.dbo.tipo_empleado definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.tipo_empleado;

CREATE TABLE db_veterinaria.dbo.tipo_empleado (
	id_tipo_empleado int IDENTITY(1,1) NOT NULL,
	cargo varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	descripcion varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT tipo_empleado_PK PRIMARY KEY (id_tipo_empleado)
);


-- db_veterinaria.dbo.tipo_servicio definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.tipo_servicio;

CREATE TABLE db_veterinaria.dbo.tipo_servicio (
	id_tipo_servicio int IDENTITY(1,1) NOT NULL,
	nombre varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	descripcion varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT tipo_servicio_PK PRIMARY KEY (id_tipo_servicio)
);


-- db_veterinaria.dbo.empleado definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.empleado;

CREATE TABLE db_veterinaria.dbo.empleado (
	id_empleado int IDENTITY(1,1) NOT NULL,
	id_persona int NOT NULL,
	fecha_contrato date NOT NULL,
	numero_contrato varchar(12) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	salario decimal(18,2) NOT NULL,
	foto varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ihss nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	id_tipo_empleado int NOT NULL,
	id_horario_lab int NOT NULL,
	CONSTRAINT empleado_PK PRIMARY KEY (id_empleado),
	CONSTRAINT horario_laboral_FK FOREIGN KEY (id_horario_lab) REFERENCES db_veterinaria.dbo.horario_laboral(id_horario_lab) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT tipo_empleado_FK FOREIGN KEY (id_tipo_empleado) REFERENCES db_veterinaria.dbo.tipo_empleado(id_tipo_empleado) ON DELETE CASCADE ON UPDATE CASCADE
);


-- db_veterinaria.dbo.tbl_usuario definition

-- Drop table

-- DROP TABLE db_veterinaria.dbo.tbl_usuario;

CREATE TABLE db_veterinaria.dbo.tbl_usuario (
	id_usuario int IDENTITY(1,1) NOT NULL,
	id_persona int NOT NULL,
	password varbinary(MAX) NOT NULL,
	id_rol_usuario int DEFAULT 2 NOT NULL,
	CONSTRAINT tbl_usuario_PK PRIMARY KEY (id_usuario),
	CONSTRAINT rol_usuario_FK FOREIGN KEY (id_rol_usuario) REFERENCES db_veterinaria.dbo.rol_usuario(id_rol_usuario),
	CONSTRAINT tbl_usuario_FK FOREIGN KEY (id_persona) REFERENCES db_veterinaria.dbo.tbl_persona(id_persona) ON DELETE CASCADE ON UPDATE CASCADE
);


DROP PROCEDURE IF EXISTS RegistroUsuarios;
CREATE PROCEDURE dbo.RegistroUsuarios
	@nombre nvarchar(100),
	@apellido nvarchar(100),
	@fecha_nacimiento DATE,
	@telefono nvarchar(12),
	@correo nvarchar(100),
	@direccion nvarchar(1000),
	@genero nvarchar(1),
	@estado_civil nvarchar(12),
	@password nvarchar(32),
	@llave nvarchar(32),
	@resultado INT OUTPUT
AS 
BEGIN
	DECLARE @id_persona INT;
	-- Intentar realizar la inserción en tbl_persona
    BEGIN TRY
	
		INSERT INTO tbl_persona (nombre, apellido, fecha_nacimiento, telefono, correo, direccion, genero, estado_civil) VALUES (
			@nombre, @apellido, @fecha_nacimiento, @telefono, @correo, @direccion, @genero, @estado_civil
		);
		-- Obtener el ID generado
		SET @id_persona = SCOPE_IDENTITY();
		
		INSERT INTO tbl_usuario (id_persona, password) VALUES (@id_persona, ENCRYPTBYPASSPHRASE(@llave, @password));
		INSERT INTO debug VALUES(@llave);
		SET @resultado = 1;
	END TRY
    BEGIN CATCH
        -- Si hay una excepción, algo salió mal
        SET @resultado = 0;
    END CATCH;
   
SELECT @resultado AS resultadoRegistro; 
END;