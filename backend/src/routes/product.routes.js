const router = require('express').Router()
const ProductController = require('../controllers/product.controller')
const { verifyToken } = require('../middleware/auth.middleware')

// Todas las rutas de productos requieren token
router.use(verifyToken)

router.get('/', ProductController.getAll)
router.get('/:id', ProductController.getById)
router.post('/', ProductController.create)

module.exports = router