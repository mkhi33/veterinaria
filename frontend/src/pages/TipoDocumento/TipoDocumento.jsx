import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
} from '@mui/material';
import Plantilla from '../plantilla';
import AgregarTipoDocumento from './AgregarTipoDocumento';
import EditarTipoDocumento from './EditarTipoDocumento';
import Swal from 'sweetalert2';

function TipoDocumento() {
    const [tiposDocumentos, setTiposDocumentos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [tipoDocumentoEditando, setTipoDocumentoEditando] = useState(null);

    const obtenerTiposDocumentos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/tipos_documentos');
            setTiposDocumentos(response.data.tiposDocumento); // Corregido: 'tiposDocumento' a 'tiposDocumentos'
        } catch (error) {
            console.error('Error al obtener la lista de tipos de documentos', error);
        }
    };

    useEffect(() => {
        obtenerTiposDocumentos();
    }, []);

    const handleAgregar = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleGuardarNuevoTipoDocumento = async (nuevoTipoDocumento) => {
        try {
            const response = await axios.post('http://localhost:4000/api/tipos_documentos', {
                nombre: nuevoTipoDocumento.nombre,
            });

            if (response.status === 201) {
                console.log('Tipo de documento creado exitosamente');
                obtenerTiposDocumentos();
            } else {
                console.error('Error al crear el tipo de documento');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar tipo de documento', error);
        } finally {
            handleCloseModal();
        }
    };

    const handleEditar = (tipoDocumento) => {
        setTipoDocumentoEditando(tipoDocumento);
        setOpenModalEditar(true);
    };

    const handleGuardarEdicion = async (tipoDocumentoId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/tipos_documentos/${tipoDocumentoId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerTiposDocumentos();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar tipo de documento', error);
        } finally {
            setTipoDocumentoEditando(null);
            setOpenModalEditar(false);
        }
    };

    const handleEliminar = async (tipoDocumentoId) => {
        Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: 'No es posible recuperar información eliminada.',
            showCancelButton: true,
            confirmButtonText: 'Sí, Borrar',
            cancelButtonText: 'No, No Borrar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:4000/api/tipos_documentos/${tipoDocumentoId}`);

                    if (response.status === 200) {
                        console.log('Tipo de documento eliminado correctamente');
                        obtenerTiposDocumentos();
                    } else {
                        console.error('Error al eliminar el tipo de documento');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar tipo de documento', error);
                }
            }
        });
    };

    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Bienvenido a Tipo de Documento
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Tipo de Documento
            </Button>
            <AgregarTipoDocumento
                open={openModal}
                handleClose={handleCloseModal}
                handleGuardarNuevoTipoDocumento={handleGuardarNuevoTipoDocumento}
            />
            <EditarTipoDocumento
                open={openModalEditar}
                handleClose={() => {
                    setTipoDocumentoEditando(null);
                    setOpenModalEditar(false);
                }}
                tipoDocumento={tipoDocumentoEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tiposDocumentos.map((tipoDocumento) => (
                            <TableRow key={tipoDocumento.id}>
                                <TableCell>{tipoDocumento.id}</TableCell>
                                <TableCell>{tipoDocumento.nombre}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={() => handleEditar(tipoDocumento)}>
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(tipoDocumento.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Plantilla>
    );
}

export default TipoDocumento;
