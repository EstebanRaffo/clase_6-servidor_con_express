import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();

const port = 8080;

app.listen(port, ()=>console.log("Servidor escuchando en el puerto: ", port));

app.use(express.urlencoded({extended:true}));

