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
import AgregarPuesto from './AgregarPuesto';
import EditarPuesto from './EditarPuesto';
import Swal from 'sweetalert2'; // Importa SweetAlert2

function Puesto() {
    const [puestos, setPuestos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [puestoEditando, setPuestoEditando] = useState(null);

    const obtenerPuestos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/puestos');
            setPuestos(response.data.puestos);
        } catch (error) {
            console.error('Error al obtener la lista de puestos', error);
        }
    };

    useEffect(() => {
        obtenerPuestos();
    }, []);

    const handleAgregar = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleGuardarNuevoPuesto = async (nuevoPuesto) => {
        try {
            const response = await axios.post('http://localhost:4000/api/puestos', {
                nombre: nuevoPuesto.nombre,
                salario: nuevoPuesto.salario,
            });

            if (response.status === 201) {
                console.log('Puesto creado exitosamente');
                obtenerPuestos();
            } else {
                console.error('Error al crear el puesto');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar puesto', error);
        } finally {
            handleCloseModal();
        }
    };

    const handleEditar = (puesto) => {
        setPuestoEditando(puesto);
        setOpenModalEditar(true);
    };

    const handleGuardarEdicion = async (puestoId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/puestos/${puestoId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerPuestos();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar puesto', error);
        } finally {
            setPuestoEditando(null);
            setOpenModalEditar(false);
        }
    };

    const handleEliminar = async (puestoId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/puestos/${puestoId}`);

                    if (response.status === 200) {
                        console.log('Puesto eliminado correctamente');
                        obtenerPuestos();
                    } else {
                        console.error('Error al eliminar el puesto');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar puesto', error);
                }
            }
        });
    };

    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Bienvenido a Puesto
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Puesto
            </Button>
            <AgregarPuesto
                open={openModal}
                handleClose={handleCloseModal}
                handleGuardarNuevoPuesto={handleGuardarNuevoPuesto}
            />
            <EditarPuesto
                open={openModalEditar}
                handleClose={() => {
                    setPuestoEditando(null);
                    setOpenModalEditar(false);
                }}
                puesto={puestoEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Salario</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {puestos.map((puesto) => (
                            <TableRow key={puesto.id}>
                                <TableCell>{puesto.id}</TableCell>
                                <TableCell>{puesto.nombre}</TableCell>
                                <TableCell>{puesto.salario}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={() => handleEditar(puesto)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleEliminar(puesto.id)}>
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

export default Puesto;
