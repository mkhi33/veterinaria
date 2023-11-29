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

function AgregarCorreoEmpleado({ open, handleClose, handleGuardarNuevoCorreo }) {
    const [nuevoCorreo, setNuevoCorreo] = useState({ id_empleado: '', tipo: '', correo: '' });
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
    }, []);

    const validarInput = () => {
        const { id_empleado, tipo, correo } = nuevoCorreo;

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
            axios.post('http://localhost:4000/api/correos-empleados', nuevoCorreo)
                .then((response) => {
                    if (response.status === 201) {
                        console.log('Correo de empleado agregado exitosamente');
                        handleGuardarNuevoCorreo();
                    } else {
                        console.error('Error al agregar el correo de empleado');
                    }
                })
                .catch((error) => {
                    console.error('Error en la solicitud para agregar el correo de empleado', error);
                })
                .finally(() => {
                    // Reset the form state after saving
                    setNuevoCorreo({ id_empleado: '', tipo: '', correo: '' });
                    handleClose();
                });
        }
    };

    const tiposCorreo = ['Trabajo', 'Personal'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Correo de Empleado</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="empleado-label">Empleado</InputLabel>
                            <Select
                                labelId="empleado-label"
                                id="empleado"
                                value={nuevoCorreo.id_empleado}
                                onChange={(e) => setNuevoCorreo({ ...nuevoCorreo, id_empleado: e.target.value })}
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
                                value={nuevoCorreo.tipo}
                                onChange={(e) => setNuevoCorreo({ ...nuevoCorreo, tipo: e.target.value })}
                            >
                                {tiposCorreo.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Correo del Empleado"
                            fullWidth
                            value={nuevoCorreo.correo}
                            onChange={(e) => setNuevoCorreo({ ...nuevoCorreo, correo: e.target.value })}
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

export default AgregarCorreoEmpleado;
