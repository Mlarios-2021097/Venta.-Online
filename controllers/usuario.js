const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const postUserCliente = async (req = request, res = response) => {
    
    const { nombre, correo, password } = req.body;
    const guardadoDB = new Usuario({ nombre, correo, password,rol:"ROL_CLIENTE" });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    guardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await guardadoDB.save();

    res.json({
        msg:
        guardadoDB
    });

}
const postUserAdmin = async (req = request, res = response) => {

    
    const { nombre, correo, password } = req.body;
    const guardadoDB = new Usuario({ nombre, correo, password,rol:"ROL_ADMIN" });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    guardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await guardadoDB.save();

    res.json({
        msg: 
        guardadoDB
    });

}



const putUsuario = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, img,  /* rol,*/  estado, google, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteUsuario = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    //const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
     const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    postUserAdmin,
    postUserCliente,
    putUsuario,
    deleteUsuario
}


// CONTROLADOR