import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MisSolicitudes() {
  const { sesion, perfil } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)

  async function cargarSolicitudes() {
    if (!sesion) return
    setCargando(true)
    const { data } = await supabase
      .from('solicitudes')
      .select(
        'id, estatus, creada_en, vacante:vacantes(id, titulo, sueldo, horario, ubicacion, empresa:perfiles(nombre))'
      )
      .eq('candidato_id', sesion.user.id)
      .order('creada_en', { ascending: false })

    if (data) setSolicitudes(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarSolicitudes()
  }, [sesion])

  async function cancelarSolicitud(solicitud) {
    if (!window.confirm('¿Seguro que quieres cancelar esta solicitud?')) return

    const { error } = await supabase
      .from('solicitudes')
      .update({ estatus: 'Cancelada' })
      .eq('id', solicitud.id)

    if (!error) {
      cargarSolicitudes()
    }
  }

  function claseTarjeta(estatus) {
    if (estatus === 'Aceptada') return 'tarjeta-solicitud tarjeta-solicitud--entrevista'
    if (estatus === 'Rechazada' || estatus === 'Cancelada')
      return 'tarjeta-solicitud tarjeta-solicitud--concluida'
    return 'tarjeta-solicitud tarjeta-solicitud--revision'
  }

  function claseEtiqueta(estatus) {
    if (estatus === 'Aceptada') return 'solicitud-etiqueta solicitud-etiqueta--entrevista'
    if (estatus === 'Rechazada' || estatus === 'Cancelada')
      return 'solicitud-etiqueta solicitud-etiqueta--concluida'
    return 'solicitud-etiqueta solicitud-etiqueta--revision'
  }

  return (
    <>
      <div className="ruta-navegacion">
        <span className="material-symbols-outlined ruta-icono">home</span> Panel Personal de
        Seguimiento / {perfil?.nombre}
      </div>

      <div className="panel-header">
        <div>
          <h1 className="panel-titulo">Mis Solicitudes de Empleo</h1>
          <p className="panel-desc">
            Consulte el estado de las vacantes a las que se ha postulado con total claridad.
          </p>
        </div>
        <div className="panel-contador">
          <span className="panel-contador-num">{solicitudes.length}</span>
          <span className="panel-contador-texto">Postulaciones registradas</span>
        </div>
      </div>

      {!perfil?.aprobado && (
        <div className="solicitud-nota solicitud-nota--roja">
          <span className="material-symbols-outlined solicitud-nota-icono--rojo">info</span>
          <p>
            <strong>Cuenta pendiente de validación AMAC:</strong> Un administrador debe aprobar tu
            perfil antes de poder postularte a vacantes.
          </p>
        </div>
      )}

      {cargando && <p role="status">Cargando tus solicitudes...</p>}

      {!cargando && solicitudes.length === 0 && (
        <div className="tarjeta">
          <p>Aún no tienes postulaciones registradas.</p>
          <Link to="/" className="boton boton--naranja btn-auto" style={{ marginTop: '1rem' }}>
            Explorar vacantes disponibles
          </Link>
        </div>
      )}

      {solicitudes.map((sol) => {
        const puedeCancelar = sol.estatus === 'Enviada' || sol.estatus === 'En revisión'
        return (
          <article key={sol.id} className={claseTarjeta(sol.estatus)}>
            <div className="solicitud-header">
              <div className="solicitud-info-principal">
                <div className="solicitud-logo">
                  <span className="material-symbols-outlined icono-primario">storefront</span>
                </div>
                <div>
                  <span className="solicitud-empresa">
                    {sol.vacante?.empresa?.nombre || 'Empresa Verificada AMAC'}
                  </span>
                  <h2 className="solicitud-puesto">{sol.vacante?.titulo}</h2>
                  <div className="solicitud-detalles-lista">
                    <span className="solicitud-detalle-item">
                      <span className="material-symbols-outlined icono-18">calendar_today</span>{' '}
                      Postulado el {new Date(sol.creada_en).toLocaleDateString('es-MX')}
                    </span>
                    {sol.vacante?.sueldo && (
                      <span className="solicitud-detalle-item solicitud-sueldo">
                        <span className="material-symbols-outlined icono-18 icono-peligro">
                          payments
                        </span>{' '}
                        ${Number(sol.vacante.sueldo).toLocaleString('es-MX')} MXN mensuales
                      </span>
                    )}
                    {sol.vacante?.horario && (
                      <span className="solicitud-detalle-item">
                        <span className="material-symbols-outlined icono-18">schedule</span>{' '}
                        {sol.vacante.horario}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className={claseEtiqueta(sol.estatus)}>Estatus: {sol.estatus}</span>
            </div>

            <div className="solicitud-footer">
              <div>
                {puedeCancelar && (
                  <button
                    type="button"
                    onClick={() => cancelarSolicitud(sol)}
                    className="btn-transparente btn-transparente--peligro"
                  >
                    <span className="material-symbols-outlined">close</span> Cancelar solicitud
                  </button>
                )}
              </div>
              <div className="solicitud-acciones">
                {sol.vacante?.id && (
                  <Link
                    to={`/vacantes/${sol.vacante.id}`}
                    className="boton boton--naranja btn-auto"
                  >
                    Ver detalle de la vacante{' '}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </>
  )
}