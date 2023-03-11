const { request, response } = require('express');

const Factura = require('../models/facturas');

const Producto = require('../models/producto');


const getFactura = async (req = request, res = response) => {

    const listaFactura = await Promise.all([
        Factura.countDocuments(),
        Factura.find().populate('producto', 'total')
    ]);

    res.json({
        msg: 'get Api - Controlador Factura',
        listaFactura
    });

}

const getFacturaById = async (req = request, res = response) => {
    const _idUsuario = req.usuario.id

    const carritoById = await Factura.find( {usuario:_idUsuario} );
 
    res.status(201).json( carritoById );
 
 }

 const carritoCompras = async (req = request, res = response) => {
    const _idUser= req.usuario.id;
    const { productos,cantidad } = req.body;
    postFactura(productos,_idUser,cantidad,res);
 }
 const postFactura = async (productos,_idUser,cantidad, res = response) => {
    let totals = 0;
    let totalC = 0;
    const productosSolicitados = [];

    for(let x = 0; x< productos.length;x++){

            const cantidades = cantidad[x];
            const producto = productos[x];
            
            const prouductoBuscar = await Producto.findById(producto);
            
            
            let precio = prouductoBuscar.precio;
            let cantidadSolicitada =parseInt( cantidades);
            totals = precio*cantidadSolicitada;
            
           
            productosSolicitados.push({producto:productos[x],cantidad:cantidades,total:totals});
            totalC = totals + totalC;
            
            let cantidadVendida = parseInt(prouductoBuscar.vendidos);
            let cantidadEditar = parseInt(prouductoBuscar.cantidadP);
          
           const {...data}  = "";
            if (cantidadEditar === 0) {
                data.disponible = false;
            }

            let cantidadEditada = parseInt(cantidadEditar - cantidades);
            let totalCantidad = cantidadVendida + cantidades;
            if (cantidadEditar >= cantidades) {
                
                data.cantidadP = cantidadEditada;
                data.vendidos = totalCantidad;
            }
            
            await Producto.findByIdAndUpdate(producto, data, { new: true });       
    }

    const data = {
        producto:productosSolicitados,
        usuario:_idUser,
        totales : totalC,
    }  
    
    const facturaGuardada = new Factura(data);

    const facturaG = await facturaGuardada.save();
    
    res.json({
        msg:facturaG
    })
    
 }


 module.exports = {
    getFactura,
    getFacturaById,
    carritoCompras
}