import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();

const port = 8080;

app.listen(port, ()=>console.log("Servidor escuchando en el puerto: ", port));

app.use(express.urlencoded({extended:true}));

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

app.get("/products/:id", (req, res) => {

});
