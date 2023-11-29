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
} from '@mui/material';
import axios from 'axios';

function AgregarSucursal({ open, handleClose, handleGuardarNuevaSucursal }) {
    const [nuevaSucursal, setNuevaSucursal] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        id_colonia: '',
        fecha_apertura: '',
        hora_apertura: '',
        hora_cierre: '',
        estado: '',
    });
    const [colonias, setColonias] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Cargar la lista de colonias al abrir el modal
        const obtenerColonias = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/colonias');
                setColonias(response.data.colonias);
            } catch (error) {
                console.error('Error al obtener la lista de colonias', error);
            }
        };

        obtenerColonias();
    }, []);

    const validarInput = () => {
        const { nombre, direccion, telefono, correo, id_colonia, fecha_apertura, hora_apertura, hora_cierre, estado } = nuevaSucursal;

        if (!nombre.trim() || !direccion.trim() || !telefono.trim() || !correo.trim() || !id_colonia || !fecha_apertura.trim() || !hora_apertura.trim() || !hora_cierre.trim() || !estado.trim()) {
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

        if (!/^[A-Za-z0-9,.\s]+$/.test(direccion)) {
            setError('Solo se permiten letras, números, espacios, comas y puntos en la dirección.');
            return false;
        }
        // Validación de no permitir más de dos caracteres repetidos seguidos en la dirección
        if (/(\w)\1\1/.test(direccion)) {
            setError('No se permite la misma letra repetida más de 2 veces consecutivas en la dirección.');
            return false;
        }

        // Validación de al menos 3 palabras en la dirección
        if (direccion.split(/\s+/).length < 3) {
            setError('La dirección debe contener al menos 3 palabras.');
            return false;
        }

        // Validación de no más de un espacio en la dirección
        if (direccion.includes('  ')) {
            setError('No se permiten más de un espacio consecutivo en la dirección.');
            return false;
        }
        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!patronCorreo.test(correo)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return false;
        } const patronTelefono = /^\+504\s[98532]\d{3}-\d{4}$/;
        if (!patronTelefono.test(telefono)) {
            setError('Por favor, introduce un número de teléfono válido con formato +504 9xxx-xxxx, 8xxx-xxxx, 5xxx-xxxx, 3xxx-xxxx o 2xxx-xxxx.');
            return false;
        }

        const fechaActual = new Date();
        const fechaAperturaObj = new Date(fecha_apertura);

        if (fechaAperturaObj > fechaActual) {
            setError('La fecha de apertura no puede ser posterior a la fecha actual.');
            return false;
        }

        // Validación de la hora de apertura y cierre
        const horaAperturaObj = new Date(`01/01/2000 ${hora_apertura}`);
        const horaCierreObj = new Date(`01/01/2000 ${hora_cierre}`);
        const diferenciaHoras = (horaCierreObj - horaAperturaObj) / (1000 * 60 * 60); // Diferencia en horas

        if (diferenciaHoras < 8) {
            setError('La diferencia entre la hora de apertura y cierre debe ser de al menos 8 horas.');
            return false;
        }

        // Validación para permitir solo selecciones por intervalos de 30 minutos
        const minutosApertura = horaAperturaObj.getMinutes();
        const minutosCierre = horaCierreObj.getMinutes();

        if (minutosApertura % 30 !== 0 || minutosCierre % 30 !== 0) {
            setError('Por favor, selecciona horas en intervalos de 30 minutos.');
            return false;
        }

        const horaMinimaApertura = new Date(`01/01/2000 04:00 AM`);
        const horaMaximaApertura = new Date(`01/01/2000 10:00 AM`);

        if (horaAperturaObj < horaMinimaApertura || horaAperturaObj > horaMaximaApertura) {
            setError('La hora de apertura debe estar entre las 4:00 AM y las 10:00 AM.');
            return false;
        }
        return true;
    };

    const handleGuardar = async () => {
        if (validarInput()) {
            try {
                const response = await axios.post('http://localhost:4000/api/sucursales', nuevaSucursal);

                if (response.status === 201) {
                    console.log('Sucursal creada exitosamente');
                    handleGuardarNuevaSucursal();
                } else {
                    console.error('Error al crear la sucursal');
                }
            } catch (error) {
                console.error('Error en la solicitud para agregar sucursal', error);
            } finally {
                setNuevaSucursal({
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    correo: '',
                    id_colonia: '',
                    fecha_apertura: '',
                    hora_apertura: '',
                    hora_cierre: '',
                    estado: '',
                });
                setError('');
                handleClose(); // Cierra el modal después de agregar la sucursal
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nueva Sucursal</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre de la Sucursal"
                            fullWidth
                            value={nuevaSucursal.nombre}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, nombre: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Dirección"
                            fullWidth
                            value={nuevaSucursal.direccion}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, direccion: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Teléfono"
                            fullWidth
                            value={nuevaSucursal.telefono}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, telefono: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Correo Electrónico"
                            fullWidth
                            value={nuevaSucursal.correo}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, correo: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="colonia-label">Colonia</InputLabel>
                            <Select
                                labelId="colonia-label"
                                id="colonia"
                                value={nuevaSucursal.id_colonia}
                                onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, id_colonia: e.target.value })}
                            >
                                {colonias.map((colonia) => (
                                    <MenuItem key={colonia.ID} value={colonia.ID}>
                                        {colonia.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Fecha de Apertura"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={nuevaSucursal.fecha_apertura}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, fecha_apertura: e.target.value })}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Hora de Apertura"
                            fullWidth
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={nuevaSucursal.hora_apertura}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, hora_apertura: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Hora de Cierre"
                            fullWidth
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={nuevaSucursal.hora_cierre}
                            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, hora_cierre: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="estado-label">Estado</InputLabel>
                            <Select
                                labelId="estado-label"
                                id="estado"
                                value={nuevaSucursal.estado}
                                onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, estado: e.target.value })}
                            >
                                <MenuItem value="en servicio">En Servicio</MenuItem>
                                <MenuItem value="fuera de servicio">Fuera de Servicio</MenuItem>
                                <MenuItem value="cerrada">cerrado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
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

export default AgregarSucursal;
