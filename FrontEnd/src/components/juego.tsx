import { useEffect, useState } from 'react';
import webSocketService from './../service/Service';
import type { MatchDTO, GameDTO } from './../Interface/Interfaces';

export const TableroJuego = () => {
  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [partida, setPartida] = useState<MatchDTO | null>(null);
  const [estadoJuego, setEstadoJuego] = useState<string>('Desconectado');
  
  // Guardamos la carta que ha seleccionado el jugador en el turno actual
  const [cartaSeleccionada, setCartaSeleccionada] = useState<number | null>(null);

  // 2. CICLO DE VIDA: Conectar al entrar, Desconectar al salir
  useEffect(() => {
    // Usamos tus interfaces MatchDTO para mapear los canales A y B
    webSocketService.conectar<MatchDTO, MatchDTO>(
      (matchDto) => {
        // Alerta de seguridad por si tu Java sigue devolviendo 'return null;' en CreateMatch
        if (!matchDto) {
          setEstadoJuego("Esperando a que se una el segundo jugador...");
          return;
        }

        console.log("¡Partida Iniciada!", matchDto);
        setPartida(matchDto);
        setEstadoJuego(matchDto.state);
      },
      (objectMatchDto) => {
        console.log("Turno resuelto por el servidor:", objectMatchDto);
        
        // Actualizamos los puntos, el estado y las cartas restadas usando tus interfaces
        setPartida((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            points1: objectMatchDto.points1,
            points2: objectMatchDto.points2,
            state: objectMatchDto.state,
            player1: objectMatchDto.player1 ?? prev.player1,
            player2: objectMatchDto.player2 ?? prev.player2
          };
        });
        
        setEstadoJuego(objectMatchDto.state);
        setCartaSeleccionada(null); // Liberamos el botón para el siguiente turno
      },
      () => {
        setEstadoJuego("Error de comunicación con Railway");
      }
    );

    // Al desmontar la pantalla, apagamos todo el WebSocket de golpe
    return () => {
      webSocketService.desactivar();
    };
  }, []);

  // 3. FLUJO: Enviar nombre a la cola de Matchmaking
  const handleBuscarPartida = () => {
    if (!nombreUsuario.trim()) return;
    setEstadoJuego("Entrando en la cola de espera...");
    webSocketService.enviarCrearPartida(nombreUsuario);
  };

  // 4. FLUJO: El jugador lanza una carta (Se construye el GameDTO)
  const handleEnviarJugada = (idCarta: number) => {
    if (!partida) return;

    setCartaSeleccionada(idCarta);

    // Construimos el GameDTO exacto que exige tu interfaz
    const jugada: GameDTO = {
      idMatch: partida.idMatch,
      card1: idCarta, // La carta que seleccionas tú
      card2: 0        // El rival enviará la suya desde su propia pantalla
    };

    // Mandamos el GameDTO estructurado por el WebSocket
    webSocketService.enviarJugadaRealizada<GameDTO>(jugada);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Mesa de Cartas — <span style={{ color: '#007bff' }}>{estadoJuego}</span></h2>

      {/* VISTA 1: MENÚ DE INGRESO (Si no hay partida activa todavía) */}
      {!partida && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Introduce tu nombre de usuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            style={{ padding: '10px', width: '250px', marginRight: '10px' }}
          />
          <button onClick={handleBuscarPartida} style={{ padding: '10px 20px', cursor: 'pointer' }}>
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
                disabled={cartaSeleccionada !== null}
                onClick={() => handleEnviarJugada(idCarta)}
                style={{
                  padding: '25px 20px',
                  fontSize: '16px',
                  backgroundColor: cartaSeleccionada === idCarta ? '#28a745' : '#fff',
                  color: cartaSeleccionada === idCarta ? '#fff' : '#333',
                  border: '2px solid #ccc',
                  borderRadius: '6px',
                  cursor: cartaSeleccionada !== null ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                🃏 ID: {idCarta}
              </button>
            ))}
          </div>

          {cartaSeleccionada && (
            <p style={{ marginTop: '15px', color: '#28a745', fontWeight: '5px' }}>
              Has lanzado la carta #{cartaSeleccionada}. Esperando movimiento del oponente...
            </p>
          )}
        </div>
      )}
    </div>
  );
};