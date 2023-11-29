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
    Paper,
} from '@mui/material';
import Plantilla from '../plantilla';

function HistoricoPuesto() {
    const [historicoPuestos, setHistoricoPuestos] = useState([]);

    const obtenerHistoricoPuestos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/historico-puestos');

            // Ordenar los datos por ID
            const historicoOrdenado = response.data.historicoPuestos.sort((a, b) => a.id - b.id);

            setHistoricoPuestos(historicoOrdenado);
        } catch (error) {
            console.error('Error al obtener la lista de historial de puestos', error);
        }
    };

    useEffect(() => {
        obtenerHistoricoPuestos();
    }, []);

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return fechaObj.toLocaleDateString(undefined, opciones);
    };

    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Historial de Puestos
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Empleado</TableCell>
                            <TableCell>Fecha de Inicio</TableCell>
                            <TableCell>Fecha de Fin</TableCell>
                            <TableCell>Puesto Anterior</TableCell>
                            <TableCell>Puesto Actual</TableCell>
                            <TableCell>Salario Anterior</TableCell>
                            <TableCell>Salario Actual</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historicoPuestos.map((historico) => (
                            <TableRow key={historico.id}>
                                <TableCell>{historico.id}</TableCell>
                                <TableCell>{historico.nombre_empleado}</TableCell>
                                <TableCell>{formatearFecha(historico.fecha_inicio)}</TableCell>
                                <TableCell>{formatearFecha(historico.fecha_fin)}</TableCell>
                                <TableCell>{historico.nombre_puesto_anterior}</TableCell>
                                <TableCell>{historico.nombre_puesto_actual}</TableCell>
                                <TableCell>{historico.salario_anterior}</TableCell>
                                <TableCell>{historico.salario_actual}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Plantilla>
    );
}

export default HistoricoPuesto;
