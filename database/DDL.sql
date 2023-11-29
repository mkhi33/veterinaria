DROP TABLE tbl_usuario;
DROP TABLE tbl_persona;
CREATE TABLE db_veterinaria.dbo.tbl_persona (
	id_persona INT IDENTITY(1,1) NOT NULL,
	nombre varchar(100) NOT NULL,
	apellido varchar(100) NOT NULL,
	fecha_nacimiento date NOT NULL,
	telefono varchar(12) NOT NULL,
	correo varchar(150) NOT NULL,
	direccion TEXT NOT NULL,
	genero VARCHAR(1) NOT NULL
	CHECK (genero IN('M', 'F')),
	estado_civil VARCHAR(12) NOT NULL
	CHECK (estado_civil IN ('soltero', 'casado', 'divorciado', 'union libre')),
	CONSTRAINT tbl_persona_PK PRIMARY KEY (id_persona)
);

CREATE TABLE db_veterinaria.dbo.tbl_usuario (
	id_usuario int IDENTITY(1,1) NOT NULL,
	id_persona int NOT NULL,
	password VARBINARY(MAX) NOT NULL,
	CONSTRAINT tbl_usuario_PK PRIMARY KEY (id_usuario),
	CONSTRAINT tbl_usuario_FK FOREIGN KEY (id_persona) 
		REFERENCES db_veterinaria.dbo.tbl_persona(id_persona) 
			ON DELETE CASCADE 
			ON UPDATE CASCADE
	
);