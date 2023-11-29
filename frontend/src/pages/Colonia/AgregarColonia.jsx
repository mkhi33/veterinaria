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

function AgregarColonia({ open, handleClose, handleGuardarNuevaColonia }) {
    const [nuevaColonia, setNuevaColonia] = useState({ nombre: '', ciudad_id: '' });
    const [ciudades, setCiudades] = useState([]);
    const [errors, setErrors] = useState({});

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
        // Valida el nombre antes de guardar
        const nombreError = validateNombre(nuevaColonia.nombre);

        // Validar el formulario antes de guardar
        if (nombreError || !nuevaColonia.ciudad_id) {
            setErrors({
                nombre: nombreError || 'El nombre de la colonia es requerido',
                ciudad_id: !nuevaColonia.ciudad_id ? 'La ciudad es requerida' : '',
            });
            return;
        }

        // Si pasa la validación, guardar la nueva colonia y reiniciar el formulario
        handleGuardarNuevaColonia(nuevaColonia);
        setNuevaColonia({ nombre: '', ciudad_id: '' });
        setErrors({});
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nueva Colonia</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre de la Colonia"
                            fullWidth
                            value={nuevaColonia.nombre}
                            onChange={(e) => {
                                setNuevaColonia({ ...nuevaColonia, nombre: e.target.value });
                                validateNombre(e.target.value);
                            }}
                            error={Boolean(errors.nombre)}
                            helperText={errors.nombre}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth error={Boolean(errors.ciudad_id)}>
                            <InputLabel id="ciudad-label">Ciudad</InputLabel>
                            <Select
                                labelId="ciudad-label"
                                id="ciudad"
                                value={nuevaColonia.ciudad_id}
                                onChange={(e) =>
                                    setNuevaColonia({
                                        ...nuevaColonia,
                                        ciudad_id: e.target.value,
                                    })
                                }
                            >
                                {ciudades.map((ciudad) => (
                                    <MenuItem key={ciudad.ID} value={ciudad.ID}>
                                        {ciudad.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.ciudad_id && (
                                <div style={{ color: 'red' }}>{errors.ciudad_id}</div>
                            )}
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

export default AgregarColonia;
