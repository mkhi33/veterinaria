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

function EditarCorreoEmpleado({ open, handleClose, correoEmpleado, handleGuardarEdicion }) {
    const [nuevoIdEmpleado, setNuevoIdEmpleado] = useState('');
    const [nuevoTipo, setNuevoTipo] = useState('');
    const [nuevoCorreo, setNuevoCorreo] = useState('');
    const [empleados, setEmpleados] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the list of employees when the component mounts
        const fetchEmpleados = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/empleados');
                setEmpleados(response.data.empleados);
            } catch (error) {
                console.error('Error fetching employees', error);
            }
        };

        fetchEmpleados();

        // Update the state when the correoEmpleado prop changes
        if (correoEmpleado) {
            setNuevoIdEmpleado(correoEmpleado.id_empleado || '');
            setNuevoTipo(correoEmpleado.tipo || '');
            setNuevoCorreo(correoEmpleado.correo || '');
        }
    }, [correoEmpleado]);

    const validarInput = () => {
        const { id_empleado, tipo, correo } = { id_empleado: nuevoIdEmpleado, tipo: nuevoTipo, correo: nuevoCorreo };

        if (!id_empleado || !tipo || !correo.trim()) {
            setError('Todos los campos son obligatorios.');
            return false;
        }

        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!patronCorreo.test(correo)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return false;
        }

        setError('');
        return true;
    };

    const handleGuardar = () => {
        if (validarInput()) {
            // Verifica que el correo de empleado exista antes de intentar guardar
            handleGuardarEdicion(correoEmpleado.id, {
                id_empleado: nuevoIdEmpleado,
                tipo: nuevoTipo,
                correo: nuevoCorreo,
            });
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Correo de Empleado</DialogTitle>
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
                            <InputLabel id="tipo-correo-label">Tipo de Correo</InputLabel>
                            <Select
                                labelId="tipo-correo-label"
                                id="tipo-correo"
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
                            label="Correo del Empleado"
                            fullWidth
                            value={nuevoCorreo}
                            onChange={(e) => setNuevoCorreo(e.target.value)}
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

export default EditarCorreoEmpleado;
