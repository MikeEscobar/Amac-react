import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function DetalleVacante() {
  const { id } = useParams()
  const { sesion, perfil } = useAuth()
  const [vacante, setVacante] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [esError, setEsError] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function cargarVacante() {
      setCargando(true)
      const { data } = await supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre, giro, telefono)')
        .eq('id', id)
        .single()

      setVacante(data)
      setCargando(false)
    }
    cargarVacante()
  }, [id])

  async function postularme() {
    if (!sesion || !vacante) return
    setEnviando(true)
    setMensaje('')

    const { error } = await supabase.from('solicitudes').insert({
      vacante_id: vacante.id,
      candidato_id: sesion.user.id,
    })

    if (error?.code === '23505') {
      setEsError(true)
      setMensaje('Ya te postulaste a esta vacante.')
    } else if (error) {
      setEsError(true)
      setMensaje('Tu registro aún no ha sido aprobado por AMAC. Por favor espera.')
    } else {
      setEsError(false)
      setMensaje('¡Listo! Tu solicitud fue enviada.')
    }
    setEnviando(false)
  }

  if (cargando) return <p role="status">Cargando información de la vacante...</p>
  if (!vacante) {
    return (
      <div className="tarjeta">
        <h1>Vacante no encontrada</h1>
        <Link to="/" className="btn-volver">
          <span className="material-symbols-outlined">arrow_back</span> Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <>
      <Link to="/" className="btn-volver">
        <span className="material-symbols-outlined">arrow_back</span> Volver al Listado de Vacantes
      </Link>

      <div className="grid-2-col">
        <article>
          <div className="cabecera-etiquetas">
            <span className="tag-verificada">
              <span className="material-symbols-outlined icono-18">verified</span> Empresa
              Verificada Inclusiva AMAC
            </span>
            <span className="vacante-fecha">Categoría: {vacante.categoria}</span>
          </div>

          <p className="vacante-codigo">VACANTE #{vacante.id}</p>
          <h1 className="vacante-titulo">{vacante.titulo}</h1>

          <div className="grid-4-col" style={{ marginBottom: '2rem' }}>
            <div className="tarjeta-info">
              <span className="material-symbols-outlined icono-primario">storefront</span>
              <div>
                <p className="tarjeta-info-label">Empresa Contratante</p>
                <strong className="tarjeta-info-valor">{vacante.empresa?.nombre}</strong>
              </div>
            </div>

            <div className="tarjeta-info tarjeta-info--consejo">
              <span className="material-symbols-outlined icono-acento">payments</span>
              <div>
                <p className="tarjeta-info-label">Sueldo Ofrecido</p>
                <strong className="tarjeta-info-valor tarjeta-info-valor--resaltado">
                  ${Number(vacante.sueldo).toLocaleString('es-MX')} MXN mensuales
                </strong>
              </div>
            </div>

            <div className="tarjeta-info">
              <span className="material-symbols-outlined icono-info">schedule</span>
              <div>
                <p className="tarjeta-info-label">Horario</p>
                <strong className="tarjeta-info-valor">{vacante.horario}</strong>
              </div>
            </div>

            <div className="tarjeta-info">
              <span className="material-symbols-outlined icono-info">location_on</span>
              <div>
                <p className="tarjeta-info-label">Zona de Trabajo</p>
                <strong className="tarjeta-info-valor">{vacante.ubicacion}</strong>
              </div>
            </div>
          </div>

          <section className="vacante-titulo">
            <h2 className="titulo-seccion-vacante">Descripción del Puesto</h2>
            <p>{vacante.descripcion}</p>
          </section>

          <section className="vacante-titulo">
            <h2 className="titulo-seccion-vacante">¿Qué requisitos solicitamos?</h2>
            <p>{vacante.requisitos}</p>
          </section>

          <section className="vacante-titulo">
            <h2 className="titulo-seccion-vacante">Prestaciones y Beneficios</h2>
            <div className="tarjeta-outline">
              <strong className="prestacion-header">
                <span className="material-symbols-outlined">health_and_safety</span> Beneficios
                incluidos
              </strong>
              <p className="prestacion-desc">{vacante.prestaciones}</p>
            </div>
          </section>

          <section className="cta-final-vacante">
            <div className="cta-icono-circulo">
              <span className="material-symbols-outlined icono-primario icono-32">
                assignment_turned_in
              </span>
            </div>
            <h2 className="cta-titulo">¿Le agrada esta oportunidad de trabajo?</h2>
            <p className="cta-desc">
              Al postularse con su perfil AMAC, la empresa recibirá sus datos verificados para
              contactarle.
            </p>

            {mensaje && (
              <div
                role="alert"
                className="solicitud-nota"
                style={{
                  backgroundColor: esError ? '#fee2e2' : '#dcfce7',
                  color: esError ? '#991b1b' : '#14532d',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {mensaje}
              </div>
            )}

            {!sesion && (
              <Link to="/login" className="boton boton--naranja cta-btn">
                Inicia sesión como candidato para postularte
              </Link>
            )}

            {sesion && perfil?.rol === 'candidato' && (
              <button
                type="button"
                onClick={postularme}
                disabled={enviando}
                className="boton boton--naranja cta-btn"
              >
                <span className="material-symbols-outlined">check_circle</span>
                {enviando ? 'Enviando solicitud...' : 'Postularme Ahora con mi Perfil'}
              </button>
            )}

            {sesion && perfil?.rol === 'empresa' && (
              <p className="cta-nota">Iniciaste sesión con una cuenta de empresa.</p>
            )}
          </section>
        </article>

        <aside>
          <div className="tarjeta-sidebar">
            <div className="tarjeta">
              <h3 className="sidebar-header">
                <span className="material-symbols-outlined icono-acento">bolt</span> Acciones
                Rápidas
              </h3>
              <p className="sidebar-sub">Sin complicaciones técnicas.</p>

              {sesion && perfil?.rol === 'candidato' && (
                <button
                  type="button"
                  onClick={postularme}
                  disabled={enviando}
                  className="boton boton--naranja btn-mb"
                >
                  <span className="material-symbols-outlined">check_circle</span> Postularme a esta
                  vacante
                </button>
              )}

              {!sesion && (
                <Link to="/login" className="boton boton--naranja btn-mb">
                  <span className="material-symbols-outlined">login</span> Iniciar sesión para
                  postularme
                </Link>
              )}

              {vacante.telefono_contacto && (
                <a
                  href={`tel:${vacante.telefono_contacto}`}
                  className="boton boton--outline btn-mb"
                >
                  <span className="material-symbols-outlined">call</span> Llamar a la Empresa:{' '}
                  {vacante.telefono_contacto}
                </a>
              )}

              <ul className="lista-garantias">
                <li>
                  <span className="material-symbols-outlined">verified_user</span>
                  <span>Vacante supervisada por el equipo AMAC A.C.</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">gavel</span>
                  <span>Prohibida la discriminación por edad o género.</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">diversity_3</span>
                  <span>Respeto a horarios médicos y descansos.</span>
                </li>
              </ul>
            </div>

            <div className="tarjeta sidebar-ayuda">
              <div className="sidebar-ayuda-header">
                <span className="material-symbols-outlined icono-32 icono-acento">
                  support_agent
                </span>
                <div>
                  <h3 className="sidebar-ayuda-titulo">¿Prefiere postularse por teléfono?</h3>
                  <p className="sidebar-ayuda-desc">Un asesor de AMAC le apoya con gusto.</p>
                </div>
              </div>
              <p className="sidebar-ayuda-nota">
                Si se le complica algún paso o desea que tomemos sus datos vía telefónica, marque
                gratis ahora:
              </p>
              <a href="tel:8002622622" className="boton boton--naranja">
                <span className="material-symbols-outlined">call</span> Llamar al 800-AMAC-24
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}