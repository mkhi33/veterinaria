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

function EditarTelefonoCliente({ open, handleClose, telefonoCliente, handleGuardarEdicion }) {
    const [nuevoClienteID, setNuevoClienteID] = useState('');
    const [nuevoTipo, setNuevoTipo] = useState('');
    const [nuevoNumeroTelefono, setNuevoNumeroTelefono] = useState('');
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

        // Actualizar el estado cuando cambia la prop telefonoCliente
        if (telefonoCliente) {
            setNuevoClienteID(telefonoCliente.clienteID || '');
            setNuevoTipo(telefonoCliente.tipo || '');
            setNuevoNumeroTelefono(telefonoCliente.numeroTelefono || '');
        }
    }, [telefonoCliente]);

    const handleGuardar = () => {
        // Validar el formulario antes de guardar
        if (!nuevoClienteID || !nuevoTipo || !nuevoNumeroTelefono.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Validar formato del número de teléfono
        const patronTelefono = /^\+504\s[98532]\d{3}-\d{4}$/;
        if (!patronTelefono.test(nuevoNumeroTelefono)) {
            setError('Por favor, introduce un número de teléfono válido con formato +504 9xxx-xxxx, 8xxx-xxxx, 5xxx-xxxx, 3xxx-xxxx o 2xxx-xxxx.');
            return;
        }

        // Verificar que el teléfono de cliente exista antes de intentar guardar
        if (telefonoCliente) {
            handleGuardarEdicion(telefonoCliente.telefonoID, {
                clienteID: nuevoClienteID,
                tipo: nuevoTipo,
                numeroTelefono: nuevoNumeroTelefono,
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Teléfono de Cliente</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="cliente-label">Cliente</InputLabel>
                            <Select
                                labelId="cliente-label"
                                id="cliente"
                                value={nuevoClienteID}
                                onChange={(e) => setNuevoClienteID(e.target.value)}
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
                                value={nuevoTipo}
                                onChange={(e) => setNuevoTipo(e.target.value)}
                            >
                                {['Trabajo', 'Personal'].map((tipo) => (
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
                            value={nuevoNumeroTelefono}
                            onChange={(e) => setNuevoNumeroTelefono(e.target.value)}
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

export default EditarTelefonoCliente;
