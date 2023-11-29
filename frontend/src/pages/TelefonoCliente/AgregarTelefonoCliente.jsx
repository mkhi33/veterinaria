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

function AgregarTelefonoCliente({ open, handleClose, handleGuardarNuevoTelefono }) {
    const [nuevoTelefono, setNuevoTelefono] = useState({ clienteID: '', tipo: '', numeroTelefono: '' });
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Obtener la lista de clientes al cargar el componente
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/clientes');
                setClientes(response.data.clientes);
            } catch (error) {
                console.error('Error al obtener la lista de clientes', error);
            }
        };

        fetchClientes();
    }, []);

    const handleGuardar = async () => {
        // Validar el formulario antes de guardar
        if (!nuevoTelefono.clienteID || !nuevoTelefono.tipo || !nuevoTelefono.numeroTelefono.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Validar formato del número de teléfono
        const patronTelefono = /^\+504\s[98532]\d{3}-\d{4}$/;
        if (!patronTelefono.test(nuevoTelefono.numeroTelefono)) {
            setError('Por favor, introduce un número de teléfono válido con formato +504 9xxx-xxxx, 8xxx-xxxx, 5xxx-xxxx, 3xxx-xxxx o 2xxx-xxxx.');
            return;
        }

        try {
            // Realizar la solicitud para agregar el teléfono de cliente
            const response = await axios.post('http://localhost:4000/api/telefonos-clientes', nuevoTelefono);

            if (response.status === 201) {
                console.log('Teléfono de cliente agregado exitosamente');
                handleGuardarNuevoTelefono();
            } else {
                console.error('Error al agregar el teléfono de cliente');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el teléfono de cliente', error);
        } finally {
            // Restablecer el estado del formulario después de guardar
            setNuevoTelefono({ clienteID: '', tipo: '', numeroTelefono: '' });
            setError('');
            handleClose();
        }
    };

    const tiposTelefono = ['Trabajo', 'Personal'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Teléfono de Cliente</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="cliente-label">Cliente</InputLabel>
                            <Select
                                labelId="cliente-label"
                                id="cliente"
                                value={nuevoTelefono.clienteID}
                                onChange={(e) => setNuevoTelefono({ ...nuevoTelefono, clienteID: e.target.value })}
                            >
                                {clientes.map((cliente) => (
                                    <MenuItem key={cliente.clienteID} value={cliente.clienteID}>
                                        {cliente.nombre} {cliente.apellido}
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
                            label="Número de Teléfono del Cliente"
                            fullWidth
                            value={nuevoTelefono.numeroTelefono}
                            onChange={(e) => setNuevoTelefono({ ...nuevoTelefono, numeroTelefono: e.target.value })}
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

export default AgregarTelefonoCliente;
