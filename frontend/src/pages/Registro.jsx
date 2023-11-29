import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, CircularProgress, Grid, Paper, Box, Avatar, MenuItem, FormControl, Select, FormLabel } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Swal from 'sweetalert2'

function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [numTelefono, setNumTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [genero, setGenero] = useState('F');
  const [estadoCivil, setEstadoCivil] = useState('soltero');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async () => {
    try {

      let objRegistro = {
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento,
        telefono: numTelefono,
        correo: email,
        direccion,
        genero,
        estado_civil: estadoCivil,
        password
      }
      if (Object.values(objRegistro).includes('')) {
        setError("Todos los campos son obligatorios");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      setError("");

      Swal.fire({
        title: 'Success',
        text: 'Do you want to continue',
        icon: 'success',
        confirmButtonText: 'Cool'
      })
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/registro', objRegistro);

      if (response.status === 200) {
        setLoading(false);
        if(response.data.codigo == 200){
          Swal.fire({
            title: 'Registro realizado correctamente.',
            text: 'Se ha registrado correctamente a la plataforma.',
            icon: 'success',
            confirmButtonText: 'OK',
            didClose: () => {
              navigate("/Login")
            }
          })
        }else if(response.data.codigo == 406 ){
          Swal.fire({
            title: 'No se pudo registrar el usuario',
            text: response.data.mensaje,
            icon: 'error',
            confirmButtonText: 'OK',
            didClose: () => {
              navigate("/Login")
            }
          })
        }

      } else {
        Swal.fire({
          title: 'Error al crear el usuario',
          text: response.data.mensaje,
          icon: 'error',
          confirmButtonText: 'ok'
        })
        setLoading(false);
        console.error('Error al crear el usuario');
      }

    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        title: 'Error al crear el usuario',
        text: "No se pudo registrar el usuario.",
        icon: 'error',
        confirmButtonText: 'ok'
      })
      setError(error.message);
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Container component={Paper} elevation={5} maxWidth="xs">
        <Box p={4}>
          <Avatar style={{ margin: 'auto', backgroundColor: 'primary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography variant="h4" align="center" gutterBottom>
            Crear una cuenta
          </Typography>
          <form>
            <TextField
              label="Nombre"
              type="text"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Apellido"
              type="text"
              fullWidth
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Fecha de nacimiento"
              type="date"
              fullWidth
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Número de telefono"
              type="tel"
              fullWidth
              value={numTelefono}
              onChange={(e) => setNumTelefono(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Dirección"
              placeholder="Coloque su dirección."
              multiline
              rows={4}
              fullWidth
              onChange={(e) => setDireccion(e.target.value)}
              value={direccion}
              margin='normal'
            />
            <FormControl fullWidth>
              <FormLabel>Genero</FormLabel>
              <Select
                label="Genero"
                value={genero}
                onChange={e => setGenero(e.target.value)}
                fullWidth
                margin='dense'
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Estado Civil</FormLabel>
              <Select
                label="Estado civil"
                value={estadoCivil}
                onChange={e => setEstadoCivil(e.target.value)}
                fullWidth
                margin='dense'
              >
                <MenuItem value="soltero">Soltero</MenuItem>
                <MenuItem value="casado">Casado</MenuItem>
                <MenuItem value="divorciado">Divorciado</MenuItem>
                <MenuItem value="union libre">Unión Libre</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRegistro}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
            {error && (
              <Typography color="error" align="center" style={{ marginTop: 8 }}>
                {error}
              </Typography>
            )}
            <Typography variant="body2" align="center" style={{ marginTop: 16 }}>
              ¿Ya tienes una cuenta? <Link to="/">Iniciar sesión</Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </Grid>
  );
}

export default Registro;
