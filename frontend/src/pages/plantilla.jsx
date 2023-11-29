import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    Divider,
    Paper,
    Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DomainIcon from '@mui/icons-material/Domain';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom"

import useAuth from '../hooks/useAuth';

const drawerWidth = 200;

export default function Plantilla({ children }) {
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openSucursal, setOpenSucursal] = React.useState(false);
    const [openEmpleado, setOpenEmpleado] = React.useState(false);
    const [openCliente, setOpenCliente] = React.useState(false);
    const { auth, setAuth, cargando, handleObtenerUsuario } = useAuth()
    const navigate = useNavigate();

    const toggleDrawer = (open) => () => {
        setOpenDrawer(open);
    };

    const handleSucursalClick = () => {
        setOpenSucursal(!openSucursal);
    };

    const handleEmpleadoClick = () => {
        setOpenEmpleado(!openEmpleado);
    };
    const handleClienteClick = () => {
        setOpenCliente(!openCliente);
    };

    const navigateTo = (path) => {
        navigate(path);
        setOpenDrawer(false);
    };

    if (cargando) {
        return 'cargando...'
    }
    return (
        <>
            {
                auth.id_usuario ? (
                    <div>
                        <AppBar position="fixed" style={{ backgroundColor: '#173667' }}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={toggleDrawer(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" style={{ flexGrow: 1 }}>
                                    Careavet
                                </Typography>
                                <IconButton
                                    style={{ marginLeft: '10px' }}
                                    color="inherit"
                                    onClick={() => navigate('/')}
                                >
                                    <HomeIcon />
                                    <Typography variant="button" style={{ marginLeft: '5px' }}>Inicio</Typography>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <div style={{ marginTop: '64px' }}>
                            <Drawer
                                variant="temporary"
                                anchor="left"
                                open={openDrawer}
                                onClose={toggleDrawer(false)}
                            >
                                <Paper style={{ width: drawerWidth, backgroundColor: '#EE7F36' }} elevation={5}>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: 15 }}>
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={toggleDrawer(false)}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </div>
                                    <Divider />
                                    <List>

                                        <ListItem button onClick={handleEmpleadoClick}>
                                            <ListItemIcon>
                                                <GroupIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Empleado" />
                                            {openEmpleado ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </ListItem>
                                        <Collapse in={openEmpleado} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigateTo('/telefono_empleado')}>
                                                    <ListItemIcon>
                                                        <PhoneIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Teléfono del Empleado" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigateTo('/correo_empleado')}>
                                                    <ListItemIcon>
                                                        <EmailIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Correo del Empleado" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/tipo_documento')}>
                                                    <ListItemIcon>
                                                        <DescriptionIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Tipo de Documento" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/puesto')}>
                                                    <ListItemIcon>
                                                        <WorkIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Puesto" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/empleado')}>
                                                    <ListItemIcon>
                                                        <GroupIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Empleado" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/historico-puesto')}>
                                                    <ListItemIcon>
                                                        <HistoryIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Historico de Puesto" />
                                                </ListItem>
                                            </List>
                                        </Collapse>

                                        <ListItem button onClick={handleClienteClick}>
                                            <ListItemIcon>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Cliente" />
                                            {openCliente ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </ListItem>
                                        <Collapse in={openCliente} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>


                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/cliente')}>
                                                    <ListItemIcon>
                                                        <PersonIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Cliente" />
                                                </ListItem>

                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/tipo_documento_cliente')}>
                                                    <ListItemIcon>
                                                        <DescriptionIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Tipo de Documento" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigateTo('/telefono_cliente')}>
                                                    <ListItemIcon>
                                                        <PhoneIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Teléfono del Cliente" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigateTo('/correo_cliente')}>
                                                    <ListItemIcon>
                                                        <EmailIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Correo del Cliente" />
                                                </ListItem>
                                            </List>
                                        </Collapse>

                                        <ListItem button onClick={handleSucursalClick}>
                                            <ListItemIcon>
                                                <BusinessIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Sucursal" />
                                            {openSucursal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </ListItem>
                                        <Collapse in={openSucursal} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/departamento')}>
                                                    <ListItemIcon>
                                                        <DomainIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Departamentos" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/ciudad')}>
                                                    <ListItemIcon>
                                                        <LocationCityIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Ciudades" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/colonia')}>
                                                    <ListItemIcon>
                                                        <LocationOnIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Colonia" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/sucursal')}>
                                                    <ListItemIcon>
                                                        <BusinessIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Sucursal" />
                                                </ListItem>
                                                <ListItem button style={{ backgroundColor: '#F7CDB9' }} onClick={() => navigate('/historico_sucursal')}>
                                                    <ListItemIcon>
                                                        <HistoryEduIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Historico de Sucursal" />
                                                </ListItem>
                                            </List>
                                        </Collapse>



                                    </List>
                                </Paper>
                            </Drawer>
                            <main>
                                <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                                    {children}
                                </Container>
                            </main>
                        </div>
                    </div>

                ) : <Navigate to="/Login" />
            }
        </>
    );
}
