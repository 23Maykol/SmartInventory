const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const authRoutes = require('./src/routes/auth.routes')
const productRoutes = require('./src/routes/product.routes')

const app = express()

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}))

// Rate limit global
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        ok: false,
        message: 'Demasiadas peticiones. Intenta en 15 minutos.'
    }
})
app.use('/api/', limiter)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    })
})

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: `Ruta ${req.originalUrl} no encontrada`
    })
})

module.exports = app