const express = require("express");
const app = require('express')();
const path = require('path');
const http = require('http').createServer(app);
const { options } = require("./options/SQLite3");
const knex = require("knex")(options);

const { arrayProducto } = require('./api/producto');
const producto = require('./api/producto');

const { arrayCarrito } = require('./api/carrito')
const carrito = require('./api/carrito');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routerProductos = express.Router();
app.use('/productos', routerProductos);

const routerCarrito = express.Router();
app.use('/carrito', routerCarrito);

const port = 8080;
const server = app.listen(port, () => {
  console.info(`Servidor listo en el puerto ${port}`);
});

server.on("error", (error) => {
    console.error(error);
  });

// Administrador 

const youAreAdmin = true;

/////////////////////////////////////////////
// Rutas de Productos

// Trae todo el listado de producto
routerProductos.get("/listar", (req, res) => {
    if(!producto.getArray().length){ 
        res.json({error: 'producto no encontrado'});
    }
    res.json(producto.getArray());
    console.log(producto.getArray())
});

// Traer producto por id

routerProductos.get("/listar/:id", (req, res) => {
    const id = req.params.id;
    if(!producto.getProductById(id)){
        res.json({error: 'producto no encontrado'});
    }
    const productoById = producto.getProductById(id);
    console.log(productoById)
    res.json(productoById);
    res.status(200).send()
  });


// Agregar un producto
routerProductos.post("/agregar", (req, res) => {
    if(youAreAdmin){
    const nuevoProducto = req.body;  
    console.log(nuevoProducto)
    producto.addElement(nuevoProducto);
    res.sendStatus(201);
  }else{
    res.json({error: 'Usted no tiene los permisos para agregar productos'})
  }

  });


// Actualizar un producto

routerProductos.put("/actualizar/:id", (req, res) => {
    if(youAreAdmin){
    const id = req.params.id;
    const productUpdt = req.body;
    console.log(productUpdt)
  
      if(!producto.getProductById(id)){
        res.json({error: 'producto no encontrado'});
      }
      res.json(producto.updateElement(id, productUpdt));  
}else{
  res.json({error: 'Usted no tiene los permisos para modificar productos'})
}})
    
// Borrar producto 

routerProductos.delete("/borrar/:id", (req, res) => {
    if(youAreAdmin){
    const id = req.params.id;
    if(!producto.getProductById(id)){
      res.json({error: 'producto no encontrado'});
    }
    producto.deleteElement(id)
    res.json(producto.getProductById(id));
}
else{
  res.json({error: 'Usted no tiene los permisos para borrar productos'})
}})

////////////////////////////////////////
// Rutas de Carrito

// Trae todo el listado de producto
routerCarrito.get("/listar", (req, res) => {
  if(!carrito.getArray().length){ 
      res.json({error: 'producto no encontrado'});
  }
  res.json(carrito.getArray());
  console.log(carrito.getArray())
});

// Traer producto por id

routerCarrito.get("/listar/:id", (req, res) => {
  const id = req.params.id;
  if(!carrito.getProductById(id)){
      res.json({error: 'producto no encontrado'});
  }
  const productoById = carrito.getProductById(id);
  console.log(productoById)
  res.json(productoById);
  res.status(200).send()
  });


// Agregar un producto
routerCarrito.post("/agregar/:id", (req, res) => {
  const id = req.params.id;
  const nuevoProducto = producto.getProductById(id);  
  console.log(nuevoProducto)
  carrito.addElement(nuevoProducto);
  res.sendStatus(201);
  const productosEnLista = carrito.getArray();
  
  knex.schema.createTable('productos', table => {
    table.integer('id')
    table.string('nombre')
    table.string('descripcion')
    table.string('codigo')
    table.string('foto')
    table.integer('precio')
    table.integer('stock')
    table.string('timestamp')
})
    .then(() => console.log('table created!'))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    });
});

// Borrar producto 

routerCarrito.delete("/borrar/:id", (req, res) => {
  const id = req.params.id;
  if(!carrito.getProductById(id)){
    res.json({error: 'producto no encontrado'});
  }
  carrito.deleteElement(id)
  res.json(carrito.getProductById(id));
})
