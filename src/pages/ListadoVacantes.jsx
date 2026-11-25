import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaVacante from '../components/TarjetaVacante'

const HORARIOS = ['Matutino', 'Vespertino', 'Medio tiempo', 'Fines de semana']
const CATEGORIAS = [
  'Administración y Contabilidad',
  'Atención al Cliente',
  'Educación y Tutorías',
  'Comercio y Ventas',
]

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [horario, setHorario] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      let consulta = supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)')
        .eq('estado', 'activa')
        .order('creada_en', { ascending: false })

      if (busqueda.trim()) {
        const q = busqueda.trim()
        consulta = consulta.or(`titulo.ilike.%${q}%,ubicacion.ilike.%${q}%`)
      }
      if (horario) consulta = consulta.eq('horario', horario)
      if (categoria) consulta = consulta.eq('categoria', categoria)

      const { data, error } = await consulta
      if (!error && data) setVacantes(data)
      setCargando(false)
    }
    cargar()
  }, [busqueda, horario, categoria])

  return (
    <>
      <span className="etiqueta-verificadas">
        <span className="material-symbols-outlined icono-18">verified</span> Vacantes Verificadas y
        Libres de Discriminación
      </span>

      <h1 className="titulo-bolsa">Bolsa de Empleo Inclusiva para Adultos Mayores</h1>
      <p className="desc-bolsa">
        Encuentre vacantes dignas, con horarios flexibles y respetuosas de su experiencia.
      </p>

      <section className="caja-busqueda" aria-label="Buscador de empleos">
        <div className="busqueda-grid-top" style={{ gridTemplateColumns: '1fr' }}>
          <div className="campo-busqueda">
            <label htmlFor="buscar_palabra" className="campo-busqueda-label">
              <span className="material-symbols-outlined icono-18">search</span> Buscar por puesto,
              palabra clave o ubicación
            </label>
            <div className="input-busqueda-wrapper">
              <span className="material-symbols-outlined icono-busqueda-izq">search</span>
              <input
                type="text"
                id="buscar_palabra"
                className="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej. Asesor, Contador, Monterrey, CDMX..."
              />
            </div>
          </div>
        </div>

        <div className="busqueda-filtros">
          <div className="filtro-grupo">
            <span className="filtro-label">
              <span className="material-symbols-outlined icono-18">schedule</span> Horarios:
            </span>
            <button
              type="button"
              className={`btn-pill${horario === '' ? ' btn-pill--activo' : ''}`}
              onClick={() => setHorario('')}
            >
              Todos
            </button>
            {HORARIOS.map((h) => (
              <button
                key={h}
                type="button"
                className={`btn-pill${horario === h ? ' btn-pill--activo' : ''}`}
                onClick={() => setHorario(h)}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="filtro-grupo">
            <span className="filtro-label">
              <span className="material-symbols-outlined icono-18">category</span> Categoría:
            </span>
            <button
              type="button"
              className={`btn-pill${categoria === '' ? ' btn-pill--activo' : ''}`}
              onClick={() => setCategoria('')}
            >
              Todas
            </button>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn-pill${categoria === cat ? ' btn-pill--activo' : ''}`}
                onClick={() => setCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="resultados-header">
        <div>
          <h2 className="resultados-titulo">
            {cargando
              ? 'Buscando vacantes...'
              : `${vacantes.length} ${vacantes.length === 1 ? 'Vacante Disponible' : 'Vacantes Disponibles'}`}
          </h2>
          <p className="resultados-desc">
            Resultados ordenados por fecha de publicación más reciente.
          </p>
        </div>
      </div>

      {cargando && <p role="status">Cargando vacantes...</p>}
      {!cargando && vacantes.length === 0 && (
        <div className="tarjeta">
          <p role="status">No hay vacantes para mostrar.</p>
        </div>
      )}

      <div>
        {vacantes.map((v) => (
          <TarjetaVacante key={v.id} vacante={v} />
        ))}
      </div>

      <section className="cta-dudas" style={{ marginTop: '2.5rem' }}>
        <div className="cta-dudas-info">
          <div className="cta-dudas-icono-box">
            <span className="material-symbols-outlined cta-dudas-icono">support_agent</span>
          </div>
          <div>
            <h2 className="cta-dudas-titulo">¿Desea que le ayudemos a postularse por teléfono?</h2>
            <p className="cta-dudas-desc">
              Un asesor de AMAC le acompañará paso a paso para llenar sus datos o agendar una
              entrevista presencial.
            </p>
          </div>
        </div>
        <a href="tel:8002622622" className="boton boton--naranja btn-auto">
          <span className="material-symbols-outlined">call</span> Llamar al 800-262-2622
        </a>
      </section>
    </>
  )
}