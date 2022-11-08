import fs from 'fs'
import { Router } from "express"
import {getAll,getById,save,deleteById} from '../Funciones/funciones.js'
import { isAdmin } from "../utils/isAdmin.js";

const routerProductos = Router();
const filePath = "productos.json";

let productos = [];
routerProductos.get("/", async(req, res) => {
  const product = await getAll(filePath)
    res.send(product);
});
routerProductos.get("/:id", async (req, res) => {
  const id =  req.params.id;
  const objeto = await getById(id,filePath)
  objeto === null ? res.send("Error: No pudo encontrarse el producto") : res.send(objeto)   

});
routerProductos.post("/", async (req, res) => {
  if(isAdmin){
    const producto = req.body;
    await save(producto,filePath)
    res.status(200).send("Producto agregado")
  }
});
routerProductos.put("/:id", async (req, res) => {
  if(isAdmin){
    const nuevoObjeto = req.body
    const id = req.params.id;
    const elementos = await getAll(filePath)
    const nuevoArray = elementos.map((elemento) => {
      if(elemento.id == id){
        nuevoObjeto.id = parseInt(id)
        return nuevoObjeto
      }
      return elemento 
    })
    await fs.promises.writeFile(filePath,JSON.stringify(nuevoArray,null,3))
    const elementoEditado = await getById(id,filePath)
    if(elementoEditado === null){
      res.send('Error: No pudo encontrarse el producto')
    }else{
      res.send(elementoEditado);
    }
  }else{
    res.send("Ruta no autorizada")
  }
});
routerProductos.delete("/:id", async (req,res) => {
  if(isAdmin){
    const id = req.params.id;
    const elementosFiltrados = await deleteById(id,filePath)
    if(elementosFiltrados === null){
      res.send('Error: No pudo encontrarse el producto')
    }else{
      res.send(elementosFiltrados);
    }
  }
})
export { routerProductos };