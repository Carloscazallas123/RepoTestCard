import { useState } from 'react';
import type { MatchDTO, GameDTO, Card } from './../Interface/Interfaces';
import juegoService from '../service/ServiceJuego';

export const TableroJuego = ()=> {
  
  //Obtener el partido
  const [Partida] = useState<MatchDTO>(() => {
    const Partido = localStorage.getItem('partido');
    try { return Partido ? JSON.parse(Partido) : null;
        } catch (e) {
            console.error("Error al parsear el partido del localStorage", e);
            return null;
        }
    });
    
  const [cartaSeleccionada, SetCartaSeleccionada]=useState(0);
  juegoService.escucharJugada;
  const Lanzarjugada = (Carta: Card) => {
    SetCartaSeleccionada(Carta.idCard);
    const Jugada: GameDTO = { idMatch: Partida.idMatch, 
                             card1: Partida.cartaMesaPlayer1?.idCard ?? null, 
                             card2: Partida.cartaMesaPlayer2?.idCard ?? null };
    if (Jugada.card1 === null || Jugada.card2 === null){
      console.log('Aun Falta que uno de los jugadores lance una carta');
      juegoService.enviarJugadaRealizada(Jugada);
    } else {
      console.log(Jugada);
      juegoService.enviarJugadaRealizada(Jugada);
    }

  }

  return (
    <div style={{
      marginTop: '20px',
      border: '1px solid #e2e8f0',
      padding: '25px',
      borderRadius: '12px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      maxWidth: '600px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* CABECERA Y MARCADOR (Igual que antes) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1a202c', fontSize: '20px' }}>🃏 Tablero de Juego</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#4a5568', background: '#edf2f7', padding: '4px 10px', borderRadius: '15px', fontWeight: 'bold' }}>
            Partida #{Partida.idMatch}
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f7fafc', padding: '15px', borderRadius: '8px', border: '1px solid #edf2f7', marginBottom: '20px' }}>
        <div>
          <p style={{ margin: '0 0 5px 0', 
                      fontWeight: '600', 
                      color: '#4a5568', 
                      fontSize: '14px' }}> 👤 {Partida.Player1.userName} (Tú) </p>
          <p style={{ margin: 0, 
                      color: '#38a169', 
                      fontWeight: 'bold', 
                      fontSize: '22px' }}> {Partida.Points1} pts </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 5px 0', 
                      fontWeight: '600', 
                      color: '#4a5568', 
                      fontSize: '14px' }}> 👤 {Partida.Player2.userName} </p>
          <p style={{ margin: 0, 
                      color: '#38a169', 
                      fontWeight: 'bold', 
                      fontSize: '22px' }}> {Partida.Points2} pts </p>
        </div>
      </div>

      {/* 🔴 NUEVA SECCIÓN: MANO DEL JUGADOR 2 (BOCA ABAJO) */}
      <div style={{ marginBottom: '25px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e0' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#4a5568', fontSize: '14px' }}>
          Mano de {Partida.Player2.userName} ({Partida.Player2.deskUser.Cards.length} cartas):
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Partida.Player2.deskUser.Cards.map((_, index) => (
            <div
              key={`rival-card-${index}`}
              style={{
                width: '60px',
                height: '85px',
                backgroundColor: '#3182ce', // Color azul simulando el reverso
                border: '2px solid #2b6cb0',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundRepeat: 'repeating-linear-gradient(45deg, #3182ce, #3182ce 10px, #2b6cb0 10px, #2b6cb0 20px)' // Patrón de líneas de juego real
              }}
            >
              <span style={{ fontSize: '18px', color: '#fff', opacity: 0.8 }}>❓</span>
            </div>
          ))}
        </div>
      </div>

      {/* ⚔️ 3. AQUÍ VA: ZONA DE ENFRENTAMIENTO EN EL TABLERO */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        margin: '25px 0', 
        padding: '20px 15px', 
        background: '#f7fafc', 
        borderRadius: '8px', 
        border: '2px solid #edf2f7',
        textAlign: 'center'
      }}>
        <div style={{ flex: 1, borderRight: '1px solid #edf2f7' }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '13px' }}>Tu Carta en Mesa:</strong>
          {/* Si tu backend soporta esta propiedad, la pintará aquí */}
          {Partida.cartaMesaPlayer1 ? (
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2b6cb0' }}>⚔️ {Partida.cartaMesaPlayer1.valour}</span>
          ) : (
            <span style={{ fontSize: '14px', color: '#a0aec0', fontStyle: 'italic' }}>⏳ Esperando tu jugada</span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '13px' }}>Carta de {Partida.Player2.userName}:</strong>
          {/* Aquí obtienes dinámicamente la carta del oponente */}
          {Partida.cartaMesaPlayer2 ? (
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#e53e3e' }}>⚔️ {Partida.cartaMesaPlayer2.valour}</span>
          ) : (
            <span style={{ fontSize: '14px', color: '#a0aec0', fontStyle: 'italic' }}>⏳ Pensando...</span>
          )}
        </div>
      </div>

      {/* 🔵 TU ZONA: CARTAS EN MANO (BOCA ARRIBA) */}
      <h4 style={{ margin: '0 0 12px 0', color: '#2d3748', fontSize: '15px' }}>Tus cartas en mano:</h4>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {Partida.Player1.deskUser.Cards.map((carta: Card) => {
          const deshabilitado = cartaSeleccionada !== null;
          const esEstaCarta = cartaSeleccionada === carta.idCard;
          
          return (
            <button
              key={carta.idCard}
              disabled={deshabilitado}
              onClick={() => Lanzarjugada(carta)}
              style={{
                padding: '20px 15px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: esEstaCarta ? '#38a169' : '#fff',
                color: esEstaCarta ? '#fff' : '#2d3748',
                border: esEstaCarta ? '2px solid #38a169' : '2px solid #cbd5e0',
                borderRadius: '8px',
                cursor: deshabilitado ? 'not-allowed' : 'pointer',
                boxShadow: esEstaCarta ? '0 4px 8px rgba(56,161,105,0.2)' : '0 2px 4px rgba(0,0,0,0.04)',
                transform: esEstaCarta ? 'translateY(-6px)' : 'none',
                transition: 'all 0.15s ease-in-out',
                flex: '1 1 calc(33.333% - 8px)',
                minWidth: '85px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            > 
              <div style={{ fontSize: '22px' }}>🃏</div>
              <div style={{ fontSize: '18px', fontWeight: 'extrabold', color: esEstaCarta ? '#fff' : '#2b6cb0' }}>
                ⚔️ {carta.valour}
              </div>
              <div style={{ marginTop: '4px', fontSize: '11px', fontWeight: 'normal', color: esEstaCarta ? '#e6fffa' : '#718096' }}>
                ID: {carta.idCard}
              </div>
            </button>
          );
        })}
      </div>

      {/* MENSAJES DE ESTADO */}
      {cartaSeleccionada && (
        <div style={{ marginTop: '20px', padding: '12px', background: '#f0fff4', color: '#22543d', borderRadius: '6px', fontWeight: '500', fontSize: '13px', border: '1px solid #c6f6d5', textAlign: 'center' }}>
          🚀 Has lanzado tu carta. Esperando a que {Partida.Player2.userName} haga su movimiento...
        </div>
      )}
    </div>
  );
};