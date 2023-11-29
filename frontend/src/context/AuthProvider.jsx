import { createContext, useState, useEffect } from "react";
import { decodeToken, isExpired } from "react-jwt";
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setCargando(false)
        return
      }
      let tknDecode = decodeToken(token)
      let expiro = isExpired(token)
      try {

        if (tknDecode && !expiro) {
          let correoUsuario = tknDecode.correo;
          let res = await axios.get(`http://localhost:4000/api/usuario/${correoUsuario}`)
          if (res.data.codigo == 200) {
            setAuth(res.data.data)
            console.log(res.data)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setCargando(false)
      }
    }
    autenticarUsuario()
  }, [])

  const handleObtenerUsuario = async (email) => {
    let res = await axios.get(`http://localhost:4000/api/usuario/${email}`)
    if (res.data.codigo == 200) {
      return(res.data.data)
    }
    return null;
  }


  return <AuthContext.Provider
    value={{
      setAuth,
      auth,
      cargando,
      handleObtenerUsuario
    }}
  >
    {children}
  </AuthContext.Provider>
}

export {
  AuthProvider
}

export default AuthContext;