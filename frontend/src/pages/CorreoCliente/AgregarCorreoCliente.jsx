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

function AgregarCorreoCliente({ open, handleClose, handleGuardarNuevoCorreo }) {
    const [nuevoCorreo, setNuevoCorreo] = useState({ clienteID: '', tipo: '', direccionCorreo: '' });
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
    }, []);

    const validarInput = () => {
        const { clienteID, tipo, direccionCorreo } = nuevoCorreo;

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

    const handleGuardar = async () => {
        if (!validarInput()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/correos-clientes', nuevoCorreo);

            if (response.status === 201) {
                console.log('Correo de cliente agregado exitosamente');
                handleGuardarNuevoCorreo();
            } else {
                console.error('Error al agregar el correo de cliente');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el correo de cliente', error);
        } finally {
            // Reset the form state after saving
            setNuevoCorreo({ clienteID: '', tipo: '', direccionCorreo: '' });
            handleClose();
        }
    };

    const tiposCorreo = ['Trabajo', 'Personal'];

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Correo de Cliente</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="cliente-label">Cliente</InputLabel>
                            <Select
                                labelId="cliente-label"
                                id="cliente"
                                value={nuevoCorreo.clienteID}
                                onChange={(e) => setNuevoCorreo({ ...nuevoCorreo, clienteID: e.target.value })}
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
                            label="Dirección de Correo del Cliente"
                            fullWidth
                            value={nuevoCorreo.direccionCorreo}
                            onChange={(e) => setNuevoCorreo({ ...nuevoCorreo, direccionCorreo: e.target.value })}
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

export default AgregarCorreoCliente;
