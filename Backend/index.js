const express = require("express");
const dotenv = require("dotenv")
const app = express();
// Acceso mediante cors para todos los clientes
const cors = require('cors');
app.use(express.json({ limit: "500mb" }))

app.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.json())
dotenv.config()

app.set('port', process.env.PORT || 4000)

app.use(express.urlencoded({limit:"500mb", extended: true, parameterLimit:500000}));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); 

// Ruta raiz
app.get("/", (req, res) => {
  res.json({ message: "Careavet" });
});
require("./routes/usuario.routes")(app);
require("./routes/login.routes")(app);

const PORT = process.env.PORT || 4000
// set port, listen for requests
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto:  ${PORT}`);
  });