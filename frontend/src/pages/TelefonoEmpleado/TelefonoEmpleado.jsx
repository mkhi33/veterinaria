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
import AgregarTelefonoEmpleado from './AgregarTelefonoEmpleado'; // Importa tu componente para agregar teléfonos de empleados
import EditarTelefonoEmpleado from './EditarTelefonoEmpleado'; // Importa tu componente para editar teléfonos de empleados
import Swal from 'sweetalert2';

function TelefonoEmpleado() {
    const [telefonosEmpleados, setTelefonosEmpleados] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [telefonoEmpleadoEditando, setTelefonoEmpleadoEditando] = useState(null);

    const obtenerTelefonosEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/telefonos-empleados');
            setTelefonosEmpleados(response.data.telefonosEmpleados);
        } catch (error) {
            console.error('Error al obtener la lista de teléfonos de empleados', error);
        }
    };

    useEffect(() => {
        obtenerTelefonosEmpleados();
    }, []);

    const handleEliminar = async (telefonoEmpleadoId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/telefonos-empleados/${telefonoEmpleadoId}`);

                    if (response.status === 200) {
                        console.log('Teléfono de empleado eliminado correctamente');
                        obtenerTelefonosEmpleados();
                    } else {
                        console.error('Error al eliminar el teléfono de empleado');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar el teléfono de empleado', error);
                }
            }
        });
    };

    const handleEditar = (telefonoEmpleado) => {
        setTelefonoEmpleadoEditando(telefonoEmpleado);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setTelefonoEmpleadoEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevoTelefonoEmpleado = async (nuevoTelefonoEmpleado) => {
        try {
            const response = await axios.post('http://localhost:4000/api/telefonos-empleados', {
                id_empleado: nuevoTelefonoEmpleado.id_empleado,
                tipo: nuevoTelefonoEmpleado.tipo,
                telefono: nuevoTelefonoEmpleado.telefono,
            });

            if (response.status === 201) {
                console.log('Teléfono de empleado creado exitosamente');
                obtenerTelefonosEmpleados();
            } else {
                console.error('Error al crear el teléfono de empleado');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el teléfono de empleado', error);
        } finally {
            handleCloseModalAgregar();
            obtenerTelefonosEmpleados();
        }
    };

    const handleGuardarEdicionTelefonoEmpleado = async (telefonoEmpleadoId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/telefonos-empleados/${telefonoEmpleadoId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerTelefonosEmpleados();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar el teléfono de empleado', error);
        } finally {
            setTelefonoEmpleadoEditando(null);
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
                Bienvenido a Teléfono de Empleado
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Teléfono de Empleado
            </Button>
            <AgregarTelefonoEmpleado
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevoTelefono={handleGuardarNuevoTelefonoEmpleado}
            />
            <EditarTelefonoEmpleado
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                telefonoEmpleado={telefonoEmpleadoEditando}
                handleGuardarEdicion={handleGuardarEdicionTelefonoEmpleado}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre del Empleado</TableCell>
                            <TableCell>Tipo de Teléfono</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {telefonosEmpleados.map((telefonoEmpleado) => (
                            <TableRow key={telefonoEmpleado.id}>
                                <TableCell>{telefonoEmpleado.id}</TableCell>
                                <TableCell>{`${telefonoEmpleado.nombre_empleado} ${telefonoEmpleado.apellido}`}</TableCell>
                                <TableCell>{telefonoEmpleado.tipo}</TableCell>
                                <TableCell>{telefonoEmpleado.telefono}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(telefonoEmpleado)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(telefonoEmpleado.id)}
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

export default TelefonoEmpleado;
