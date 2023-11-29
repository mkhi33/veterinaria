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
import AgregarEmpleado from './AgregarEmpleado'; // Importa tu componente para agregar empleados
import EditarEmpleado from './EditarEmpleado'; // Importa tu componente para editar empleados
import Swal from 'sweetalert2';

function Empleado() {
    const [empleados, setEmpleados] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [empleadoEditando, setEmpleadoEditando] = useState(null);

    const obtenerEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/empleados');
            setEmpleados(response.data.empleados);
        } catch (error) {
            console.error('Error al obtener la lista de empleados', error);
        }
    };

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const handleEliminar = async (empleadoId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/empleados/${empleadoId}`);

                    if (response.status === 200) {
                        console.log('Empleado eliminado correctamente');
                        obtenerEmpleados();
                    } else {
                        console.error('Error al eliminar el empleado');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar empleado', error);
                }
            }
        });
    };

    const handleEditar = (empleado) => {
        setEmpleadoEditando(empleado);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setEmpleadoEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevoEmpleado = async (nuevoEmpleado) => {
        try {
            const response = await axios.post('http://localhost:4000/api/empleados', nuevoEmpleado);

            if (response.status === 201) {
                console.log('Empleado creado exitosamente');
            } else {
                console.error('Error al crear el empleado');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar empleado', error);
        } finally {
            obtenerEmpleados();
            handleCloseModalAgregar();
        }
    };

    // PUT para actualizar un empleado
    const handleGuardarEdicion = async (empleadoId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/empleados/${empleadoId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');

            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar empleado', error);
        } finally {
            obtenerEmpleados();
            setEmpleadoEditando(null);
            setOpenModalEditar(false); // Cierra el modal después de editar el empleado
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
                Bienvenido a Empleado
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Empleado
            </Button>
            <AgregarEmpleado
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevoEmpleado={handleGuardarNuevoEmpleado}
            />
            <EditarEmpleado
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                empleado={empleadoEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Fecha Nacimiento</TableCell>
                            <TableCell>Fecha Contratación</TableCell>
                            <TableCell>Número Contratación</TableCell>
                            <TableCell>Género</TableCell>
                            <TableCell>Estado Civil</TableCell>
                            <TableCell>RTN</TableCell>
                            <TableCell>Documento</TableCell>
                            <TableCell>Tipo Documento</TableCell>
                            <TableCell>Puesto</TableCell>
                            <TableCell>Salario</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empleados.map((empleado) => (
                            <TableRow key={empleado.id}>
                                <TableCell>{empleado.id}</TableCell>
                                <TableCell>{empleado.nombre}</TableCell>
                                <TableCell>{empleado.apellido}</TableCell>
                                <TableCell>{formatearFecha(empleado.fecha_nacimiento)}</TableCell>
                                <TableCell>{formatearFecha(empleado.fecha_contratacion)}</TableCell>
                                <TableCell>{empleado.numero_contratacion}</TableCell>
                                <TableCell>{empleado.genero}</TableCell>
                                <TableCell>{empleado.estado_civil}</TableCell>
                                <TableCell>{empleado.rtn}</TableCell>
                                <TableCell>{empleado.documento}</TableCell>
                                <TableCell>{empleado.nombre_documento}</TableCell>
                                <TableCell>{empleado.nombre_puesto}</TableCell>
                                <TableCell>{empleado.salario}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(empleado)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(empleado.id)}
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

export default Empleado;
