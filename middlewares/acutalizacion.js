const { request, response } = require('express');
const Producto = require('../models/producto');
const validarDisponible = async (req = request, res = response, next) => {
 
    const { productos , cantidad} = req.body;
    
    for (let x = 0; x < productos.length; x++) {
        
        const cantidades = cantidad[x];
        const producto = productos[x];
        
        const prouductoBuscar = await Producto.findById(producto);
            if (prouductoBuscar) {
                if (prouductoBuscar.disponible === false) {  
                    
                    return res.status(400).json({
                        msg: `Producto no esta disponible`
                    })


                }
                
                if (cantidades > prouductoBuscar.cantidad) {
                    return res.status(405).json({
                        msg: `El producto no tiene esa cantidad`
                    })

                }   
            }


        

    }

    next()
}

const existeIdProducto = async (req = request, res= response, next) => {

    const { productos , cantidad} = req.body;
    
    for (let x = 0; x < productos.length; x++) {
        
        const cantidades = cantidad[x];
        const producto = productos[x];
        const prouductoBuscar = await Producto.findById(producto);
             if(!prouductoBuscar){
                return res.status(401).json({
                    msg: `El  id: ${producto} no esta requistrado en la base de datos`
                })
                
            }
    
    }

    next();

    

}



module.exports = {
    validarDisponible,
    existeIdProducto,
}