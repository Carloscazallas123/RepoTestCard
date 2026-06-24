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
          
          <h2 className="lobby-title">Registro de Aventurero</h2>
          <div className="title-divider"></div>

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
            
            {/* Botón 1: Encender */}
            <button
              type="button"
              disabled={isSocketActivo || enCola}
              onClick={() => encenderSocket()}
              className="classic-btn btn-stone-success">
              <span className="btn-icon">⚡</span> Vincular Canal
            </button>

            {/* Botón 2: Apagar */}
            <button
              type="button"
              disabled={!isSocketActivo || enCola}
              onClick={() => apagarSocket()}
              className="classic-btn btn-stone-danger">
              <span className="btn-icon">🛑</span> Cortar Vínculo
            </button>

            {/* Botón 3: Buscar Partida */}
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