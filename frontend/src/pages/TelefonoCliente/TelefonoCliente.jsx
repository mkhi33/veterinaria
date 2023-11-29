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
import AgregarTelefonoCliente from './AgregarTelefonoCliente'; // Importa tu componente para agregar teléfonos de clientes
import EditarTelefonoCliente from './EditarTelefonoCliente'; // Importa tu componente para editar teléfonos de clientes
import Swal from 'sweetalert2';

function TelefonoCliente() {
    const [telefonosClientes, setTelefonosClientes] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [telefonoClienteEditando, setTelefonoClienteEditando] = useState(null);

    const obtenerTelefonosClientes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/telefonos-clientes');
            setTelefonosClientes(response.data.telefonosClientes);
        } catch (error) {
            console.error('Error al obtener la lista de teléfonos de clientes', error);
        }
    };

    useEffect(() => {
        obtenerTelefonosClientes();
    }, []);

    const handleEliminar = async (telefonoClienteId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/telefonos-clientes/${telefonoClienteId}`);

                    if (response.status === 200) {
                        console.log('Teléfono de cliente eliminado correctamente');
                        obtenerTelefonosClientes();
                    } else {
                        console.error('Error al eliminar el teléfono de cliente');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar el teléfono de cliente', error);
                }
            }
        });
    };

    const handleEditar = (telefonoCliente) => {
        setTelefonoClienteEditando(telefonoCliente);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setTelefonoClienteEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevoTelefonoCliente = async (nuevoTelefonoCliente) => {
        try {
            const response = await axios.post('http://localhost:4000/api/telefonos-clientes', {
                clienteID: nuevoTelefonoCliente.clienteID,
                tipo: nuevoTelefonoCliente.tipo,
                numeroTelefono: nuevoTelefonoCliente.numeroTelefono,
            });

            if (response.status === 201) {
                console.log('Teléfono de cliente creado exitosamente');
                obtenerTelefonosClientes();
            } else {
                console.error('Error al crear el teléfono de cliente');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el teléfono de cliente', error);
        } finally {
            handleCloseModalAgregar();
            obtenerTelefonosClientes();
        }
    };

    const handleGuardarEdicionTelefonoCliente = async (telefonoClienteId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/telefonos-clientes/${telefonoClienteId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerTelefonosClientes();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar el teléfono de cliente', error);
        } finally {
            setTelefonoClienteEditando(null);
            setOpenModalEditar(false);
        }
    };

    const handleAgregar = () => {
        setOpenModalAgregar(true);
    };

    const handleCloseModalAgregar = () => {
        setOpenModalAgregar(false);
    };

    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Bienvenido a Teléfono de Cliente
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Teléfono de Cliente
            </Button>
            <AgregarTelefonoCliente
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevoTelefono={handleGuardarNuevoTelefonoCliente}
            />
            <EditarTelefonoCliente
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                telefonoCliente={telefonoClienteEditando}
                handleGuardarEdicion={handleGuardarEdicionTelefonoCliente}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre del Cliente</TableCell>
                            <TableCell>Tipo de Teléfono</TableCell>
                            <TableCell>Número de Teléfono</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {telefonosClientes.map((telefonoCliente) => (
                            <TableRow key={telefonoCliente.telefonoID}>
                                <TableCell>{telefonoCliente.telefonoID}</TableCell>
                                <TableCell>{`${telefonoCliente.nombre_cliente} ${telefonoCliente.apellido}`}</TableCell>
                                <TableCell>{telefonoCliente.tipo}</TableCell>
                                <TableCell>{telefonoCliente.numeroTelefono}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(telefonoCliente)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(telefonoCliente.telefonoID)}
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

export default TelefonoCliente;
