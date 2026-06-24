import { useState, useRef, useEffect } from 'react';
import type { MatchDTO } from '../Interface/Interfaces';
import ServicioAcceso from './../service/ServiceAcceso';
import { useNavigate } from 'react-router-dom';
import './../style/InicioJuego.css';

export const InicioJuego = () => {

  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [isSocketActivo, SetisSocketActivo] = useState<boolean>(false);
  const [enCola, setEnCola] = useState<boolean>(false);
  
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null); // Guardamos la referencia del setInterval
  const navigate = useNavigate();

  const encenderSocket = () => { ServicioAcceso.encenderSocket(); SetisSocketActivo(true); };
  const apagarSocket = () => { ServicioAcceso.apagarSocket(); SetisSocketActivo(false); };

  // 🚀 Función modificada para gestionar la cola con el refresco automático
  const escucharcanalPartida = (Nombre: string) => { 
    ServicioAcceso.escucharCanal(Nombre); 
    setEnCola(true); // Bloqueamos la interfaz

    // Iniciamos la comprobación cada 1 segundo (1000ms)
    intervaloRef.current = setInterval(() => {
      const tokenPartido = localStorage.getItem('partido');
      
      if (tokenPartido) {
        const datosPartida: MatchDTO = JSON.parse(tokenPartido);
        if (datosPartida.Player2) {
          console.log("¡Rival encontrado! Cancelando el cargando y redirigiendo...");
          // Limpiamos el temporizador para evitar fugas de memoria
          if (intervaloRef.current) clearInterval(intervaloRef.current);
          
          setEnCola(false);
          navigate('/juego'); // Saltamos directos al tablero
        }
      }
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  return (
  <div className="tabletop-lobby">
    <div className="lobby-container">
      
      {/* ================= MONITOR DE ESTADO DE LA TABERNA ================= */}
      <div className="classic-status-monitor">
        <span className="status-label">Conexión con el Reino:</span>
        <span className={`status-badge ${isSocketActivo ? 'status-online' : 'status-offline'}`}>
          {isSocketActivo ? '🟢 Sintonizado' : '🔴 Desconectado'}
        </span>
      </div>

      {/* ================= PERGAMINO CENTRAL DE CONTROL ================= */}
      <div className="parchment-card">
        <div className="parchment-inner-frame">
          
          {/* TÍTULO PRINCIPAL DEL JUEGO */}
          <h1 className="game-main-title">Cartas Alocadas</h1>
          <div className="title-divider-ornament">⚜️</div>

          {/* SECCIÓN DE LORE / HISTORIA */}
          <div className="lore-section">
            <p className="lore-text">
              "En los confines de la Vieja Taberna, los magos y pícaros más audaces se baten en duelo. No hay hechizos que valgan aquí; solo tu astucia, tu mazo de criaturas inestables y la impredecible magia del caos. Las cartas han sido barajadas, el tapete está listo... ¿Tienes el valor para desafiar al destino?"
            </p>
          </div>

          {/* SECCIÓN DE CÓMO SE JUEGA */}
          <div className="rules-section">
            <h3 className="rules-title">Crónicas de Batalla (Cómo Jugar)</h3>
            <ul className="rules-list">
              <li>
                <span className="rule-marker">◆</span> 
                <strong>El Vínculo:</strong> Enciende el socket para conectar tu dispositivo al servidor del Reino.
              </li>
              <li>
                <span className="rule-marker">◆</span> 
                <strong>Registro:</strong> Introduce tu apodo de aventurero para que los bardos canten tus victorias.
              </li>
              <li>
                <span className="rule-marker">◆</span> 
                <strong>El Enfrentamiento:</strong> Entra a la arena. Cada jugador recibirá un mazo de cartas con un valor de <strong>Poder (PWR)</strong> único.
              </li>
              <li>
                <span className="rule-marker">◆</span> 
                <strong>La Victoria:</strong> Selecciona tu carta sabiamente en cada turno. ¡El duelista con el mayor poder en el campo reclamará los puntos y la gloria absoluta!
              </li>
            </ul>
          </div>

          <div className="title-divider"></div>
          <h2 className="lobby-title">Registro de Aventurero</h2>

          {/* BLOQUE DEL INPUT (ESTILO MARFIL) */}
          <div className="classic-input-group">
            <label className="input-label">Nombre del Jugador</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder={isSocketActivo ? "Escribe tu apodo aquí..." : "⚠️ Activa la conexión para escribir"}
                disabled={!isSocketActivo || enCola}
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className={`classic-player-input ${!isSocketActivo || enCola ? 'disabled-input' : ''}`}
              />
            </div>
          </div>

          {/* PANEL DE ACCIONES / BOTONES CLÁSICOS */}
          <div className="classic-grid-actions">
            
            <button
              type="button"
              disabled={isSocketActivo || enCola}
              onClick={() => encenderSocket()}
              className="classic-btn btn-stone-success">
              <span className="btn-icon">⚡</span> Vincular Canal
            </button>

            <button
              type="button"
              disabled={!isSocketActivo || enCola}
              onClick={() => apagarSocket()}
              className="classic-btn btn-stone-danger">
              <span className="btn-icon">🛑</span> Cortar Vínculo
            </button>

            <button
              type="button"
              disabled={!isSocketActivo || !nombreUsuario.trim() || enCola}
              onClick={() => escucharcanalPartida(nombreUsuario)}
              className={`classic-btn btn-gold-action ${enCola ? 'pulse-gold' : ''}`}>
              {enCola ? (
                <span className="classic-loading-text">⏳ Buscando Rival...</span>
              ) : (
                <>🚀 Entrar a la Arena</>
              )}
            </button>

          </div>
        </div>
      </div>

    </div>
  </div>
);
};