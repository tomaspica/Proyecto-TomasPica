import express from "express";
import { routerProductos } from "./Routers/routerProductos.js";
import { routerCarrito } from "./Routers/routerCarrito.js"


const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>
  console.log(`Server listening on PORT ${PORT}`)
);

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/productos',routerProductos)
app.use('/api/carrito',routerCarrito)