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

function EditarCorreoCliente({ open, handleClose, correoCliente, handleGuardarEdicion }) {
    const [nuevoClienteID, setNuevoClienteID] = useState('');
    const [nuevoTipo, setNuevoTipo] = useState('');
    const [nuevaDireccionCorreo, setNuevaDireccionCorreo] = useState('');
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the list of clients when the component mounts
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/clientes');
                setClientes(response.data.clientes);
            } catch (error) {
                console.error('Error fetching clients', error);
            }
        };

        fetchClientes();

        // Update the state when the correoCliente prop changes
        if (correoCliente) {
            setNuevoClienteID(correoCliente.clienteID || '');
            setNuevoTipo(correoCliente.tipo || '');
            setNuevaDireccionCorreo(correoCliente.direccionCorreo || '');
        }
    }, [correoCliente]);

    const validarInput = () => {
        const { clienteID, tipo, direccionCorreo } = {
            clienteID: nuevoClienteID,
            tipo: nuevoTipo,
            direccionCorreo: nuevaDireccionCorreo,
        };

        if (!clienteID || !tipo || !direccionCorreo.trim()) {
            setError('Todos los campos son obligatorios.');
            return false;
        }

        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!patronCorreo.test(direccionCorreo)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return false;
        }

        setError('');
        return true;
    };

    const handleGuardar = () => {
        // Verifica que el correo de cliente exista antes de intentar guardar
        if (correoCliente && validarInput()) {
            handleGuardarEdicion(correoCliente.correoID, {
                clienteID: nuevoClienteID,
                tipo: nuevoTipo,
                direccionCorreo: nuevaDireccionCorreo,
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Correo de Cliente</DialogTitle>
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
                            label="Dirección de Correo del Cliente"
                            fullWidth
                            value={nuevaDireccionCorreo}
                            onChange={(e) => setNuevaDireccionCorreo(e.target.value)}
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

export default EditarCorreoCliente;
