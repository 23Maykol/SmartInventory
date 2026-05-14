const db = require('../config/db')

const UserModel = {
    findByEmail: async (email) => {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND is_active = true',
            [email]
        )
        return rows[0] || null
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ? AND is_active = true',
            [id]
        )
        return rows[0] || null
    },

    create: async ({ name, email, password, role = 'employee' }) => {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        )
        return result.insertId
    }
}

module.exports = UserModel