const db = require('../config/db')

const ProductModel = {
    findAll: async () => {
        const [rows] = await db.execute(
            'SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC'
        )
        return rows
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            'SELECT * FROM products WHERE id = ? AND is_active = true',
            [id]
        )
        return rows[0] || null
    },

    create: async ({ name, stock, price, category, description }) => {
        const [result] = await db.execute(
            'INSERT INTO products (name, stock, price, category, description) VALUES (?, ?, ?, ?, ?)',
            [name, stock, price, category, description]
        )
        return result.insertId
    }
}

module.exports = ProductModel