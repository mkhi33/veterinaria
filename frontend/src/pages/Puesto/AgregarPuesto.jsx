import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Typography } from '@mui/material';

function AgregarPuesto({ open, handleClose, handleGuardarNuevoPuesto }) {
    const [nuevoPuesto, setNuevoPuesto] = useState({ nombre: '', salario: '' });
    const [error, setError] = useState('');

    const validarInput = () => {
        const { nombre, salario } = nuevoPuesto;

        if (!nombre.trim() || !salario.trim()) {
            setError('Todos los campos son obligatorios.');
            return false;
        }

        const letrasNumerosEspacios = /^[A-Za-z0-9 ]+$/;

        // Validaciones para el nombre
        if (!letrasNumerosEspacios.test(nombre)) {
            setError('Solo se permiten letras, números y espacios en el nombre.');
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos en el nombre
        if (/(\w)\1\1/.test(nombre)) {
            setError('No se permite la misma letra repetida más de 2 veces en el nombre.');
            return false;
        }

        // Validación de no más de un espacio en el nombre
        if (nombre.includes('  ')) {
            setError('No se permiten más de un espacio en el nombre.');
            return false;
        }

        // Validación de al menos 3 letras en el nombre
        if (nombre.length < 3) {
            setError('El nombre debe tener al menos 3 letras.');
            return false;
        }

        // Validación para el salario
        const salarioNum = parseFloat(salario);

        if (salarioNum < 5000 || salarioNum > 50000 || isNaN(salarioNum) || salarioNum < 0) {
            setError('El salario debe estar entre $5000 y $50000 y no puede ser negativo.');
            return false;
        }

        setError('');
        return true;
    };

    const handleGuardar = () => {
        if (validarInput()) {
            handleGuardarNuevoPuesto(nuevoPuesto);
            setNuevoPuesto({ nombre: '', salario: '' });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Puesto</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre del Puesto"
                            fullWidth
                            value={nuevoPuesto.nombre}
                            onChange={(e) => setNuevoPuesto({ ...nuevoPuesto, nombre: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Salario"
                            fullWidth
                            type="number"
                            value={nuevoPuesto.salario}
                            onChange={(e) => setNuevoPuesto({ ...nuevoPuesto, salario: e.target.value })}
                        />
                    </Grid>
                </Grid>
                {error && <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>{error}</Typography>}
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

export default AgregarPuesto;
