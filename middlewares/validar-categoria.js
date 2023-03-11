const { response, request } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const defecto = async(req = request, res = response, next) =>{
    const { id } = req.params;

    const query = {categoria:id} 

    const productos = await Producto.find(query);

    const productIds =  productos.map((product) => product._id);

    const _idAdmin = req.usuario.id;

    const colleccion = 'Respaldo'
    const categoriaDB = await Categoria.findOne({ nombre:colleccion });

    if (!categoriaDB) {
        const deleteCategoria = new Categoria({
            nombre: "Respaldo",
            usuario: _idAdmin
        });
        
        await deleteCategoria.save();
    }

    const query1 = { nombre:'Respaldo' }
    const {_id} = await Categoria.findOne(query1);

    const editado = await  Producto.updateMany({categoria:id},{categoria:_id});

    next()
}


module.exports = {
    defecto
}
