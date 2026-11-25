import { Link, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Encabezado() {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <a className="saltar-contenido" href="#principal">
        Saltar al contenido
      </a>
      <header className="encabezado">
        <div className="encabezado-inner">
          <Link to="/" className="header-marca" style={{ textDecoration: 'none' }}>
            <span className="material-symbols-outlined header-marca-icono">handshake</span>
            <div>
              <strong className="header-marca-texto">AMAC</strong>
              <br />
              <span className="header-marca-sub">asociAMayores A.C. | Bolsa de Trabajo</span>
            </div>
          </Link>

          <nav className="header-nav-vacante" aria-label="Navegación principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
            >
              Buscar
              <br />
              Empleos
            </NavLink>

            {perfil?.rol === 'candidato' && (
              <NavLink
                to="/mis-solicitudes"
                className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
              >
                Mis
                <br />
                Solicitudes
              </NavLink>
            )}

            {perfil?.rol === 'empresa' && (
              <>
                <NavLink
                  to="/empresa/vacantes"
                  className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
                >
                  Mis
                  <br />
                  Vacantes
                </NavLink>
                <NavLink
                  to="/empresa/publicar"
                  className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
                >
                  Publicar
                  <br />
                  Vacante
                </NavLink>
                <NavLink
                  to="/empresa/solicitudes"
                  className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
                >
                  Solicitudes
                  <br />
                  Recibidas
                </NavLink>
              </>
            )}

            {!perfil && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
                >
                  Iniciar
                  <br />
                  Sesión
                </NavLink>
                <NavLink
                  to="/registro"
                  className={({ isActive }) => `nav-link-bloque${isActive ? ' activo' : ''}`}
                >
                  Registrarme
                  <br />
                  Gratis
                </NavLink>
              </>
            )}
          </nav>

          <div className="header-actions">
            <a href="tel:8002622622" className="btn-ayuda-header">
              <span className="material-symbols-outlined">call</span>
              <span>
                Ayuda:
                <br />
                (800) 262-2622
              </span>
            </a>

            {perfil && (
              <div className="header-usuario">
                <div>
                  <span className="header-usuario-nombre header-usuario-nombre--block">
                    {perfil.nombre}
                  </span>
                  <span className="header-usuario-rol" style={{ textTransform: 'capitalize' }}>
                    {perfil.rol}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="btn-mini"
                  title="Cerrar sesión"
                >
                  <span className="material-symbols-outlined icono-18">logout</span> Salir
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}