import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function EditarDepartamento({ open, handleClose, departamento, handleGuardarEdicion }) {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Actualiza el nombre en el estado cuando el departamento cambia
        if (departamento) {
            setNuevoNombre(departamento.nombre || ''); // Asegúrate de manejar el caso en que el nombre sea null o undefined
        }
    }, [departamento]);

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
        const nombreValido = validarInput(nuevoNombre);

        if (nombreValido) {
            // Verifica que el departamento exista antes de intentar guardar
            if (departamento) {
                handleGuardarEdicion(departamento.ID, { nombre: nuevoNombre });
            }

            // Limpiar el estado y errores después de guardar
            setNuevoNombre('');
            setError('');
        } else {
            // Mostrar mensaje de error
            console.log('Error en la validación del nombre');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Departamento</DialogTitle>
            <DialogContent>
                {/* Verifica que departamento exista antes de acceder a sus propiedades */}
                {departamento && (
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={nuevoNombre}
                        onChange={(e) => {
                            setNuevoNombre(e.target.value);
                            setError(''); // Limpiar el error al cambiar el valor
                        }}
                        error={!!error}
                        helperText={error}
                    />
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

export default EditarDepartamento;
