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
import AgregarColonia from './AgregarColonia'; // Importa tu componente para agregar colonias
import EditarColonia from './EditarColonia'; // Importa tu componente para editar colonias
import Swal from 'sweetalert2';

function Colonia() {
    const [colonias, setColonias] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [coloniaEditando, setColoniaEditando] = useState(null);

    const obtenerColonias = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/colonias');
            setColonias(response.data.colonias);
        } catch (error) {
            console.error('Error al obtener la lista de colonias', error);
        }
    };

    useEffect(() => {
        obtenerColonias();
    }, []);

    const handleEliminar = async (coloniaId) => {
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
                    const response = await axios.delete(`http://localhost:4000/api/colonias/${coloniaId}`);

                    if (response.status === 200) {
                        console.log('Colonia eliminada correctamente');
                        obtenerColonias();
                    } else {
                        console.error('Error al eliminar la colonia');
                    }
                } catch (error) {
                    console.error('Error en la solicitud para eliminar colonia', error);
                }
            }
        });
    };

    const handleEditar = (colonia) => {
        setColoniaEditando(colonia);
        setOpenModalEditar(true);
    };

    const handleCloseModalEditar = () => {
        setColoniaEditando(null);
        setOpenModalEditar(false);
    };

    const handleGuardarNuevaColonia = async (nuevaColonia) => {
        try {
            const response = await axios.post('http://localhost:4000/api/colonias', {
                nombre: nuevaColonia.nombre,
                ciudad_id: nuevaColonia.ciudad_id,
            });

            if (response.status === 201) {
                console.log('Colonia creada exitosamente');
                obtenerColonias();
            } else {
                console.error('Error al crear la colonia');
            }
        } catch (error) {
            console.error('Error en la solicitud para agregar colonia', error);
        } finally {
            handleCloseModalAgregar(); // Cierra el modal después de agregar la colonia
        }
    };

    // PUT para actualizar una colonia
    const handleGuardarEdicion = async (coloniaId, nuevoDatos) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/colonias/${coloniaId}`, nuevoDatos);

            if (response.status === 200) {
                console.log('Cambios guardados exitosamente');
                obtenerColonias();
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Error en la solicitud para editar colonia', error);
        } finally {
            setColoniaEditando(null);
            setOpenModalEditar(false); // Cierra el modal después de editar la colonia
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
                Bienvenido a Colonia
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAgregar}>
                Agregar Colonia
            </Button>
            <AgregarColonia
                open={openModalAgregar}
                handleClose={handleCloseModalAgregar}
                handleGuardarNuevaColonia={handleGuardarNuevaColonia}
            />
            <EditarColonia
                open={openModalEditar}
                handleClose={handleCloseModalEditar}
                colonia={coloniaEditando}
                handleGuardarEdicion={handleGuardarEdicion}
            />
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Ciudad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {colonias.map((colonia) => (
                            <TableRow key={colonia.ID}>
                                <TableCell>{colonia.ID}</TableCell>
                                <TableCell>{colonia.nombre}</TableCell>
                                <TableCell>{colonia.nombre_ciudad}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditar(colonia)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleEliminar(colonia.ID)}
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

export default Colonia;
