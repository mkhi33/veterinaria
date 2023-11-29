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
import AgregarCorreoCliente from './AgregarCorreoCliente'; // Importa tu componente para agregar correos de clientes
import EditarCorreoCliente from './EditarCorreoCliente'; // Importa tu componente para editar correos de clientes
import Swal from 'sweetalert2';

function CorreoCliente() {
    const [correosClientes, setCorreosClientes] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [correoClienteEditando, setCorreoClienteEditando] = useState(null);

    const obtenerCorreosClientes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/correos-clientes');
            setCorreosClientes(response.data.correosClientes);
        } catch (error) {
            console.error('Error al obtener la lista de correos de clientes', error);
        }
    };

    useEffect(() => {
        obtenerCorreosClientes();
    }, []);

    const handleEliminar = async (correoClienteId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/correos-clientes/${correoClienteId}`);

                    if (response.status === 200) {
                        console.log('Correo de cliente eliminado correctamente');
                        obtenerCorreosClientes();
                    } else {
                        console.error('Error al eliminar el correo de cliente');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar el correo de cliente', error);
                }
            }
        });
    };

    const handleEditar = (correoCliente) => {
        setCorreoClienteEditando(correoCliente);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setCorreoClienteEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevoCorreoCliente = async (nuevoCorreoCliente) => {
        try {
            const response = await axios.post('http://localhost:4000/api/correos-clientes', {
                clienteID: nuevoCorreoCliente.clienteID,
                tipo: nuevoCorreoCliente.tipo,
                direccionCorreo: nuevoCorreoCliente.direccionCorreo,
            });

            if (response.status === 201) {
                console.log('Correo de cliente creado exitosamente');
                obtenerCorreosClientes();
            } else {
                console.error('Error al crear el correo de cliente');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el correo de cliente', error);
        } finally {
            handleCloseModalAgregar();
            obtenerCorreosClientes();
        }
    };

    const handleGuardarEdicionCorreoCliente = async (correoClienteId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/correos-clientes/${correoClienteId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerCorreosClientes();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar el correo de cliente', error);
        } finally {
            setCorreoClienteEditando(null);
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
                Bienvenido a Correo de Cliente
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Correo de Cliente
            </Button>
            <AgregarCorreoCliente
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevoCorreo={handleGuardarNuevoCorreoCliente}
            />
            <EditarCorreoCliente
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                correoCliente={correoClienteEditando}
                handleGuardarEdicion={handleGuardarEdicionCorreoCliente}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre del Cliente</TableCell>
                            <TableCell>Tipo de Correo</TableCell>
                            <TableCell>Dirección de Correo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {correosClientes.map((correoCliente) => (
                            <TableRow key={correoCliente.correoID}>
                                <TableCell>{correoCliente.correoID}</TableCell>
                                <TableCell>{`${correoCliente.nombre_cliente} ${correoCliente.apellido}`}</TableCell>
                                <TableCell>{correoCliente.tipo}</TableCell>
                                <TableCell>{correoCliente.direccionCorreo}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(correoCliente)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(correoCliente.correoID)}
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

export default CorreoCliente;
