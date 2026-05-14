const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')

const AuthController = {
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body

            // Validar campos obligatorios
            if (!name || !email || !password) {
                return res.status(400).json({
                    ok: false,
                    message: 'Nombre, email y contraseña son obligatorios'
                })
            }

            // Validar formato email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Formato de email inválido'
                })
            }

            // Validar contraseña mínima
            if (password.length < 6) {
                return res.status(400).json({
                    ok: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                })
            }

            // Verificar email duplicado
            const existingUser = await UserModel.findByEmail(email)
            if (existingUser) {
                return res.status(409).json({
                    ok: false,
                    message: 'El email ya está registrado'
                })
            }

            // Cifrar contraseña
            const hashedPassword = await bcrypt.hash(password, 10)

            // Crear usuario
            const userId = await UserModel.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'employee'
            })

            return res.status(201).json({
                ok: true,
                message: 'Usuario registrado exitosamente',
                data: { id: userId, name, email }
            })

        } catch (error) {
            console.error('Error en register:', error.message)
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            // Validar campos
            if (!email || !password) {
                return res.status(400).json({
                    ok: false,
                    message: 'Email y contraseña son obligatorios'
                })
            }

            // Buscar usuario
            const user = await UserModel.findByEmail(email)
            if (!user) {
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales incorrectas'
                })
            }

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales incorrectas'
                })
            }

            // Generar JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )

            return res.status(200).json({
                ok: true,
                message: 'Login exitoso',
                data: {
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            })

        } catch (error) {
            console.error('Error en login:', error.message)
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor'
            })
        }
    }
}

module.exports = AuthController