import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Typography,
} from '@mui/material';
import axios from 'axios';



function AgregarEmpleado({ open, handleClose, handleGuardarNuevoEmpleado }) {

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [numTelefono, setNumTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [genero, setGenero] = useState('F');
    const [estadoCivil, setEstadoCivil] = useState('soltero');
    
    const [fechaContrato, setFechaContrato] = useState('');
    const [numeroContrato, setNumeroContrato] = useState('');
    const [salario, setSalario] = useState(0);
    const [ihss, setIhss] = useState("");
    const [tipoEmpleado, setTipoEmpleado] = useState(1);
    const [horarioLaboral, setHorarioLaboral] = useState(1);

    const [error, setError] = useState('');

    const [tiposEmpleados, setTiposEmpleados] = useState([]);
    const [horariosLaboral, setHorariosLaboral] = useState([]);

    const handleGuardar = async () => {

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre del Empleado"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Apellido"
                            fullWidth
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de Nacimiento"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Telefono"
                            type="tel"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={numTelefono}
                            onChange={(e) => setNumTelefono(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Correo Electrónico"
                            type="email"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección"
                            type="text"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="genero-label">Género</InputLabel>
                            <Select
                                labelId="genero-label"
                                id="genero"
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                            >
                                <MenuItem value="M">Masculino</MenuItem>
                                <MenuItem value="F">Femenino</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="estado-civil-label">Estado civil</InputLabel>
                            <Select
                                labelId="estado-civil-label"
                                id="estado-civil"
                                value={estadoCivil}
                                onChange={(e) => setEstadoCivil(e.target.value)}
                            >
                                <MenuItem value="soltero">Soltero</MenuItem>
                                <MenuItem value="casado">Casado</MenuItem>
                                <MenuItem value="divorciado">Divorciado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de Contratación"
                            fullWidth
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={fechaContrato}
                            onChange={(e) => setFechaContrato(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Número de Contratación"
                            type="number"
                            fullWidth
                            value={numeroContrato}
                            onChange={(e) => setNumeroContrato(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Salario"
                            type="number"
                            fullWidth
                            value={salario}
                            onChange={(e) => setSalario(e.target.value)}
                        />
                    </Grid>

                   
                    <Grid item xs={12}>
                        <TextField
                            label="ihss"
                            fullWidth
                            value={ihss}
                            onChange={(e) => setIhss(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="tipo-empleado-label">Tipo de Empleado</InputLabel>
                            <Select
                                labelId="tipo-empleado-label"
                                id="tipo-empleado"
                                value={tipoEmpleado}
                                onChange={(e) => setTipoEmpleado(e.target.value)}
                            >
                                {tiposEmpleados.map((tipoEmpleado) => (
                                    <MenuItem key={tipoEmpleado.id_tipo_empleado} value={tipoEmpleado.id_tipo_empleado}>
                                        {tipoEmpleado.cargo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="horario-label">Horario</InputLabel>
                            <Select
                                labelId="horario-label"
                                id="horario"
                                value={horarioLaboral}
                                onChange={(e) => setHorarioLaboral(e.target.value)}
                            >
                                {horariosLaboral.map((horario) => (
                                    <MenuItem key={horario.id_horario_lab} value={horario.id_horario_lab}>
                                        {horario.dia}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} color="primary">
                    Guardar
                </Button>
            </DialogActions>
            {error && (
                <DialogContent>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                </DialogContent>
            )}
        </Dialog>
    );
}

export default AgregarEmpleado;
