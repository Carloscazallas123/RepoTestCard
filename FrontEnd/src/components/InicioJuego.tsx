import { useState, useRef, useEffect } from 'react';
import type { MatchDTO } from '../Interface/Interfaces';
import ServicioAcceso from './../service/ServiceAcceso';
import { useNavigate } from 'react-router-dom';
import './../style/InicioJuego.css';

export const InicioJuego = () => {

  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [isSocketActivo, SetisSocketActivo] = useState<boolean>(false);
  const [enCola, setEnCola] = useState<boolean>(false); // ⏳ Estado para controlar el modo búsqueda
  
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
        
        // 🌟 Si el Player2 ya existe y tiene datos, significa que se completó el emparejamiento
        if (datosPartida?.Player2) {
          console.log("¡Rival encontrado! Cancelando el cargando y redirigiendo...");
          
          // Limpiamos el temporizador para evitar fugas de memoria
          if (intervaloRef.current) clearInterval(intervaloRef.current);
          
          setEnCola(false);
          navigate('/juego'); // Saltamos directos al tablero
        }
      }
    }, 1000);
  };

  const comprobarTokenPartido = () => {
    const tokenPartido = localStorage.getItem('partido');
    console.log("============= CHEQUEO DE LOCALSTORAGE =============");
    if (tokenPartido) {
      const datosPartida: MatchDTO = JSON.parse(tokenPartido);
      console.log("✅ ¡Partida encontrada en el almacenamiento local!");
      console.log(datosPartida);  
    } else {
      console.log("❌ No hay ninguna partida guardada actualmente en 'partido'."); 
    }
    console.log("==================================================");
  };

  // Limpieza de seguridad: si el usuario cierra o cambia de pestaña, destruimos el setInterval
  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  return (
    <div className="lobby-container">
      
      {/* MONITOR DE ESTADO DEL SERVIDOR */}
      <div className="status-monitor">
        <span className="status-label">Estado del Servidor:</span>
        <span className={`status-badge ${isSocketActivo ? 'online' : 'offline'}`}>
          {isSocketActivo ? '🟢 CONECTADO' : '🔴 DESCONECTADO'}
        </span>
      </div>

      {/* PANEL DE CONTROL CENTRAL */}
      <div className="control-card">
        
        {/* BLOQUE DEL INPUT */}
        <div className="input-group">
          <label className="input-label">Nombre de jugador</label>
          <input
            type="text"
            placeholder={isSocketActivo ? "Introduce tu apodo..." : "⚠️ Enciende el socket para poder escribir"}
            disabled={!isSocketActivo || enCola} // Deshabilitado también si está buscando partida
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            className={`player-input ${!isSocketActivo || enCola ? 'disabled-input' : ''}`}
          />
        </div>

        {/* PANEL DE BOTONES */}
        <div className="grid-actions">
          
          {/* Botón 1: Encender */}
          <button
            type="button"
            disabled={isSocketActivo || enCola} // Deshabilitado en cola
            onClick={() => encenderSocket()}
            className="btn btn-success">
            ⚡ Encender Socket
          </button>

          {/* Botón 2: Apagar */}
          <button
            type="button"
            disabled={!isSocketActivo || enCola} // Deshabilitado en cola
            onClick={() => apagarSocket()}
            className="btn btn-danger">
            🛑 Apagar Socket
          </button>

          {/* Botón 3: Buscar Partida */}
          <button
            type="button"
            disabled={!isSocketActivo || !nombreUsuario.trim() || enCola} // Se congela al buscar
            onClick={() => escucharcanalPartida(nombreUsuario)}
            className="btn btn-primary btn-full">
            {enCola ? (
              <span className="loading-text">⏳ Buscando Rival... Reintentando</span>
            ) : (
              "🚀 Buscar Partida"
            )}
          </button>

          {/* Botón de Depuración: Comprobar LocalStorage */}
          <button
            type="button"
            disabled={enCola} // Deshabilitado en cola
            onClick={() => comprobarTokenPartido()}
            className="btn btn-warning btn-full">
            🔍 Inspeccionar Partida Guardada
          </button>

          {/* Botón manual para ir al Tablero */}
          <button
            type="button"
            disabled={enCola} // Deshabilitado en cola
            onClick={() => navigate('/juego')}
            className="btn btn-board btn-full" >
            🎮 Ir al Tablero de Juego
          </button>

        </div>
      </div>
    </div>
  );
};