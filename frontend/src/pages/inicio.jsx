import React from 'react';
import { Typography } from '@mui/material';
import Plantilla from './plantilla';

function Inicio() {


    return (
        <Plantilla>
            <Typography variant="h4" component="h2">
                Bienvenido a la Aplicación
            </Typography>
        </Plantilla>
    );
}

export default Inicio;