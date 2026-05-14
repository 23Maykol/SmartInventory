import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', stock: '', price: '', category: '', description: '' })
    const [formError, setFormError] = useState('')

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products')
            setProducts(res.data.data)
        } catch {
            setError('Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProducts() }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setFormError('')
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await api.post('/products', {
                ...form,
                stock: parseInt(form.stock),
                price: parseFloat(form.price)
            })
            setForm({ name: '', stock: '', price: '', category: '', description: '' })
            setShowForm(false)
            fetchProducts()
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error al crear producto')
        }
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Smart Inventory</h1>
                <div className="header-right">
                    <span>Hola, {user.name} ({user.role})</span>
                    <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="section-header">
                    <h2>Productos</h2>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'Cancelar' : '+ Nuevo Producto'}
                    </button>
                </div>

                {showForm && (
                    <div className="product-form">
                        <h3>Agregar Producto</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nombre *</label>
                                    <input name="name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <input name="category" value={form.category} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock *</label>
                                    <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Precio *</label>
                                    <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
                            </div>
                            {formError && <p className="error-message">{formError}</p>}
                            <button type="submit" className="btn-primary">Guardar Producto</button>
                        </form>
                    </div>
                )}

                {loading && <p className="loading">Cargando productos...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <div className="products-grid">
                        {products.length === 0 ? (
                            <p className="empty">No hay productos registrados.</p>
                        ) : (
                            products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-category">{product.category || 'Sin categoría'}</div>
                                    <h3>{product.name}</h3>
                                    <p className="product-description">{product.description || '—'}</p>
                                    <div className="product-footer">
                                        <span className="product-price">S/ {parseFloat(product.price).toFixed(2)}</span>
                                        <span className={`product-stock ${product.stock <= 5 ? 'low' : ''}`}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard