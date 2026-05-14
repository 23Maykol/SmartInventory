import { Link } from 'react-router-dom'
import './ErrorPages.css'

function InDevelopment() {
    return (
        <div className="error-container">
            <h1 className="error-code">🚧</h1>
            <h2>Página en desarrollo</h2>
            <p>Esta sección estará disponible próximamente.</p>
            <Link to="/dashboard" className="btn-primary">Volver al Dashboard</Link>
        </div>
    )
}

export default InDevelopment