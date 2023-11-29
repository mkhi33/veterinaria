import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Importa los componentes de las páginas
import Departamento from './pages/Departamento/Departamento';
import Ciudad from './pages/Ciudad/Ciudad';
import Colonia from './pages/Colonia/Colonia';
import Sucursal from './pages/Sucursal/Sucursal'
import HistoricoSucursal from './pages/HistoricoSucursal/HistoricoSucursal'
import TipoDocumento from './pages/TipoDocumento/TipoDocumento';
import Puesto from './pages/Puesto/Puesto';
import Empleado from './pages/Empleado/Empleado';
import HistoricoPuesto from './pages/HistoricoPuesto/HistoricoPuesto';
import TelefonoEmpleado from './pages/TelefonoEmpleado/TelefonoEmpleado';
import CorreoEmpleado from './pages/CorreoEmpleado/CorreoEmpleado'
import TipoDocumentoCliente from './pages/TipoDocumentoCliente/TipoDocumentoCliente';
import Cliente from './pages/Cliente/Cliente';
import CorreoCliente from './pages/CorreoCliente/CorreoCliente';
import TelefonoCliente from './pages/TelefonoCliente/TelefonoCliente';
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/inicio';
import { AuthProvider } from './context/AuthProvider';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta para la página de inicio */}
          <Route path="/" element={<Inicio />} />

          {/* Ruta para la página de inicio */}
          <Route path="/Login" element={<Login />} />

          {/* Ruta para la página de inicio */}
          <Route path="/Registro" element={<Registro />} />

          {/* Ruta para la página de Departamento */}
          <Route path="/departamento" element={<Departamento />} />

          {/* Ruta para la página de Ciudad */}
          <Route path="/ciudad" element={<Ciudad />} />

          {/* Ruta para la página de Colonia */}
          <Route path="/colonia" element={<Colonia />} />

          {/* Ruta para la página de Colonia */}
          <Route path="/sucursal" element={<Sucursal />} />

          {/* Ruta para la página de Colonia */}
          <Route path="/historico_sucursal" element={<HistoricoSucursal />} />

          {/* Ruta para la página de Tipo de documento */}
          <Route path="/tipo_documento" element={<TipoDocumento />} />

          {/* Ruta para la página de Tipo de Puesto */}
          <Route path="/puesto" element={<Puesto />} />

          {/* Ruta para la página de Empleado */}
          <Route path="/empleado" element={<Empleado />} />

          {/* Ruta para la página de Colonia */}
          <Route path="/historico-puesto" element={<HistoricoPuesto />} />

          {/* Ruta para la página de Empleado */}
          <Route path="/telefono_empleado" element={<TelefonoEmpleado />} />

          {/* Ruta para la página de Empleado */}
          <Route path="/correo_empleado" element={<CorreoEmpleado />} />

          {/* Ruta para la página de Tipo de documento */}
          <Route path="/tipo_documento_cliente" element={<TipoDocumentoCliente />} />

          {/* Ruta para la página de Tipo de documento */}
          <Route path="/cliente" element={<Cliente />} />

          {/* Ruta para la página de Tipo de documento */}
          <Route path="/telefono_cliente" element={<TelefonoCliente />} />

          {/* Ruta para la página de Tipo de documento */}
          <Route path="/correo_cliente" element={<CorreoCliente />} />

          {/* Puedes agregar más rutas según sea necesario */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
