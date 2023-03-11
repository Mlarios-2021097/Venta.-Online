const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const coleccionesPermitidas = [
    'productos',
    'categorias'
];


const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( producto ) ? [ producto ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');
    
    const productos = await Producto.find({
        $or: [ { nombre: regex }]
    });
    
    res.json({
        results: productos
    })

}

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( categoria ) ? [ categoria ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');
    
    const categoria = await Categoria.find({
        $or: [ { nombre: regex }]
    });
    
    res.json({
        results: categoria
    })

}



const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }
    

    switch (coleccion) {

        case 'productos':
            buscarProductos(termino, res);

           
        break;
        case 'categorias':
            buscarCategorias(termino, res);

           
        break;
        default:
            res.status(500).json({
                msg: 'Ups, se me olviod hacer esta busqueda...'
            });
        break;
    }

}


module.exports = {
    buscar
}