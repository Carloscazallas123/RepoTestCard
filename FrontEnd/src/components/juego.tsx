import { useEffect, useState } from 'react';
import webSocketService from './../service/Service';
import type { MatchDTO, GameDTO } from './../Interface/Interfaces';

export const TableroJuego = () => {
  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [partida, setPartida] = useState<MatchDTO | null>(null);
  const [estadoJuego, setEstadoJuego] = useState<string>('Desconectado');
  const [isSocketActivo, setIsSocketActivo] = useState<boolean>(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<number | null>(null);

  const activarConexion = () => {
    setEstadoJuego("Conectando...");
    
    webSocketService.conectar<MatchDTO, MatchDTO>(
      (matchDto) => {
        // 🌟 CONDICIÓN CORREGIDA: Si llega un null del backend
        if (!matchDto) {
          setEstadoJuego("Esperando a que se una el segundo jugador...");
          console.log("Esperando..");
          return;
        }

        // Cuando por fin llega el segundo jugador, matchDto ya NO es null:
        console.log("¡Partida Iniciada!", matchDto);
        setPartida(matchDto);
        setEstadoJuego(matchDto.state);
      },
      () => {
        setEstadoJuego("Error de comunicación con Railway");
        setIsSocketActivo(false);
      }
    );

    setIsSocketActivo(true);
    setEstadoJuego("Conectado");
  };

  // Función exclusiva para apagar el Socket y limpiar el tablero si es necesario
  const desactivarConexion = () => {
    webSocketService.desactivar();
    setIsSocketActivo(false);
    setPartida(null); // Limpiamos la partida actual al apagar el cable
    setEstadoJuego("Desconectado por el usuario");
  };

  // CICLO DE VIDA: Intentar conectar automáticamente al entrar a la pantalla
  useEffect(() => {
    activarConexion();

    // Al desmontar la pantalla (salir), nos aseguramos de apagarlo siempre
    return () => {
      webSocketService.desactivar();
    };
  }, []);

  // FLUJO: Enviar nombre a la cola de Matchmaking
  const handleBuscarPartida = (nombreUsuario:string) => {
    if (!nombreUsuario.trim()) return;
    if (!isSocketActivo) {
      alert("Debes encender el WebSocket antes de buscar partida.");
      return;
    }
    setEstadoJuego("Entrando en la cola de espera...");
    console.log("Entrando...");
    webSocketService.enviarCrearPartida(nombreUsuario);
    activarConexion();
  };

  // FLUJO: El jugador lanza una carta (Se construye el GameDTO)
  const handleEnviarJugada = (idCarta: number) => {
    if (!partida) return;

    setCartaSeleccionada(idCarta);

    const jugada: GameDTO = {
      idMatch: partida.idMatch,
      card1: idCarta,
      card2: 0 
    };

    webSocketService.enviarJugadaRealizada<GameDTO>(jugada);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* SECCIÓN NUEVA: BOTÓN DE CONTROL GLOBAL DEL SOCKET */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#f0f2f5', padding: '10px 15px', borderRadius: '6px' }}>
        <div>
          <span style={{ fontWeight: 'bold' }}>Interruptor del Servidor: </span>
          <span style={{ color: isSocketActivo ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            {isSocketActivo ? 'ENCENDIDO' : 'APAGADO'}
          </span>
        </div>
        
        <button
          onClick={isSocketActivo ? desactivarConexion : activarConexion}
          style={{
            padding: '8px 16px',
            backgroundColor: isSocketActivo ? '#dc3545' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isSocketActivo ? '🛑 Apagar Socket' : '⚡ Encender Socket'}
        </button>
      </div>

      <h2>Mesa de Cartas — <span style={{ color: '#007bff' }}>{estadoJuego}</span></h2>

      {/* VISTA 1: MENÚ DE INGRESO (Si no hay partida activa todavía) */}
      {!partida && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder={isSocketActivo ? "Introduce tu nombre de usuario" : "Enciende el socket para jugar"}
            disabled={!isSocketActivo}
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            style={{ padding: '10px', width: '250px', marginRight: '10px' }}
          />
          <button 
            disabled={!isSocketActivo} 
            onClick={() => handleBuscarPartida(nombreUsuario)} 
            style={{ padding: '10px 20px', cursor: isSocketActivo ? 'pointer' : 'not-allowed' }}
          >
            Unirse a la Cola
          </button>
        </div>
      )}

      {/* VISTA 2: TABLERO DE JUEGO ACTIVO */}
      {partida && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>ID Partida: #{partida.idMatch}</h3>
          
          {/* Marcador de Puntuaciones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{partida.player1.userName}</p>
              <p style={{ margin: '5px 0 0 0', color: 'green' }}>Puntos: {partida.points1}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{partida.player2.userName}</p>
              <p style={{ margin: '5px 0 0 0', color: 'green' }}>Puntos: {partida.points2}</p>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #eee' }} />

          {/* Renderizado de las cartas disponibles del Jugador 1 */}
          <h4 style={{ marginTop: '20px' }}>Tus Cartas en Mano:</h4>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            {partida.player1.deskUser?.cards?.map((idCarta) => (
              <button
                key={idCarta}
                disabled={cartaSeleccionada !== null || !isSocketActivo}
                onClick={() => handleEnviarJugada(idCarta)}
                style={{
                  padding: '25px 20px',
                  fontSize: '16px',
                  backgroundColor: cartaSeleccionada === idCarta ? '#28a745' : '#fff',
                  color: cartaSeleccionada === idCarta ? '#fff' : '#333',
                  border: '2px solid #ccc',
                  borderRadius: '6px',
                  cursor: (cartaSeleccionada !== null || !isSocketActivo) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                🃏 ID: {idCarta}
              </button>
            ))}
          </div>

          {cartaSeleccionada && (
            <p style={{ marginTop: '15px', color: '#28a745', fontWeight: 'bold' }}>
              Has lanzado la carta #{cartaSeleccionada}. Esperando movimiento del oponente...
            </p>
          )}
        </div>
      )}
    </div>
  );
};