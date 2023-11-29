import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';

function EditarPuesto({ open, handleClose, puesto, handleGuardarEdicion }) {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoSalario, setNuevoSalario] = useState('');
    const [error, setError] = useState({ nombre: '', salario: '' });

    useEffect(() => {
        // Actualiza el nombre y salario en el estado cuando el puesto cambia
        if (puesto) {
            setNuevoNombre(puesto.nombre || ''); // Asegúrate de manejar el caso en que el nombre sea null o undefined
            setNuevoSalario(puesto.salario || ''); // Asegúrate de manejar el caso en que el salario sea null o undefined
        }
    }, [puesto]);

    const validarInput = () => {
        const errores = { nombre: '', salario: '' };

        // Validaciones para el nombre
        if (!nuevoNombre.trim()) {
            errores.nombre = 'Este campo es obligatorio.';
        }

        const letrasNumerosEspacios = /^[A-Za-z0-9 ]+$/;

        if (!letrasNumerosEspacios.test(nuevoNombre)) {
            errores.nombre = 'Solo se permiten letras, números y espacios en el nombre.';
        }

        // Validación de al menos 3 letras en el nombre
        if (nuevoNombre.length < 3) {
            errores.nombre = 'El nombre debe tener al menos 3 letras.';
        }

        // Validaciones para el salario
        const salarioNum = parseFloat(nuevoSalario);

        if (!nuevoSalario.trim() || isNaN(salarioNum) || salarioNum < 5000 || salarioNum > 50000 || salarioNum < 0) {
            errores.salario = 'El salario debe estar entre $5000 y $50000 y no puede ser negativo.';
        }

        setError(errores);

        return Object.values(errores).every((error) => error === '');
    };

    const handleGuardar = () => {
        if (validarInput() && puesto) {
            handleGuardarEdicion(puesto.id, { nombre: nuevoNombre, salario: nuevoSalario });
            setNuevoNombre('');
            setNuevoSalario('');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Puesto</DialogTitle>
            <DialogContent>
                {/* Verifica que el puesto exista antes de acceder a sus propiedades */}
                {puesto && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                value={nuevoNombre}
                                onChange={(e) => setNuevoNombre(e.target.value)}
                                error={!!error.nombre}
                                helperText={error.nombre}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Salario"
                                fullWidth
                                type="number"
                                value={nuevoSalario}
                                onChange={(e) => setNuevoSalario(e.target.value)}
                                error={!!error.salario}
                                helperText={error.salario}
                            />
                        </Grid>
                    </Grid>
                )}
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

export default EditarPuesto;
