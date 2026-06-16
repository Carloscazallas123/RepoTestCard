import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MatchDTO } from '../Interface/Interfaces';
import ServicioAcceso from './../service/ServiceAcceso';
import './../style/InicioJuego.css';
export const InicioJuego = () => {

  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [isSocketActivo, SetisSocketActivo] = useState<boolean>(false);
  const navegar=useNavigate();
  const encenderSocket = () =>{ ServicioAcceso.encenderSocket(); SetisSocketActivo(true); };
  const apagarSocket = () => { ServicioAcceso.apagarSocket(); SetisSocketActivo(false);};
  const escucharcanalPartida = (Nombre:string) => {
    ServicioAcceso.escucharCanal(Nombre);
    const token = localStorage.getItem('Partido');
    if (token===null) { return alert('No hay partido');}
    const Partido: MatchDTO = JSON.parse(token);
    
    console.log(Partido); navegar('/juego');
  };
  const comprobarTokenPartido = () => {
  const tokenPartido = localStorage.getItem('partido');
  console.log("============= CHEQUEO DE LOCALSTORAGE =============");

    if (tokenPartido) {
      // 2. Si existe, lo transformamos de vuelta a un objeto JavaScript legible
      const datosPartida = JSON.parse(tokenPartido);
      console.log("✅ ¡Partida encontrada en el almacenamiento local!");
      console.dir(datosPartida); // Muestra la estructura del objeto desplegable en consola
    } else {
      // 3. Si está vacío, lanzamos un aviso por consola
      console.log("❌ No hay ninguna partida guardada actualmente en 'partido'.");
    }
  
  console.log("==================================================");
  };

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
          disabled={!isSocketActivo}
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          className={`player-input ${!isSocketActivo ? 'disabled-input' : ''}`}
        />
      </div>

      {/* PANEL DE BOTONES */}
      <div className="grid-actions">
        
        {/* Botón 1: Encender */}
        <button
          type="button"
          disabled={isSocketActivo}
          onClick={() => encenderSocket()}
          className="btn btn-success">
          ⚡ Encender Socket
        </button>

        {/* Botón 2: Apagar */}
        <button
          type="button"
          disabled={!isSocketActivo}
          onClick={() => apagarSocket()}
          className="btn btn-danger">
          🛑 Apagar Socket
        </button>

        {/* Botón 3: Buscar Partida */}
        <button
          type="button"
          disabled={!isSocketActivo || !nombreUsuario.trim()}
          onClick={() => escucharcanalPartida(nombreUsuario)}
          className="btn btn-primary btn-full">
          🚀 Buscar Partida
        </button>
        {/* Botón de Depuración: Comprobar LocalStorage */}
        <button
        type="button"
        onClick={comprobarTokenPartido}
        className="btn btn-warning btn-full">
        🔍 Inspeccionar Partida Guardada
        </button>

      </div>
    </div>
  </div>
);
};