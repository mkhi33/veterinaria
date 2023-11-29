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
import AgregarDepartamento from './AgregarDepartamento';
import EditarDepartamento from './EditarDepartamento';
import Swal from 'sweetalert2'; // Importa SweetAlert2

function Departamento() {
    const [departamentos, setDepartamentos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [departamentoEditando, setDepartamentoEditando] = useState(null);

    const obtenerDepartamentos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/departamentos');
            setDepartamentos(response.data.departamentos);
        } catch (error) {
            console.error('Error al obtener la lista de departamentos', error);
        }
    };

    useEffect(() => {
        obtenerDepartamentos();
    }, []);

    const handleAgregar = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleGuardarNuevoDepartamento = async (nuevoDepartamento) => {
        try {
            const response = await axios.post('http://localhost:4000/api/departamentos', {
                nombre: nuevoDepartamento.nombre,
            });

            if (response.status === 201) {
                console.log('Departamento creado exitosamente');
                obtenerDepartamentos();
            } else {
                console.error('Error al crear el departamento');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar departamento', error);
        } finally {
            handleCloseModal();
        }
    };

    const handleEditar = (departamento) => {
        setDepartamentoEditando(departamento);
        setOpenModalEditar(true);
    };

    const handleGuardarEdicion = async (departamentoId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/departamentos/${departamentoId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerDepartamentos();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar departamento', error);
        } finally {
            setDepartamentoEditando(null);
            setOpenModalEditar(false);
        }
    };

    const handleEliminar = async (departamentoId) => {
        // Muestra un cuadro de diálogo de confirmación antes de la eliminación
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
                    const response = await axios.delete(`http://localhost:4000/api/departamentos/${departamentoId}`);

                    if (response.status === 200) {
                        console.log('Departamento eliminado correctamente');
                        obtenerDepartamentos();
                    } else {
                        console.error('Error al eliminar el departamento');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar departamento', error);
                }
            }
        });
    };

    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Bienvenido a Departamento
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Departamento
            </Button>
            <AgregarDepartamento
                open={openModal}
                handleClose={handleCloseModal}
                handleGuardarNuevoDepartamento={handleGuardarNuevoDepartamento}
            />
            <EditarDepartamento
                open={openModalEditar}
                handleClose={() => {
                    setDepartamentoEditando(null);
                    setOpenModalEditar(false);
                }}
                departamento={departamentoEditando}
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
                        {departamentos.map((departamento) => (
                            <TableRow key={departamento.ID}>
                                <TableCell>{departamento.ID}</TableCell>
                                <TableCell>{departamento.nombre}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={() => handleEditar(departamento)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleEliminar(departamento.ID)}>
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

export default Departamento;
