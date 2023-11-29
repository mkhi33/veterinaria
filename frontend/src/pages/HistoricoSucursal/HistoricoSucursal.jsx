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

function HistoricoSucursal() {
    const [historicoSucursales, setHistoricoSucursales] = useState([]);

    const obtenerHistoricoSucursales = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/historico-sucursales');
            setHistoricoSucursales(response.data.historicoSucursales);
        } catch (error) {
            console.error('Error al obtener la lista de historial de sucursales', error);
        }
    };

    useEffect(() => {
        obtenerHistoricoSucursales();
    }, []);

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return fechaObj.toLocaleDateString(undefined, opciones);
    };
    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Historial de Sucursales
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>ID de Sucursal</TableCell>
                            <TableCell>Fecha de Cambio</TableCell>
                            <TableCell>Hora de Cambio</TableCell>
                            <TableCell>Estado Anterior</TableCell>
                            <TableCell>Estado Actual</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historicoSucursales.map((historico) => (
                            <TableRow key={historico.id}>
                                <TableCell>{historico.id}</TableCell>
                                <TableCell>{historico.id_sucursal}</TableCell>
                                <TableCell>{formatearFecha(historico.fecha_cambio)}</TableCell>
                                <TableCell>{historico.hora_cambio}</TableCell>
                                <TableCell>{historico.estado_anterior}</TableCell>
                                <TableCell>{historico.estado_actual}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Plantilla>
    );
}

export default HistoricoSucursal;
