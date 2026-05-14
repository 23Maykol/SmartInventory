const ProductModel = require('../models/product.model')

const ProductController = {
    getAll: async (req, res) => {
        try {
            const products = await ProductModel.findAll()
            return res.status(200).json({
                ok: true,
                data: products,
                total: products.length
            })
        } catch (error) {
            console.error('Error en getAll products:', error.message)
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params
            const product = await ProductModel.findById(id)

            if (!product) {
                return res.status(404).json({
                    ok: false,
                    message: 'Producto no encontrado'
                })
            }

            return res.status(200).json({
                ok: true,
                data: product
            })
        } catch (error) {
            console.error('Error en getById product:', error.message)
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    },

    create: async (req, res) => {
        try {
            const { name, stock, price, category, description } = req.body

            if (!name || price === undefined) {
                return res.status(400).json({
                    ok: false,
                    message: 'Nombre y precio son obligatorios'
                })
            }

            if (price < 0 || stock < 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Precio y stock no pueden ser negativos'
                })
            }

            const productId = await ProductModel.create({
                name,
                stock: stock || 0,
                price,
                category: category || null,
                description: description || null
            })

            const newProduct = await ProductModel.findById(productId)

            return res.status(201).json({
                ok: true,
                message: 'Producto creado exitosamente',
                data: newProduct
            })

        } catch (error) {
            console.error('Error en create product:', error.message)
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    }
}

module.exports = ProductController