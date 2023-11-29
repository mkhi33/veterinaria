import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

function AgregarTipoDocumentoCliente({ open, handleClose, handleGuardarNuevoTipoDocumento }) {
    const [nuevoTipoDocumento, setNuevoTipoDocumento] = useState({ nombre: '' });
    const [error, setError] = useState('');

    const validarInput = (input) => {
        // Validación de solo letras y espacios, permitiendo / y -
        const soloLetrasEspacios = /^[A-Za-z\s/-]+$/;
        if (!soloLetrasEspacios.test(input)) {
            setError('Solo se permiten letras, espacios.');
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

    const handleGuardar = () => {
        if (validarInput(nuevoTipoDocumento.nombre)) {
            handleGuardarNuevoTipoDocumento(nuevoTipoDocumento);
            setNuevoTipoDocumento({ nombre: '' });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Tipo de Documento Cliente</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nombre del Tipo de Documento Cliente"
                    fullWidth
                    value={nuevoTipoDocumento.nombre}
                    onChange={(e) => setNuevoTipoDocumento({ nombre: e.target.value })}
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

export default AgregarTipoDocumentoCliente;
