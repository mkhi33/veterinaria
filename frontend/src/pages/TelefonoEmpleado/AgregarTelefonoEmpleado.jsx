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

function AgregarTelefonoEmpleado({ open, handleClose, handleGuardarNuevoTelefono }) {
    const [nuevoTelefono, setNuevoTelefono] = useState({ id_empleado: '', tipo: '', telefono: '' });
    const [empleados, setEmpleados] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Obtener la lista de empleados al cargar el componente
        const fetchEmpleados = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/empleados');
                setEmpleados(response.data.empleados);
            } catch (error) {
                console.error('Error al obtener la lista de empleados', error);
            }
        };

        fetchEmpleados();
    }, []);

    const handleGuardar = async () => {
        // Validar el formulario antes de guardar
        if (!nuevoTelefono.id_empleado || !nuevoTelefono.tipo || !nuevoTelefono.telefono.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Validar formato del número de teléfono
        const patronTelefono = /^\+504\s[98532]\d{3}-\d{4}$/;
        if (!patronTelefono.test(nuevoTelefono.telefono)) {
            setError('Por favor, introduce un número de teléfono válido con formato +504 9xxx-xxxx, 8xxx-xxxx, 5xxx-xxxx, 3xxx-xxxx o 2xxx-xxxx.');
            return;
        }

        try {
            // Realizar la solicitud para agregar el teléfono de empleado
            const response = await axios.post('http://localhost:4000/api/telefonos-empleados', nuevoTelefono);

            if (response.status === 201) {
                console.log('Teléfono de empleado agregado exitosamente');
                handleGuardarNuevoTelefono();
            } else {
                console.error('Error al agregar el teléfono de empleado');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el teléfono de empleado', error);
        } finally {
            // Restablecer el estado del formulario después de guardar
            setNuevoTelefono({ id_empleado: '', tipo: '', telefono: '' });
            setError('');
            handleClose();
        }
    };

    const tiposTelefono = ['Trabajo', 'Personal'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Teléfono de Empleado</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="empleado-label">Empleado</InputLabel>
                            <Select
                                labelId="empleado-label"
                                id="empleado"
                                value={nuevoTelefono.id_empleado}
                                onChange={(e) => setNuevoTelefono({ ...nuevoTelefono, id_empleado: e.target.value })}
                            >
                                {empleados.map((empleado) => (
                                    <MenuItem key={empleado.id} value={empleado.id}>
                                        {empleado.nombre} {empleado.apellido}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="tipo-telefono-label">Tipo de Teléfono</InputLabel>
                            <Select
                                labelId="tipo-telefono-label"
                                id="tipo-telefono"
                                value={nuevoTelefono.tipo}
                                onChange={(e) => setNuevoTelefono({ ...nuevoTelefono, tipo: e.target.value })}
                            >
                                {tiposTelefono.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Teléfono del Empleado"
                            fullWidth
                            value={nuevoTelefono.telefono}
                            onChange={(e) => setNuevoTelefono({ ...nuevoTelefono, telefono: e.target.value })}
                        />
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

export default AgregarTelefonoEmpleado;
