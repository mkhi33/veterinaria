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
import AgregarSucursal from './AgregarSucursal'; // Importa tu componente para agregar sucursales
import EditarSucursal from './EditarSucursal'; // Importa tu componente para editar sucursales
import Swal from 'sweetalert2';

function Sucursal() {
    const [sucursales, setSucursales] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [sucursalEditando, setSucursalEditando] = useState(null);

    const obtenerSucursales = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/sucursales');
            setSucursales(response.data.sucursales);
        } catch (error) {
            console.error('Error al obtener la lista de sucursales', error);
        }
    };

    useEffect(() => {
        obtenerSucursales();
    }, []);

    const handleEliminar = async (sucursalId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/sucursales/${sucursalId}`);

                    if (response.status === 200) {
                        console.log('Sucursal eliminada correctamente');
                        obtenerSucursales();
                    } else {
                        console.error('Error al eliminar la sucursal');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar sucursal', error);
                }
            }
        });
    };

    const handleEditar = (sucursal) => {
        setSucursalEditando(sucursal);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setSucursalEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevaSucursal = async (nuevaSucursal) => {
        try {
            const response = await axios.post('http://localhost:4000/api/sucursales', nuevaSucursal);

            if (response.status === 201) {
                console.log('Sucursal creada exitosamente');
            } else {
                console.error('Error al crear la sucursal');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar sucursal', error);
        } finally {
            obtenerSucursales();
            handleCloseModalAgregar();
        }
    };


    // PUT para actualizar una sucursal
    const handleGuardarEdicion = async (sucursalId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/sucursales/${sucursalId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');

            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar sucursal', error);
        } finally {
            obtenerSucursales();
            setSucursalEditando(null);
            setOpenModalEditar(false); // Cierra el modal después de editar la sucursal
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
                Bienvenido a Sucursal
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Sucursal
            </Button>
            <AgregarSucursal
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevaSucursal={handleGuardarNuevaSucursal}
            />
            <EditarSucursal
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                sucursal={sucursalEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>Telefono</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Colonia</TableCell>
                            <TableCell>Ciudad</TableCell> {/* Nueva columna */}
                            <TableCell>Departamento</TableCell> {/* Nueva columna */}
                            <TableCell>Fecha Apertura</TableCell>
                            <TableCell>Hora Apertura</TableCell>
                            <TableCell>Hora Cierre</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sucursales.map((sucursal) => (
                            <TableRow key={sucursal.id}>
                                <TableCell>{sucursal.id}</TableCell>
                                <TableCell>{sucursal.nombre}</TableCell>
                                <TableCell>{sucursal.direccion}</TableCell>
                                <TableCell>{sucursal.telefono}</TableCell>
                                <TableCell>{sucursal.correo}</TableCell>
                                <TableCell>{sucursal.nombre_colonia}</TableCell>
                                <TableCell>{sucursal.nombre_ciudad}</TableCell>
                                <TableCell>{sucursal.nombre_departamento}</TableCell>
                                <TableCell>{formatearFecha(sucursal.fecha_apertura)}</TableCell>
                                <TableCell>{sucursal.hora_apertura}</TableCell>
                                <TableCell>{sucursal.hora_cierre}</TableCell>
                                <TableCell>{sucursal.estado}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(sucursal)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(sucursal.id)}
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

export default Sucursal;