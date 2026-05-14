import { Link } from 'react-router-dom'
import './ErrorPages.css'

function NotFound() {
    return (
        <div className="error-container">
            <h1 className="error-code">404</h1>
            <h2>Página no encontrada</h2>
            <p>La página que buscas no existe o fue movida.</p>
            <Link to="/login" className="btn-primary">Volver al inicio</Link>
        </div>
    )
}

export default NotFound