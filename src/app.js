import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();

const port = 8080;

app.listen(port, () => console.log("Servidor escuchando en el puerto: ", port));

app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("<h1 style='color:green'>Bienvenido al sitio web de Productos</h1>")
});

app.get("/products", async (req, res) => {
    try{
        const manager = new ProductManager("./products.json");
        const products = await manager.getProducts();
        const limit = req.query.limit;
        if(products.length){
            if(limit){
                const product_list = products.slice(0, limit);
                res.send(product_list);
            }else{
                res.send(products);
            }
        }else{
            res.send("No se encontraron productos");
        }
    }catch(error){
        console.log(error.message);
    }
});

app.get("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const manager = new ProductManager("./products.json");
        const product = await manager.getProductById(id);
        if(product){
            res.send(product);
        }else{
            res.send("<h1 style='color: red'>No se encontró el producto buscado o no existe</h1>");
        }
    }catch(error){
        console.log(error.message);
    }
});


// ________________________________________________ TESTING ___________________________________________________________________________

// 1. Se instalarán las dependencias a partir del comando npm install.

// 2. Se echará a andar el servidor.

// 3. Se revisará que el archivo YA CUENTE CON AL MENOS DIEZ PRODUCTOS CREADOS al momento de su entrega, es importante para que los 
// tutores no tengan que crear los productos por sí mismos, y así agilizar el proceso de tu evaluación.

// 4. Se corroborará que el servidor esté corriendo en el puerto 8080.

// 5. Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.

// 6. Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de 
// los 10 productos.

// 7. Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.

// 8. Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe 
// devolver un objeto con un error indicando que el producto no existe.