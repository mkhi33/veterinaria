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

function AgregarCiudad({ open, handleClose, handleGuardarNuevaCiudad }) {
    const [nuevaCiudad, setNuevaCiudad] = useState({ nombre: '', departamento_id: '' });
    const [departamentos, setDepartamentos] = useState([]);
    const [errors, setErrors] = useState({});

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

    const validateNombre = (input) => {
        // Validación de solo letras y espacios
        const soloLetras = /^[A-Za-z ]+$/;
        if (!soloLetras.test(input)) {
            setErrors({ nombre: 'Solo se permiten letras y espacios.' });
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos
        if (/(\w)\1\1/.test(input)) {
            setErrors({ nombre: 'No se permite la misma letra repetida más de 2 veces.' });
            return false;
        }

        // Validación de no más de un espacio
        if (input.includes('  ')) {
            setErrors({ nombre: 'No se permiten más de un espacio.' });
            return false;
        }

        // Validación de al menos 3 letras
        if (input.length < 3) {
            setErrors({ nombre: 'El nombre debe tener al menos 3 letras.' });
            return false;
        }

        setErrors({}); // Limpiar errores si pasa todas las validaciones
        return true;
    };

    const handleGuardar = () => {
        // Validar el formulario antes de guardar
        if (!validateNombre(nuevaCiudad.nombre) || !nuevaCiudad.departamento_id) {
            setErrors({
                nombre: !nuevaCiudad.nombre.trim() ? 'El nombre de la ciudad es requerido' : '',
                departamento_id: !nuevaCiudad.departamento_id ? 'El departamento es requerido' : 'Seleccione un departamento',
            });
            return;
        }

        // Si pasa la validación, guardar la nueva ciudad y reiniciar el formulario
        handleGuardarNuevaCiudad(nuevaCiudad);
        setNuevaCiudad({ nombre: '', departamento_id: '' });
        setErrors({});
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nueva Ciudad</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre de la Ciudad"
                            fullWidth
                            value={nuevaCiudad.nombre}
                            onChange={(e) => {
                                setNuevaCiudad({ ...nuevaCiudad, nombre: e.target.value });
                                validateNombre(e.target.value);
                            }}
                            error={Boolean(errors.nombre)}
                            helperText={errors.nombre}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth error={Boolean(errors.departamento_id)}>
                            <InputLabel id="departamento-label">Departamento</InputLabel>
                            <Select
                                labelId="departamento-label"
                                id="departamento"
                                value={nuevaCiudad.departamento_id}
                                onChange={(e) =>
                                    setNuevaCiudad({
                                        ...nuevaCiudad,
                                        departamento_id: e.target.value,
                                    })
                                }
                            >
                                {departamentos.map((departamento) => (
                                    <MenuItem key={departamento.ID} value={departamento.ID}>
                                        {departamento.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.departamento_id && (
                                <div style={{ color: 'red' }}>{errors.departamento_id}</div>
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

export default AgregarCiudad;
