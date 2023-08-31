const fs = require('fs');

class ProductManager{

    constructor(path){
        this.filePath = path
    }

    fileExist(){
        return fs.existsSync(this.filePath);
    }

    async getProducts(){
        try {
            if(this.fileExist()){
                //leer el archivo
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                //transformar string a json => JSON.parse(objetoJson)
                const contenidoJson = JSON.parse(contenido);
                return contenidoJson;
            } else {
                throw new Error("no es posible leer el archivo")
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async isInProducts(code){
        const products = await this.getProducts()
        if(products){
            return products.some(product => product.code === code)
        }
        else{
            return false
        }
    }

    isValidProductData(title, description, price, thumbnail, code, stock){
        return title && description && typeof(price) === "number" && thumbnail && code && typeof(stock) === "number"
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        if(!this.isValidProductData(title, description, price, thumbnail, code, stock)){
            return console.error("Hay datos obligatorios no informados")
        }else{
            if(await this.isInProducts(code)){
                return console.error("El producto que intenta agregar ya existe")
            }
            else{
                let newId;
                const products = await this.getProducts();
                if(!products.length){
                    newId = 1
                }else{
                    newId = products[products.length - 1].id + 1
                }
                const new_product = {id: newId, title, description, price, thumbnail, code, stock};
                await this.saveProduct(new_product)    
            }
        }
    }

    async saveProduct(productInfo){
        try {
            if(this.fileExist()){
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                const contenidoJson = JSON.parse(contenido);
                contenidoJson.push(productInfo);
                await fs.promises.writeFile(this.filePath,JSON.stringify(contenidoJson,null,"\t"));
                console.log("producto agregado");
            } else {
                throw new Error("no es posible guardar el producto")
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getProductById(id){
        const products = await this.getProducts()
        const product = products.find(product => product.id === id)
        if(!product){
            return console.error("Product Not found")
        }
        else{
            return product
        }
    }

    async getCurrentId(){
        const products = await this.getProducts();
        return products[products.length - 1].id
    }

    async updateProduct(id, campo, nuevo_valor){
        try{
            if(this.fileExist()){
                const product = await this.getProductById(id)
                if(product.hasOwnProperty(campo)){
                    const productsString = await fs.promises.readFile(this.filePath, "utf-8");
                    const productsJSON = JSON.parse(productsString);
                    const productsJsonUpdated = productsJSON.map((product) => {
                        if(product.id === id){
                            product[campo] = nuevo_valor;
                            return product;
                        }else{ 
                            return product;
                        }
                    })
                    await fs.promises.writeFile(this.filePath, JSON.stringify(productsJsonUpdated, null, "\t"));
                }
                else{
                    throw new Error("El producto no tiene el dato especificado");
                }
            }else{
                throw new Error("No es posible actualizar el producto. Archivo inexistente.")
            }
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }

    async productExists(id){
        const products = await this.getProducts()
        if(products){
            return products.some(product => product.id === id)
        }
        else{
            return false
        }
    }

    async deleteProduct(id){
        try{
            if(this.fileExist()){
                const productsString = await fs.promises.readFile(this.filePath, "utf-8");
                const productsJSON = JSON.parse(productsString);
                if(await this.productExists(id)){
                    const productsJsonUpdated = productsJSON.filter(product => product.id !== id);
                    await fs.promises.writeFile(this.filePath, JSON.stringify(productsJsonUpdated, null, "\t"));
                    console.log(`El producto Id: ${id} ha sido eliminado`)
                }
                else{
                    throw new Error("No existe el producto que desea eliminar");
                }
            }else{
                throw new Error("No es posible eliminar el producto");
            }
        }catch(error){
            console.log(error.message);
            throw error;
        }
    }
}


// ################################################### TESTING ########################################################################

const operations = async ()=>{
    try {
        // Se creará una instancia de la clase “ProductManager”
        const manager = new ProductManager("./products.json");

        // Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
        const products = await manager.getProducts();
        console.log("manager de Productos creado: ", products);

        // Se llamará al método “addProduct” con los campos:
        // title: “producto prueba”
        // description: ”Este es un producto prueba”
        // price: 200,
        // thumbnail: ”Sin imagen”
        // code: ”abc123”,
        // stock: 25
        const title = "producto prueba"
        const description = "Este es un producto prueba"
        const price = 200
        const thumbnail = "Sin imagen"
        const code = "abc123"
        const stock = 25

        await manager.addProduct(title, description, price, thumbnail, code, stock)
        
        // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
        console.log("Id del producto agregado: ", await manager.getCurrentId())

        // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
        console.log("Productos agregados: ", await manager.getProducts())

        await manager.addProduct("Producto 2", "Otro producto prueba", 100, "Sin imagen", "abc321", 20);
        await manager.addProduct("Producto 3", "Otro producto prueba", 300, "Sin imagen", "cba123", 30);
        console.log("Nuevos Productos agregados: ", await manager.getProducts())

        // Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no 
        // existir, debe arrojar un error.
        const producto_buscado = await manager.getProductById(3)
        console.log("Producto buscado: ", producto_buscado)

        // Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine 
        // el id y que sí se haya hecho la actualización.
        const id = 2
        const campo = "stock"
        const nuevo_valor = 150
        console.log(`Actualizar ${campo} con valor ${nuevo_valor} de Producto Id: ${id}`);
        await manager.updateProduct(id, campo, nuevo_valor);
        console.log("Producto actualizado: ", await manager.getProductById(id));

        // Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de 
        // no existir.
        await manager.deleteProduct(3)
        console.log("Lista de Productos actualizada: ", await manager.getProducts())

    } catch (error) {
        console.log(error.message);
    }
}
operations()



