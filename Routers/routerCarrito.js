import { Router } from 'express'
import fs from "fs";
import {getAll,getById,save,deleteById} from '../Funciones/funciones.js'
import { isAdmin } from "../utils/isAdmin.js";

const filepathProductos = 'productos.json'
const filepathCart = 'carrito.json'
const routerCarrito = Router();
const carrito = {
    timestamp: new Date(),
    productos: []
}
routerCarrito.get('/', async (req,res) => {
    const carritos = await getAll(filepathCart)
    res.send(carritos)
})
routerCarrito.post('/', async (req, res) => {
    await save(carrito,filepathCart)
    const elementos = await getAll(filepathCart)
    res.send(elementos)
})
routerCarrito.delete('/:id', async (req, res) => {
    const id = req.params.id
    await deleteById(id,filepathCart)
    const carritos = await getAll(filepathCart)
    res.send(carritos)
})
routerCarrito.get('/:id/productos', async (req, res) => {
    const id = req.params.id
    const objeto = await getById(id,filepathCart)
    console.log(typeof(objeto.elemento.productos))
    res.send(objeto.elemento.productos)

})
routerCarrito.post('/:id/productos', async (req, res) => {
    const id = req.params.id
    let producto = await getById(id,filepathProductos)
    producto = producto.elemento
    if(producto === null){
        res.send('Error: No pudo encontrarse el producto')
      }else{
        let cart = await getById(1,filepathCart)
        cart = cart.elemento
        const productos = cart.productos
        productos.push(producto)
        cart.productos = productos

        await deleteById(1,filepathCart)
        await save(cart,filepathCart)

        res.send(productos)
    }


})
routerCarrito.delete('/:id_cart/productos/:id_prod', async (req,res) => {
    const {id_cart} = req.params
    const {id_prod} = req.params
    let cart = await getById(id_cart,filepathCart)
    if(cart === null){
        res.send('Error: no se pudo encontrar el carrito')
    }else{
        cart = cart.elemento
        const productosFiltrados = cart.productos.filter((elemento) => elemento.id != id_prod)
        if(productosFiltrados === null){
            res.send('Error: no se pudo encontrar el producto a eliminar')
        }else{
            cart.productos = productosFiltrados
            await deleteById(id_cart,filepathCart)
            await save(cart,filepathCart)
            res.send(cart)
        }
    }

})
export { routerCarrito };