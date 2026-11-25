import { Link } from 'react-router-dom'

export default function TarjetaVacante({ vacante }) {
  return (
    <article className="tarjeta-vacante-listado">
      <div className="vacante-tags-top">
        <div className="vacante-tags-grupo">
          <span className="tag-horario-azul">
            <span className="material-symbols-outlined icono-14">schedule</span> {vacante.horario}
          </span>
          <span className="tag-sueldo-rojo">
            <span className="material-symbols-outlined icono-14">payments</span> Sueldo: $
            {Number(vacante.sueldo).toLocaleString('es-MX')} MXN mensuales
          </span>
          <span className="etiqueta etiqueta--neutral">{vacante.categoria}</span>
        </div>
      </div>

      <h3 className="vacante-listado-titulo">{vacante.titulo}</h3>

      <div className="vacante-listado-empresa">
        <span className="material-symbols-outlined icono-18">domain</span>{' '}
        {vacante.empresa?.nombre || 'Empresa Verificada AMAC'}
      </div>

      <div className="vacante-listado-ubicacion">
        <span className="material-symbols-outlined icono-18">location_on</span> {vacante.ubicacion}
      </div>

      <div className="vacante-listado-footer">
        <p className="vacante-listado-desc">{vacante.descripcion}</p>
        <Link to={`/vacantes/${vacante.id}`} className="boton boton--oscuro btn-auto">
          Ver detalles de esta vacante
        </Link>
      </div>
    </article>
  )
}