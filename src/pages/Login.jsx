import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function manejarSubmit(e) {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: contrasena,
    })

    if (error) {
      setMensaje('Correo o contraseña incorrectos.')
      setCargando(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="layout-centrado">
      <section className="tarjeta-login">
        <div className="login-cabecera">
          <div className="login-circulo"></div>
          <div>
            <p className="login-titulo-app">Portal Accesible AMAC</p>
            <p className="login-subtitulo-app">Asociación de Adultos Mayores Activos</p>
          </div>
        </div>

        <h1 className="login-titulo">Bienvenido a su bolsa de trabajo AMAC</h1>
        <p className="login-desc">
          Ingrese con su cuenta para ver sus solicitudes de empleo o gestionar vacantes.
        </p>

        <div className="login-tabs">
          <Link to="/login" className="login-tab login-tab--activa">
            <span className="material-symbols-outlined">person</span> Iniciar Sesión
          </Link>
        </div>

        {mensaje && (
          <div role="alert" className="solicitud-nota solicitud-nota--roja">
            <span className="material-symbols-outlined solicitud-nota-icono--rojo">error</span>
            <p>
              <strong>{mensaje}</strong>
            </p>
          </div>
        )}

        <form onSubmit={manejarSubmit}>
          <div className="campo-formulario">
            <label htmlFor="identificador">
              Correo electrónico <span className="login-requerido">*</span>
            </label>
            <p className="campo-formulario_ayuda">Ejemplo: roberto@correo.com</p>
            <div className="input-con-icono">
              <input
                type="email"
                id="identificador"
                className="input-login"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Escriba aquí su correo"
              />
              <span className="material-symbols-outlined input-icono">account_circle</span>
            </div>
          </div>

          <div className="campo-formulario login-campo-espaciado">
            <label htmlFor="clave">
              Su Contraseña <span className="login-requerido">*</span>
            </label>
            <div className="input-con-icono">
              <input
                type="password"
                id="clave"
                className="input-login"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Escriba su clave secreta"
              />
              <span className="material-symbols-outlined input-icono login-icono-pass">
                visibility
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="boton boton--naranja login-btn-grande"
            style={{ marginTop: '1.5rem' }}
          >
            {cargando ? 'Entrando...' : 'Iniciar Sesión en AMAC'}{' '}
            <span className="material-symbols-outlined">login</span>
          </button>
        </form>

        <div className="divisor-texto">O si es su primera vez aquí:</div>

        <Link to="/registro" className="boton btn-registro-nuevo">
          <span className="material-symbols-outlined">person_add</span> Crear una cuenta nueva de
          Candidato (Gratis)
        </Link>

        <div className="login-ayuda-box">
          <div className="login-ayuda-icono">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div>
            <h2 className="login-ayuda-titulo">¿Tiene dificultades para entrar?</h2>
            <p className="login-ayuda-desc">
              Llámenos sin costo al{' '}
              <a href="tel:8002622622" className="numero-resaltado">
                800-262-2622
              </a>{' '}
              y un asesor le acompañará paso a paso.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}