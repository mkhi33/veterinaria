import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

function AgregarDepartamento({ open, handleClose, handleGuardarNuevoDepartamento }) {
    const [nuevoDepartamento, setNuevoDepartamento] = useState({ nombre: '' });
    const [error, setError] = useState('');

    const validarInput = (input) => {
        // Validación de solo letras, sin puntos ni caracteres raros
        const soloLetras = /^[A-Za-z ]+$/;
        if (!soloLetras.test(input)) {
            setError('Solo se permiten letras y espacios.');
            return false;
        }

        // Validación de no permitir más de dos caracteres repetidos seguidos
        if (/(\w)\1\1/.test(input)) {
            setError('No se permite la misma letra repetida más de 2 veces.');
            return false;
        }

        // Validación de no más de un espacio
        if (input.includes('  ')) {
            setError('No se permiten más de un espacio.');
            return false;
        }

        // Validación de al menos 3 letras
        if (input.length < 3) {
            setError('El nombre debe tener al menos 3 letras.');
            return false;
        }

        return true;
    };

    const handleGuardar = () => {
        const nombreValido = validarInput(nuevoDepartamento.nombre);

        if (nombreValido) {
            // Convertir la primera letra a mayúscula y guardar
            const nombreFormateado = nuevoDepartamento.nombre.charAt(0).toUpperCase() + nuevoDepartamento.nombre.slice(1).toLowerCase();
            handleGuardarNuevoDepartamento({ nombre: nombreFormateado });
            setNuevoDepartamento({ nombre: '' });
            setError('');
        } else {
            // Mostrar mensaje de error
            console.log('Error en la validación del nombre');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Departamento</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nombre del Departamento"
                    fullWidth
                    value={nuevoDepartamento.nombre}
                    onChange={(e) => setNuevoDepartamento({ nombre: e.target.value })}
                    error={!!error}
                    helperText={error}
                />
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

export default AgregarDepartamento;