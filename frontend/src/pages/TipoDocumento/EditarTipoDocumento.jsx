import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function EditarTipoDocumento({ open, handleClose, tipoDocumento, handleGuardarEdicion }) {
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [error, setError] = useState('');

    const validarInput = (input) => {
        // Validación de solo letras y espacios, permitiendo / y -
        const soloLetrasEspacios = /^[A-Za-z\s/-]+$/;
        if (!soloLetrasEspacios.test(input)) {
            setError('Solo se permiten letras, espacios, / y -.');
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

        setError('');
        return true;
    };

    useEffect(() => {
        // Actualiza el nombre en el estado cuando el tipo de documento cambia
        if (tipoDocumento) {
            setNuevoNombre(tipoDocumento.nombre || ''); // Asegúrate de manejar el caso en que el nombre sea null o undefined
        }
    }, [tipoDocumento]);

    const handleGuardar = () => {
        // Verifica que el tipo de documento exista antes de intentar guardar
        if (tipoDocumento) {
            if (validarInput(nuevoNombre)) {
                handleGuardarEdicion(tipoDocumento.id, { nombre: nuevoNombre });
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Tipo de Documento</DialogTitle>
            <DialogContent>
                {/* Verifica que tipoDocumento exista antes de acceder a sus propiedades */}
                {tipoDocumento && (
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
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

export default EditarTipoDocumento;
