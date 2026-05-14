const request = require('supertest')
const app = require('../app')

// npm install --save-dev supertest

describe('Auth endpoints', () => {

    describe('POST /api/auth/register', () => {
        it('debe registrar un usuario nuevo → 201', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: `test${Date.now()}@test.com`,
                    password: '123456'
                })
            expect(res.statusCode).toBe(201)
            expect(res.body.ok).toBe(true)
        })

        it('debe rechazar email duplicado → 409', async () => {
            const userData = { name: 'Test', email: 'duplicado@test.com', password: '123456' }
            await request(app).post('/api/auth/register').send(userData)
            const res = await request(app).post('/api/auth/register').send(userData)
            expect(res.statusCode).toBe(409)
        })

        it('debe rechazar campos vacíos → 400', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'solo@email.com' })
            expect(res.statusCode).toBe(400)
        })
    })

    describe('POST /api/auth/login', () => {
        it('debe retornar token con credenciales correctas → 200', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'duplicado@test.com', password: '123456' })
            expect(res.statusCode).toBe(200)
            expect(res.body.data.token).toBeDefined()
        })

        it('debe rechazar contraseña incorrecta → 401', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'duplicado@test.com', password: 'wrongpassword' })
            expect(res.statusCode).toBe(401)
        })
    })

})