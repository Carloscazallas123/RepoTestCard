import { useState } from 'react';
import ServicioAcceso from './../service/ServiceAcceso';
import { Navigate, useNavigate } from 'react-router-dom';
import type { MatchDTO } from '../Interface/Interfaces';
export const InicioJuego = () => {

  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [isSocketActivo, SetisSocketActivo] = useState<boolean>(false);
  const navegar=useNavigate();
  const encenderSocket = () =>{ ServicioAcceso.encenderSocket(); SetisSocketActivo(true); };
  const apagarSocket = () => { ServicioAcceso.apagarSocket(); SetisSocketActivo(false);};
  const escucharcanalPartida = (Nombre:string) => {
    ServicioAcceso.escucharCanal(Nombre);
    const token = localStorage.getItem('Partido');
    if (!token) { return alert('No hay partido');}
    const Partido: MatchDTO = JSON.parse(token);
    console.log(Partido);
    navegar('/juego');
  };

  return (
    <div style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* MONITOR DE ESTADO DEL SOCKET (Solo visual) */}
      <div style={{ marginBottom: '15px', fontSize: '14px' }}>
        <span style={{ fontWeight: 'bold' }}>Estado del Servidor: </span>
        <span style={{ color: isSocketActivo ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
          {isSocketActivo ? '🟢 CONECTADO' : '🔴 DESCONECTADO'}
        </span>
      </div>

      {/* FASE 1: Formulario y botonera */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
          
          {/* Bloque del Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Nombre de jugador:</label>
            <input
              type="text"
              placeholder={isSocketActivo ? "Introduce tu nombre..." : "⚠️ Enciende el socket para poder escribir"}
              disabled={!isSocketActivo}
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
                backgroundColor: isSocketActivo ? '#fff' : '#e9ecef'
              }}
            />
          </div>

          {/* 🎛️ PANEL DE CUATRO BOTONES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
            {/* Botón 1: Encender */}
            <button
              type="button"
              disabled={isSocketActivo} // Se deshabilita si ya está encendido
              onClick={()=>{encenderSocket()}}
              style={{
                padding: '10px',
                backgroundColor: isSocketActivo ? '#ccc' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: isSocketActivo ? 'not-allowed' : 'pointer'
              }}
            >⚡ Encender Socket </button>

            {/* Botón 2: Apagar */}
            <button
              type="button"
              disabled={!isSocketActivo} // Se deshabilita si ya está apagado
              onClick={()=> apagarSocket()}
              style={{
                padding: '10px',
                backgroundColor: !isSocketActivo ? '#ccc' : '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: !isSocketActivo ? 'not-allowed' : 'pointer'
              }}
            > 🛑 Apagar Socket </button>

            {/* Botón 4: Activar el Canal */}
            <button 
              type="button"
              disabled={!isSocketActivo || !nombreUsuario.trim()} 
              onClick={()=>{escucharcanalPartida(nombreUsuario)}} 
              style={{
                padding: '10px',
                backgroundColor: (!isSocketActivo || !nombreUsuario.trim()) ? '#ccc' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: (!isSocketActivo || !nombreUsuario.trim()) ? 'not-allowed' : 'pointer'
              }}
            > 🚀 Buscar Partida </button>

          </div>
        </div>
      </div>
  );
};