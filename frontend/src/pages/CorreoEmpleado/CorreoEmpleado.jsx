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
import AgregarCorreoEmpleado from './AgregarCorreoEmpleado'; // Importa tu componente para agregar correos de empleados
import EditarCorreoEmpleado from './EditarCorreoEmpleado'; // Importa tu componente para editar correos de empleados
import Swal from 'sweetalert2';

function CorreoEmpleado() {
    const [correosEmpleados, setCorreosEmpleados] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [correoEmpleadoEditando, setCorreoEmpleadoEditando] = useState(null);

    const obtenerCorreosEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/correos-empleados');
            setCorreosEmpleados(response.data.correosEmpleados);
        } catch (error) {
            console.error('Error al obtener la lista de correos de empleados', error);
        }
    };

    useEffect(() => {
        obtenerCorreosEmpleados();
    }, []);

    const handleEliminar = async (correoEmpleadoId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/correos-empleados/${correoEmpleadoId}`);

                    if (response.status === 200) {
                        console.log('Correo de empleado eliminado correctamente');
                        obtenerCorreosEmpleados();
                    } else {
                        console.error('Error al eliminar el correo de empleado');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar el correo de empleado', error);
                }
            }
        });
    };

    const handleEditar = (correoEmpleado) => {
        setCorreoEmpleadoEditando(correoEmpleado);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setCorreoEmpleadoEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevoCorreoEmpleado = async (nuevoCorreoEmpleado) => {
        try {
            const response = await axios.post('http://localhost:4000/api/correos-empleados', {
                id_empleado: nuevoCorreoEmpleado.id_empleado,
                tipo: nuevoCorreoEmpleado.tipo,
                correo: nuevoCorreoEmpleado.correo,
            });

            if (response.status === 201) {
                console.log('Correo de empleado creado exitosamente');
                obtenerCorreosEmpleados();
            } else {
                console.error('Error al crear el correo de empleado');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar el correo de empleado', error);
        } finally {
            handleCloseModalAgregar();
            obtenerCorreosEmpleados();
        }
    };

    const handleGuardarEdicionCorreoEmpleado = async (correoEmpleadoId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/correos-empleados/${correoEmpleadoId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerCorreosEmpleados();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar el correo de empleado', error);
        } finally {
            setCorreoEmpleadoEditando(null);
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
                Bienvenido a Correo de Empleado
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Correo de Empleado
            </Button>
            <AgregarCorreoEmpleado
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevoCorreo={handleGuardarNuevoCorreoEmpleado}
            />
            <EditarCorreoEmpleado
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                correoEmpleado={correoEmpleadoEditando}
                handleGuardarEdicion={handleGuardarEdicionCorreoEmpleado}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre del Empleado</TableCell>
                            <TableCell>Tipo de Correo</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {correosEmpleados.map((correoEmpleado) => (
                            <TableRow key={correoEmpleado.id}>
                                <TableCell>{correoEmpleado.id}</TableCell>
                                <TableCell>{`${correoEmpleado.nombre_empleado} ${correoEmpleado.apellido}`}</TableCell>
                                <TableCell>{correoEmpleado.tipo}</TableCell>
                                <TableCell>{correoEmpleado.correo}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(correoEmpleado)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(correoEmpleado.id)}
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

export default CorreoEmpleado;
