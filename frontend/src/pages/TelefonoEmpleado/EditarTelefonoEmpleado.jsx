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

function EditarTelefonoEmpleado({ open, handleClose, telefonoEmpleado, handleGuardarEdicion }) {
    const [nuevoIdEmpleado, setNuevoIdEmpleado] = useState('');
    const [nuevoTipo, setNuevoTipo] = useState('');
    const [nuevoTelefono, setNuevoTelefono] = useState('');
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

        // Actualizar el estado cuando cambia la prop telefonoEmpleado
        if (telefonoEmpleado) {
            setNuevoIdEmpleado(telefonoEmpleado.id_empleado || '');
            setNuevoTipo(telefonoEmpleado.tipo || '');
            setNuevoTelefono(telefonoEmpleado.telefono || '');
        }
    }, [telefonoEmpleado]);

    const handleGuardar = () => {
        // Validar el formulario antes de guardar
        if (!nuevoIdEmpleado || !nuevoTipo || !nuevoTelefono.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Validar formato del número de teléfono
        const patronTelefono = /^\+504\s[98532]\d{3}-\d{4}$/;
        if (!patronTelefono.test(nuevoTelefono)) {
            setError('Por favor, introduce un número de teléfono válido con formato +504 9xxx-xxxx, 8xxx-xxxx, 5xxx-xxxx, 3xxx-xxxx o 2xxx-xxxx.');
            return;
        }

        // Realizar la solicitud para guardar la edición del teléfono de empleado
        handleGuardarEdicion(telefonoEmpleado.id, {
            id_empleado: nuevoIdEmpleado,
            tipo: nuevoTipo,
            telefono: nuevoTelefono,
        });

        // Restablecer el estado del formulario después de guardar
        setNuevoIdEmpleado('');
        setNuevoTipo('');
        setNuevoTelefono('');
        setError('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Teléfono de Empleado</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="empleado-label">Empleado</InputLabel>
                            <Select
                                labelId="empleado-label"
                                id="empleado"
                                value={nuevoIdEmpleado}
                                onChange={(e) => setNuevoIdEmpleado(e.target.value)}
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
                                value={nuevoTipo}
                                onChange={(e) => setNuevoTipo(e.target.value)}
                            >
                                <MenuItem value="Trabajo">Trabajo</MenuItem>
                                <MenuItem value="Personal">Personal</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Teléfono del Empleado"
                            fullWidth
                            value={nuevoTelefono}
                            onChange={(e) => setNuevoTelefono(e.target.value)}
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

export default EditarTelefonoEmpleado;
