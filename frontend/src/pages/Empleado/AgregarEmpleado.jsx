import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Typography,
} from '@mui/material';
import axios from 'axios';

function AgregarEmpleado({ open, handleClose, handleGuardarNuevoEmpleado }) {
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        fecha_contratacion: '',
        numero_contratacion: '',
        genero: '',
        estado_civil: '',
        rtn: '',
        documento: '',
        id_tipo_documento: '',
        id_puesto: '',
    });
    const [error, setError] = useState('');
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [puestos, setPuestos] = useState([]);

    useEffect(() => {
        const obtenerTiposDocumento = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/tipos_documentos');
                setTiposDocumento(response.data.tiposDocumento);
            } catch (error) {
                console.error('Error al obtener la lista de tipos de documento', error);
            }
        };

        const obtenerPuestos = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/puestos');
                setPuestos(response.data.puestos);
            } catch (error) {
                console.error('Error al obtener la lista de puestos', error);
            }
        };

        obtenerTiposDocumento();
        obtenerPuestos();
    }, []);

    const validarInput = () => {
        const { nombre, apellido, fecha_nacimiento, fecha_contratacion, numero_contratacion, genero, estado_civil, rtn, documento, id_tipo_documento, id_puesto } = nuevoEmpleado;

        if (!nombre.trim() || !apellido.trim() || !fecha_nacimiento.trim() || !fecha_contratacion.trim() || !numero_contratacion.trim() || !genero.trim() || !estado_civil.trim() || !rtn.trim() || !documento.trim() || !id_tipo_documento || !id_puesto) {
            setError('Todos los campos son obligatorios.');
            return false;
        }

        const letrasNumerosEspacios = /^[A-Za-z0-9 ]+$/;

        // Validaciones para el nombre
        if (!letrasNumerosEspacios.test(nombre)) {
            setError('Solo se permiten letras, números y espacios en el nombre.');
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos en el nombre
        if (/(\w)\1\1/.test(nombre)) {
            setError('No se permite la misma letra repetida más de 2 veces en el nombre.');
            return false;
        }

        // Validación de no más de un espacio en el nombre
        if (nombre.includes('  ')) {
            setError('No se permiten más de un espacio en el nombre.');
            return false;
        }

        // Validación de al menos 3 letras en el nombre
        if (nombre.length < 3) {
            setError('El nombre debe tener al menos 3 letras.');
            return false;
        }

        // Validaciones para el apellido
        if (!letrasNumerosEspacios.test(apellido)) {
            setError('Solo se permiten letras, números y espacios en el apellido.');
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos en el apellido
        if (/(\w)\1\1/.test(apellido)) {
            setError('No se permite la misma letra repetida más de 2 veces en el apellido.');
            return false;
        }

        // Validación de no más de un espacio en el apellido
        if (apellido.includes('  ')) {
            setError('No se permiten más de un espacio en el apellido.');
            return false;
        }

        // Validación de al menos 3 letras en el apellido
        if (apellido.length < 3) {
            setError('El apellido debe tener al menos 3 letras.');
            return false;
        }

        // Validación para la fecha de nacimiento
        const fechaNacimientoObj = new Date(nuevoEmpleado.fecha_nacimiento);
        const fechaActual = new Date();

        // Se calcula la diferencia en meses
        const mesesDiferencia = (fechaActual - fechaNacimientoObj) / (1000 * 60 * 60 * 24 * 30);

        if (mesesDiferencia < 216) {
            setError('El empleado debe tener al menos 18 años.');
            return false;
        }

        // Validación para la fecha de contratación
        const fechaContratacionObj = new Date(fecha_contratacion);

        // Verificar si la fecha de contratación es mayor a la fecha actual
        if (fechaContratacionObj > new Date()) {
            setError('La fecha de contratación no puede ser posterior a la fecha actual.');
            return false;
        }

        // Verificar si la fecha de contratación es menor a la fecha de nacimiento
        if (fechaContratacionObj < fechaNacimientoObj) {
            setError('La fecha de contratación no puede ser anterior a la fecha de nacimiento.');
            return false;
        }

        const numeroContratacionRegex = /^[0-9]{6,}$/;

        if (!numeroContratacionRegex.test(numero_contratacion)) {
            setError('El número de contratación debe contener al menos 6 dígitos y solo puede contener números.');
            return false;
        }

        const rtnRegex = /^\d{4}-\d{4}-\d{6}$/;

        if (!rtnRegex.test(rtn)) {
            setError('El RTN debe tener el formato XXXX-XXXX-XXXXXX.');
            return false;
        }

        // Validación para el tipo de documento DNI
        if (id_tipo_documento === 'DNI') {
            const dniRegex = /^\d{4}-\d{4}-\d{5}$/;
            const dniAnio = nuevoEmpleado.fecha_nacimiento.substr(0, 4);

            if (!dniRegex.test(documento) || (documento.substr(0, 4) !== dniAnio && parseInt(documento.substr(0, 4)) !== parseInt(dniAnio) + 1)) {
                setError('El DNI debe tener el formato XXXX-XXXX-XXXXX y los 4 primeros dígitos deben coincidir con el año de la fecha de nacimiento o ser 1 año mayor.');
                return false;
            }
        }

        setError('');
        return true;
    };

    const handleGuardar = async () => {
        if (validarInput()) {
            try {
                const response = await axios.post('http://localhost:4000/api/empleados', nuevoEmpleado);

                if (response.status === 201) {
                    console.log('Empleado creado exitosamente');
                    handleGuardarNuevoEmpleado();
                } else {
                    console.error('Error al crear el empleado');
                }
            } catch (error) {
                console.error('Error en la solicitud para agregar empleado', error);
            } finally {
                setNuevoEmpleado({
                    nombre: '',
                    apellido: '',
                    fecha_nacimiento: '',
                    fecha_contratacion: '',
                    numero_contratacion: '',
                    genero: '',
                    estado_civil: '',
                    rtn: '',
                    documento: '',
                    id_tipo_documento: '',
                    id_puesto: '',
                });
                handleClose();
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre del Empleado"
                            fullWidth
                            value={nuevoEmpleado.nombre}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Apellido"
                            fullWidth
                            value={nuevoEmpleado.apellido}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de Nacimiento"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={nuevoEmpleado.fecha_nacimiento}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, fecha_nacimiento: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de Contratación"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={nuevoEmpleado.fecha_contratacion}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, fecha_contratacion: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Número de Contratación"
                            type="number"
                            fullWidth
                            value={nuevoEmpleado.numero_contratacion}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, numero_contratacion: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="genero-label">Género</InputLabel>
                            <Select
                                labelId="genero-label"
                                id="genero"
                                value={nuevoEmpleado.genero}
                                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, genero: e.target.value })}
                            >
                                <MenuItem value="Masculino">Masculino</MenuItem>
                                <MenuItem value="Femenino">Femenino</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="estado-civil-label">Estado Civil</InputLabel>
                            <Select
                                labelId="estado-civil-label"
                                id="estado-civil"
                                value={nuevoEmpleado.estado_civil}
                                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, estado_civil: e.target.value })}
                            >
                                <MenuItem value="Casado">Casado</MenuItem>
                                <MenuItem value="Viudo">Viudo</MenuItem>
                                <MenuItem value="Divorciado">Divorciado</MenuItem>
                                <MenuItem value="Separado">Separado</MenuItem>
                                <MenuItem value="Soltero">Soltero</MenuItem>
                                <MenuItem value="Unión Libre">Unión Libre</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="RTN"
                            fullWidth
                            value={nuevoEmpleado.rtn}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, rtn: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Documento"
                            fullWidth
                            value={nuevoEmpleado.documento}
                            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, documento: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                            <Select
                                labelId="tipo-documento-label"
                                id="tipo-documento"
                                value={nuevoEmpleado.id_tipo_documento}
                                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, id_tipo_documento: e.target.value })}
                            >
                                {tiposDocumento.map((tipoDocumento) => (
                                    <MenuItem key={tipoDocumento.id} value={tipoDocumento.id}>
                                        {tipoDocumento.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="puesto-label">Puesto</InputLabel>
                            <Select
                                labelId="puesto-label"
                                id="puesto"
                                value={nuevoEmpleado.id_puesto}
                                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, id_puesto: e.target.value })}
                            >
                                {puestos.map((puesto) => (
                                    <MenuItem key={puesto.id} value={puesto.id}>
                                        {puesto.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} color="primary">
                    Guardar
                </Button>
            </DialogActions>
            {error && (
                <DialogContent>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                </DialogContent>
            )}
        </Dialog>
    );
}

export default AgregarEmpleado;
