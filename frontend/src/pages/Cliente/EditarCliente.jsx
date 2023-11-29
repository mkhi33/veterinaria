import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
} from '@mui/material';
import axios from 'axios';

function EditarCliente({ open, handleClose, cliente, handleGuardarEdicion }) {
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        genero: '',
        estadoCivil: '',
        rtn: '',
        numeroDocumento: '',
        tipoDocumentoID: '',
    });

    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Actualiza los datos en el estado cuando el cliente cambia
        if (cliente) {
            setNuevoCliente({
                nombre: cliente.nombre || '',
                apellido: cliente.apellido || '',
                fechaNacimiento: convertirFecha(cliente.fechaNacimiento) || '',
                genero: cliente.genero || '',
                estadoCivil: cliente.estadoCivil || '',
                rtn: cliente.rtn || '',
                numeroDocumento: cliente.numeroDocumento || '',
                tipoDocumentoID: cliente.tipoDocumentoID || '',
            });
        }
    }, [cliente]);

    useEffect(() => {
        // Cargar la lista de tipos de documento al abrir el modal
        const obtenerTiposDocumento = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/tipos_documentos_cliente');
                setTiposDocumento(response.data.tiposDocumentoCliente);
            } catch (error) {
                console.error('Error al obtener la lista de tipos de documento', error);
                setError('Error al cargar los tipos de documento');
            }
        };

        obtenerTiposDocumento();
    }, []);

    const validarInput = () => {
        const { nombre, apellido, fechaNacimiento, genero, estadoCivil, rtn, numeroDocumento, tipoDocumentoID } = nuevoCliente;

        if (
            !nombre.trim() ||
            !apellido.trim() ||
            !fechaNacimiento.trim() ||
            !genero.trim() ||
            !estadoCivil.trim() ||
            !numeroDocumento.trim() ||
            !tipoDocumentoID
        ) {
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
        const fechaNacimientoObj = new Date(nuevoCliente.fechaNacimiento);
        const fechaActual = new Date();

        // Se calcula la diferencia en meses
        const mesesDiferencia = (fechaActual - fechaNacimientoObj) / (1000 * 60 * 60 * 24 * 30);

        if (mesesDiferencia < 216) {
            setError('El cliente debe tener al menos 18 años.');
            return false;
        }

        // Validación para el formato del RTN (opcional)
        const rtnRegex = /^$|^\d{4}-\d{4}-\d{6}$/;

        if (!rtnRegex.test(rtn)) {
            setError('El RTN debe tener el formato XXXX-XXXX-XXXXXX o puede estar vacío.');
            return false;
        }

        setError(''); // Si todas las validaciones pasan, borra el mensaje de error
        return true;
    };


    const handleGuardar = () => {
        // Verifica que el cliente exista antes de intentar guardar
        if (cliente && validarInput()) {
            handleGuardarEdicion(cliente.clienteID, nuevoCliente);
        }
    };

    const convertirFecha = (fecha) => {
        if (!fecha) {
            return '';
        }

        const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
        return fechaFormateada;
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Cliente</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nuevoCliente.nombre}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Apellido"
                            fullWidth
                            value={nuevoCliente.apellido}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de Nacimiento"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={nuevoCliente.fechaNacimiento}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, fechaNacimiento: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="genero-label">Género</InputLabel>
                            <Select
                                labelId="genero-label"
                                id="genero"
                                value={nuevoCliente.genero}
                                onChange={(e) => setNuevoCliente({ ...nuevoCliente, genero: e.target.value })}
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
                                value={nuevoCliente.estadoCivil}
                                onChange={(e) => setNuevoCliente({ ...nuevoCliente, estadoCivil: e.target.value })}
                            >
                                <MenuItem value="Casado">Casado</MenuItem>
                                <MenuItem value="Viudo">Viudo</MenuItem>
                                <MenuItem value="Divorciado">Divorciado</MenuItem>
                                <MenuItem value="Soltero">Soltero</MenuItem>
                                <MenuItem value="Unión Libre">Unión Libre</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="RTN"
                            fullWidth
                            value={nuevoCliente.rtn}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, rtn: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Número de Documento"
                            fullWidth
                            value={nuevoCliente.numeroDocumento}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, numeroDocumento: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                            <Select
                                labelId="tipo-documento-label"
                                id="tipo-documento"
                                value={nuevoCliente.tipoDocumentoID}
                                onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipoDocumentoID: e.target.value })}
                            >
                                {tiposDocumento.map((tipoDocumento) => (
                                    <MenuItem key={tipoDocumento.tipoDocumentoID} value={tipoDocumento.tipoDocumentoID}>
                                        {tipoDocumento.nombre}
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
        </Dialog>
    );
}

export default EditarCliente;
