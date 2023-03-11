const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');
const { existeCategoriaPorId } = require('../helpers/db-validators');
//Controllers
const { postProducto, putProducto, deleteProducto, getProductos, getAgotados, getVentaM } = require('../controllers/producto');

const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

//Manejo de rutas



//Obtener un producto por id - publico
router.get('/agotados', [

    validarJWT,
    validarCampos
],  getAgotados);
//ver los producros mas vendidos -publico
router.get('/mayor', [
    validarCampos
], getVentaM);

// Crear producto - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('categoria').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postProducto);
 
// Actuaizar producto - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    check('id').custom( existeProductoPorId ),
    validarCampos
], putProducto);

//Borrar un producto - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteProducto);



module.exports = router;