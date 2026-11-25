export default function Pie() {
  function cambiarTamanoTexto(px) {
    document.documentElement.style.fontSize = `${px}px`
  }

  return (
    <footer className="footer-global">
      <div className="footer-grid">
        <div>
          <div className="footer-marca">
            <div className="footer-marca-bg">
              <span className="material-symbols-outlined icono-primario icono-32">handshake</span>
            </div>
            <h2 className="footer-titulo">AMAC A.C.</h2>
          </div>
          <p>
            Fomentando el trabajo digno, inclusivo y enriquecedor para adultos mayores en toda la
            República Mexicana.
          </p>
        </div>
        <div>
          <h3>Atención Telefónica</h3>
          <ul>
            <li>
              <span className="material-symbols-outlined icono-acento">call</span>{' '}
              <strong>(800) 262-2622</strong>
            </li>
            <li className="footer-texto-claro">Lunes a Domingo, 8:00 AM - 8:00 PM</li>
            <li>
              <span className="material-symbols-outlined icono-acento">mail</span> ayuda@amac.org.mx
            </li>
          </ul>
        </div>
        <div>
          <h3>Enlaces Accesibles</h3>
          <ul>
            <li>
              <a href="/">Bolsa de Trabajo Activa</a>
            </li>
            <li>
              <a href="/registro">Registro de Candidatos</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Accesibilidad Visual</h3>
          <p className="footer-texto-claro">Ajusta el texto para facilitar la lectura:</p>
          <div className="footer-btn-letras">
            <button
              type="button"
              className="btn-letra-normal"
              onClick={() => cambiarTamanoTexto(16)}
            >
              A- Letra Normal
            </button>
            <button
              type="button"
              className="btn-letra-grande"
              onClick={() => cambiarTamanoTexto(20)}
            >
              A+ Letra Grande
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © 2026 AMAC: asociAMayores A.C. Plataforma de Empleo Incluyente para Adultos Mayores.
        </p>
        <a href="tel:8002622622" className="footer-link-box">
          <span className="material-symbols-outlined icono-acento">support_agent</span>
          <span className="footer-link-texto">
            <strong>¿Necesitas ayuda humana?</strong>
            <br />
            Llama gratis al 800-AMAC-24
          </span>
        </a>
      </div>
    </footer>
  )
}