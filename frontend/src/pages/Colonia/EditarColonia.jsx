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

// Función de validación del nombre
export const validateNombre = (input) => {
    // Validación de letras y números
    const letrasYNumeros = /^[A-Za-z0-9 ]+$/;
    if (!letrasYNumeros.test(input)) {
        return 'Solo se permiten letras, números y espacios.';
    }

    // Validación de no más de un espacio
    if (input.includes('  ')) {
        return 'No se permiten más de un espacio.';
    }

    // Validación de no más de dos caracteres consecutivos repetidos
    if (/(\w)\1\1/.test(input)) {
        return 'No se permiten más de dos caracteres consecutivos repetidos.';
    }

    // Validación de al menos 3 caracteres
    if (input.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres.';
    }

    return ''; // Sin errores si pasa todas las validaciones
};

function EditarColonia({ open, handleClose, colonia, handleGuardarEdicion }) {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaCiudadId, setNuevaCiudadId] = useState('');
    const [ciudades, setCiudades] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Actualiza el nombre y la ciudad en el estado cuando la colonia cambia
        if (colonia) {
            setNuevoNombre(colonia.nombre || ''); // Asegúrate de manejar el caso en que el nombre sea null o undefined
            setNuevaCiudadId(colonia.ciudad_id || '');
        }
    }, [colonia]);

    useEffect(() => {
        // Cargar la lista de ciudades al abrir el modal
        const obtenerCiudades = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ciudades');
                setCiudades(response.data.ciudades);
            } catch (error) {
                console.error('Error al obtener la lista de ciudades', error);
            }
        };

        obtenerCiudades();
    }, []);

    const handleGuardar = () => {
        // Verifica que la colonia exista antes de intentar guardar
        if (colonia) {
            const nombreValidation = validateNombre(nuevoNombre);
            if (nombreValidation) {
                setError(nombreValidation);
            } else {
                setError('');
                handleGuardarEdicion(colonia.ID, { nombre: nuevoNombre, ciudad_id: nuevaCiudadId });
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Colonia</DialogTitle>
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
                        <FormControl fullWidth>
                            <InputLabel id="ciudad-label">Ciudad</InputLabel>
                            <Select
                                labelId="ciudad-label"
                                id="ciudad"
                                value={nuevaCiudadId}
                                onChange={(e) => setNuevaCiudadId(e.target.value)}
                            >
                                {ciudades.map((ciudad) => (
                                    <MenuItem key={ciudad.ID} value={ciudad.ID}>
                                        {ciudad.nombre}
                                    </MenuItem>
                                ))}
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

export default EditarColonia;
