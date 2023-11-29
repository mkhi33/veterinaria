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
import AgregarCiudad from './AgregarCiudad'; // Importa tu componente para agregar ciudades
import EditarCiudad from './EditarCiudad'; // Importa tu componente para editar ciudades
import Swal from 'sweetalert2';

function Ciudad() {
    const [ciudades, setCiudades] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [ciudadEditando, setCiudadEditando] = useState(null);

    const obtenerCiudades = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/ciudades');
            setCiudades(response.data.ciudades);
        } catch (error) {
            console.error('Error al obtener la lista de ciudades', error);
        }
    };

    useEffect(() => {
        obtenerCiudades();
    }, []);

    const handleEliminar = async (ciudadId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/ciudades/${ciudadId}`);

                    if (response.status === 200) {
                        console.log('Ciudad eliminada correctamente');
                        obtenerCiudades();
                    } else {
                        console.error('Error al eliminar la ciudad');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar ciudad', error);
                }
            }
        });
    };

    const handleEditar = (ciudad) => {
        setCiudadEditando(ciudad);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setCiudadEditando(null);
        setOpenModalEditar(false);
    };
    const handleGuardarNuevoCiudad = async (nuevaCiudad) => {
        try {
            const response = await axios.post('http://localhost:4000/api/ciudades', {
                nombre: nuevaCiudad.nombre,
                departamento_id: nuevaCiudad.departamento_id,
            });

            if (response.status === 201) {
                console.log('Ciudad creada exitosamente');
                obtenerCiudades();
            } else {
                console.error('Error al crear la ciudad');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar ciudad', error);
        } finally {
            handleCloseModalAgregar(); // Cierra el modal después de agregar la ciudad
        }
    };

    // PUT para actualizar una ciudad
    const handleGuardarEdicion = async (ciudadId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/ciudades/${ciudadId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerCiudades();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar ciudad', error);
        } finally {
            setCiudadEditando(null);
            setOpenModalEditar(false); // Cierra el modal después de editar la ciudad
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
                Bienvenido a Ciudad
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Ciudad
            </Button>
            <AgregarCiudad
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevaCiudad={handleGuardarNuevoCiudad}
            />
            <EditarCiudad
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                ciudad={ciudadEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Departamento</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ciudades.map((ciudad) => (
                            <TableRow key={ciudad.ID}>
                                <TableCell>{ciudad.ID}</TableCell>
                                <TableCell>{ciudad.nombre}</TableCell>
                                <TableCell>{ciudad.nombre_departamento}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(ciudad)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(ciudad.ID)}
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

export default Ciudad;
