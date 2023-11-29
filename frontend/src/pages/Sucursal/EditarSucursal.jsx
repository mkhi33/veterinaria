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

function EditarSucursal({ open, handleClose, sucursal, handleGuardarEdicion }) {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaDireccion, setNuevaDireccion] = useState('');
    const [nuevoTelefono, setNuevoTelefono] = useState('');
    const [nuevoCorreo, setNuevoCorreo] = useState('');
    const [nuevaColoniaId, setNuevaColoniaId] = useState('');
    const [nuevaFechaApertura, setNuevaFechaApertura] = useState('');
    const [nuevaHoraApertura, setNuevaHoraApertura] = useState('');
    const [nuevaHoraCierre, setNuevaHoraCierre] = useState('');
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [colonias, setColonias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Actualiza los datos en el estado cuando la sucursal cambia
        if (sucursal) {
            setNuevoNombre(sucursal.nombre || '');
            setNuevaDireccion(sucursal.direccion || '');
            setNuevoTelefono(sucursal.telefono || '');
            setNuevoCorreo(sucursal.correo || '');
            setNuevaColoniaId(sucursal.id_colonia || '');
            setNuevaFechaApertura(sucursal.fecha_apertura || '');
            setNuevaHoraApertura(sucursal.hora_apertura || '');
            setNuevaHoraCierre(sucursal.hora_cierre || '');
            setNuevoEstado(sucursal.estado || '');
        }
    }, [sucursal]);

    useEffect(() => {
        // Cargar la lista de colonias al abrir el modal
        const obtenerColonias = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/colonias');
                setColonias(response.data.colonias);
            } catch (error) {
                console.error('Error al obtener la lista de colonias', error);
                setError('Error al cargar las colonias');
            }
        };

        obtenerColonias();
    }, []);

    const validarInput = () => {
        if (
            !nuevoNombre.trim() ||
            !nuevaDireccion.trim() ||
            !nuevoTelefono.trim() ||
            !nuevoCorreo.trim() ||
            !nuevaColoniaId ||
            !nuevaFechaApertura.trim() ||
            !nuevaHoraApertura.trim() ||
            !nuevaHoraCierre.trim() ||
            !nuevoEstado.trim()
        ) {
            setError('Todos los campos son obligatorios.');
            return false;
        }

        const letrasNumerosEspacios = /^[A-Za-z0-9 ]+$/;

        // Validaciones para el nombre
        if (!letrasNumerosEspacios.test(nuevoNombre)) {
            setError('Solo se permiten letras, números y espacios en el nombre.');
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos en el nombre
        if (/(\w)\1\1/.test(nuevoNombre)) {
            setError('No se permite la misma letra repetida más de 2 veces en el nombre.');
            return false;
        }

        // Validación de no más de un espacio en el nombre
        if (nuevoNombre.includes('  ')) {
            setError('No se permiten más de un espacio en el nombre.');
            return false;
        }

        // Validación de al menos 3 letras en el nombre
        if (nuevoNombre.length < 3) {
            setError('El nombre debe tener al menos 3 letras.');
            return false;
        }

        // Validaciones para la dirección
        if (!/^[A-Za-z0-9,.\s]+$/.test(nuevaDireccion)) {
            setError('Solo se permiten letras, números, espacios, comas y puntos en la dirección.');
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos en la dirección
        if (/(\w)\1\1/.test(nuevaDireccion)) {
            setError('No se permite la misma letra repetida más de 2 veces consecutivas en la dirección.');
            return false;
        }

        // Validación de al menos 3 palabras en la dirección
        if (nuevaDireccion.split(/\s+/).length < 3) {
            setError('La dirección debe contener al menos 3 palabras.');
            return false;
        }

        // Validación de no más de un espacio en la dirección
        if (nuevaDireccion.includes('  ')) {
            setError('No se permiten más de un espacio consecutivo en la dirección.');
            return false;
        }

        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!patronCorreo.test(nuevoCorreo)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return false;
        }

        const patronTelefono = /^\+504\s[98532]\d{3}-\d{4}$/;
        if (!patronTelefono.test(nuevoTelefono)) {
            setError(
                'Por favor, introduce un número de teléfono válido con formato +504 9xxx-xxxx, 8xxx-xxxx, 5xxx-xxxx, 3xxx-xxxx o 2xxx-xxxx.'
            );
            return false;
        }

        const fechaActual = new Date();
        const fechaAperturaObj = new Date(nuevaFechaApertura);

        if (fechaAperturaObj > fechaActual) {
            setError('La fecha de apertura no puede ser posterior a la fecha actual.');
            return false;
        }

        // Validación de la hora de apertura y cierre
        const horaAperturaObj = new Date(`01/01/2000 ${nuevaHoraApertura}`);
        const horaCierreObj = new Date(`01/01/2000 ${nuevaHoraCierre}`);
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

    const handleGuardar = () => {
        // Verifica que la sucursal exista antes de intentar guardar
        if (sucursal && validarInput()) {
            handleGuardarEdicion(sucursal.id, {
                nombre: nuevoNombre,
                direccion: nuevaDireccion,
                telefono: nuevoTelefono,
                correo: nuevoCorreo,
                id_colonia: nuevaColoniaId,
                fecha_apertura: nuevaFechaApertura,
                hora_apertura: nuevaHoraApertura,
                hora_cierre: nuevaHoraCierre,
                estado: nuevoEstado,
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Sucursal</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Dirección"
                            fullWidth
                            value={nuevaDireccion}
                            onChange={(e) => setNuevaDireccion(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Teléfono"
                            fullWidth
                            value={nuevoTelefono}
                            onChange={(e) => setNuevoTelefono(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Correo Electrónico"
                            fullWidth
                            value={nuevoCorreo}
                            onChange={(e) => setNuevoCorreo(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="colonia-label">Colonia</InputLabel>
                            <Select
                                labelId="colonia-label"
                                id="colonia"
                                value={nuevaColoniaId}
                                onChange={(e) => setNuevaColoniaId(e.target.value)}
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
                            value={nuevaFechaApertura}
                            onChange={(e) => setNuevaFechaApertura(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Hora de Apertura"
                            fullWidth
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={nuevaHoraApertura}
                            onChange={(e) => setNuevaHoraApertura(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Hora de Cierre"
                            fullWidth
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={nuevaHoraCierre}
                            onChange={(e) => setNuevaHoraCierre(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="estado-label">Estado</InputLabel>
                            <Select
                                labelId="estado-label"
                                id="estado"
                                value={nuevoEstado}
                                onChange={(e) => setNuevoEstado(e.target.value)}
                            >
                                <MenuItem value="en servicio">En Servicio</MenuItem>
                                <MenuItem value="fuera de servicio">Fuera de Servicio</MenuItem>
                                <MenuItem value="cerrado">Cerrado</MenuItem>
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

export default EditarSucursal;
