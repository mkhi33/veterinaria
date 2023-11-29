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
    // Validación de solo letras y espacios
    const soloLetras = /^[A-Za-z ]+$/;
    if (!soloLetras.test(input)) {
        return 'Solo se permiten letras y espacios.';
    }

    // Validación de no permitir más de dos caracteres repetidos seguidos
    if (/(\w)\1\1/.test(input)) {
        return 'No se permite la misma letra repetida más de 2 veces.';
    }

    // Validación de no más de un espacio
    if (input.includes('  ')) {
        return 'No se permiten más de un espacio.';
    }

    // Validación de al menos 3 letras
    if (input.length < 3) {
        return 'El nombre debe tener al menos 3 letras.';
    }

    return ''; // Sin errores si pasa todas las validaciones
};

function EditarCiudad({ open, handleClose, ciudad, handleGuardarEdicion }) {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoDepartamentoId, setNuevoDepartamentoId] = useState('');
    const [departamentos, setDepartamentos] = useState([]);
    const [errors, setErrors] = useState({ nombre: '' });

    useEffect(() => {
        // Actualiza el nombre y el departamento en el estado cuando la ciudad cambia
        if (ciudad) {
            setNuevoNombre(ciudad.nombre || ''); // Asegúrate de manejar el caso en que el nombre sea null o undefined
            setNuevoDepartamentoId(ciudad.departamento_id || '');
        }
    }, [ciudad]);

    useEffect(() => {
        // Cargar la lista de departamentos al abrir el modal
        const obtenerDepartamentos = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/departamentos');
                setDepartamentos(response.data.departamentos);
            } catch (error) {
                console.error('Error al obtener la lista de departamentos', error);
            }
        };

        obtenerDepartamentos();
    }, []);

    const handleGuardar = () => {
        // Valida el nombre antes de guardar
        const nombreError = validateNombre(nuevoNombre);

        // Verifica que la ciudad exista antes de intentar guardar
        if (ciudad) {
            setErrors({ nombre: nombreError });

            // Si hay errores en el nombre, no intentar guardar
            if (nombreError) {
                return;
            }

            handleGuardarEdicion(ciudad.ID, { nombre: nuevoNombre, departamento_id: nuevoDepartamentoId });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ marginBottom: '20px' }}>Editar Ciudad</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            error={Boolean(errors.nombre)}
                            helperText={errors.nombre}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="departamento-label">Departamento</InputLabel>
                            <Select
                                labelId="departamento-label"
                                id="departamento"
                                value={nuevoDepartamentoId}
                                onChange={(e) => setNuevoDepartamentoId(e.target.value)}
                            >
                                {departamentos.map((departamento) => (
                                    <MenuItem key={departamento.ID} value={departamento.ID}>
                                        {departamento.nombre}
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

export default EditarCiudad;
