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
import AgregarCliente from './AgregarCliente'; // Importa tu componente para agregar clientes
import EditarCliente from './EditarCliente'; // Importa tu componente para editar clientes
import Swal from 'sweetalert2';

function Cliente() {
    const [clientes, setClientes] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);

    const obtenerClientes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/clientes');
            setClientes(response.data.clientes);
        } catch (error) {
            console.error('Error al obtener la lista de clientes', error);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    const handleEliminar = async (clienteId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/clientes/${clienteId}`);

                    if (response.status === 200) {
                        console.log('Cliente eliminado correctamente');
                        obtenerClientes();
                    } else {
                        console.error('Error al eliminar el cliente');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar cliente', error);
                }
            }
        });
    };

    const handleEditar = (cliente) => {
        setClienteEditando(cliente);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setClienteEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevoCliente = async (nuevoCliente) => {
        try {
            const response = await axios.post('http://localhost:4000/api/clientes', nuevoCliente);

            if (response.status === 201) {
                console.log('Cliente creado exitosamente');
            } else {
                console.error('Error al crear el cliente');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar cliente', error);
        } finally {
            obtenerClientes();
            handleCloseModalAgregar();
        }
    };

    // PUT para actualizar un cliente
    const handleGuardarEdicion = async (clienteId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/clientes/${clienteId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar cliente', error);
        } finally {
            obtenerClientes();
            setClienteEditando(null);
            setOpenModalEditar(false); // Cierra el modal después de editar el cliente
        }
    };

    const handleAgregar = () => {
        setOpenModalAgregar(true);
    };

    const handleCloseModalAgregar = () => {
        setOpenModalAgregar(false);
    };

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return fechaObj.toLocaleDateString(undefined, opciones);
    };

    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Bienvenido a Cliente
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Cliente
            </Button>
            <AgregarCliente
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevoCliente={handleGuardarNuevoCliente}
            />
            <EditarCliente
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                cliente={clienteEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tipo Documento</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Fecha Nacimiento</TableCell>
                            <TableCell>Género</TableCell>
                            <TableCell>Estado Civil</TableCell>
                            <TableCell>RTN</TableCell>
                            <TableCell>Número Documento</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.clienteID}>
                                <TableCell>{cliente.clienteID}</TableCell>
                                <TableCell>{cliente.nombre_documento}</TableCell>
                                <TableCell>{cliente.nombre}</TableCell>
                                <TableCell>{cliente.apellido}</TableCell>
                                <TableCell>{formatearFecha(cliente.fechaNacimiento)}</TableCell>
                                <TableCell>{cliente.genero}</TableCell>
                                <TableCell>{cliente.estadoCivil}</TableCell>
                                <TableCell>{cliente.rtn}</TableCell>
                                <TableCell>{cliente.numeroDocumento}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(cliente)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(cliente.clienteID)}
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

export default Cliente;
