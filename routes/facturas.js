const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getFacturaById,carritoCompras } = require('../controllers/facturas');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarDisponible,existeIdProducto } = require('../middlewares/acutalizacion');


const router = Router();

//Manejo de rutas
router.post('/comprar', [
    validarJWT,
    existeIdProducto,
    validarDisponible,
    validarCampos,
] ,carritoCompras);
router.get('/', [
    validarJWT,
    validarCampos
], getFacturaById );

module.exports = router;