import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegistroCandidato() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [telefono, setTelefono] = useState('')
  const [edad, setEdad] = useState('')
  const [colonia, setColonia] = useState('')
  const [experiencia, setExperiencia] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function manejarRegistro(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!aceptaTerminos) {
      setErrorMsg('Debe aceptar los Términos del Servicio y Política de Privacidad.')
      return
    }

    setCargando(true)
    const { error } = await supabase.auth.signUp({
      email: correo.trim(),
      password: contrasena,
      options: {
        data: {
          rol: 'candidato',
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          edad: String(edad),
          colonia: colonia.trim(),
          experiencia: experiencia.trim(),
        },
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setCargando(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="layout-centrado">
      <section className="tarjeta-registro">
        <span className="tag-aliados">
          <span className="material-symbols-outlined icono-18">volunteer_activism</span> Paso único
          de inscripción
        </span>

        <h1 className="login-titulo">Registro Gratuito de Candidato</h1>
        <p className="login-desc">
          Llene este sencillo formulario. Si necesita ayuda o prefiere dictarnos sus datos,
          llámenos gratis al{' '}
          <a className="enlace-destacado-rojo" href="tel:8002622622">
            <span className="material-symbols-outlined icono-18">call</span> 800-262-2622
          </a>
          .
        </p>

        {errorMsg && (
          <div role="alert" className="solicitud-nota solicitud-nota--roja">
            <span className="material-symbols-outlined solicitud-nota-icono--rojo">error</span>
            <p>
              <strong>{errorMsg}</strong>
            </p>
          </div>
        )}

        <form onSubmit={manejarRegistro}>
          <div className="campo-formulario">
            <label htmlFor="nombre_candidato">
              Nombre completo <span className="login-requerido">*</span>
            </label>
            <input
              type="text"
              id="nombre_candidato"
              className="input-simple"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Roberto González Morales"
            />
          </div>

          <div className="grid-form-2-col">
            <div className="campo-formulario">
              <label htmlFor="correo_candidato">
                Correo Electrónico <span className="login-requerido">*</span>
              </label>
              <input
                type="email"
                id="correo_candidato"
                className="input-simple"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="roberto@correo.com"
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="pass_candidato">
                Contraseña (mínimo 6 caracteres) <span className="login-requerido">*</span>
              </label>
              <input
                type="password"
                id="pass_candidato"
                className="input-simple"
                minLength={6}
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Cree una contraseña"
              />
            </div>
          </div>

          <div className="grid-form-2-col">
            <div className="campo-formulario">
              <label htmlFor="telefono_candidato">
                Teléfono Celular (10 dígitos) <span className="login-requerido">*</span>
              </label>
              <input
                type="tel"
                id="telefono_candidato"
                className="input-simple"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 5512345678"
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="edad_candidato">
                Edad actual (18 a 120 años) <span className="login-requerido">*</span>
              </label>
              <input
                type="number"
                id="edad_candidato"
                className="input-simple"
                min={18}
                max={120}
                required
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Ej. 62"
              />
            </div>
          </div>

          <div className="campo-formulario">
            <label htmlFor="colonia_candidato">
              Colonia y Municipio / Alcaldía <span className="login-requerido">*</span>
            </label>
            <input
              type="text"
              id="colonia_candidato"
              className="input-simple"
              required
              value={colonia}
              onChange={(e) => setColonia(e.target.value)}
              placeholder="Ej. Del Valle, Benito Juárez"
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="experiencia_candidato">
              Experiencia laboral y habilidades principales <span className="login-requerido">*</span>
            </label>
            <textarea
              id="experiencia_candidato"
              className="input-simple"
              required
              value={experiencia}
              onChange={(e) => setExperiencia(e.target.value)}
              placeholder="Cuéntenos brevemente su trayectoria laboral o áreas en las que le gustaría trabajar..."
            />
          </div>

          <div className="opcion-tarjeta opcion-tarjeta--legal">
            <input
              type="checkbox"
              id="acepta_terminos"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              required
            />
            <div>
              <label htmlFor="acepta_terminos" className="opcion-titulo">
                Acepto los{' '}
                <span className="enlace-legal">Términos del Servicio</span> y la{' '}
                <span className="enlace-legal">Política de Privacidad</span> de AMAC A.C. *
                <br />
                <span className="opcion-desc">
                  Sus datos están protegidos y solo se comparten con empresas verificadas de AMAC.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="boton boton--naranja login-btn-grande"
          >
            {cargando ? 'Registrando...' : 'Completar mi Registro en AMAC'}{' '}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        <Link to="/login" className="enlace-destacado-rojo">
          <span className="material-symbols-outlined">login</span> ¿Ya tiene cuenta registrada?
          Inicie sesión aquí
        </Link>
      </section>
    </div>
  )
}