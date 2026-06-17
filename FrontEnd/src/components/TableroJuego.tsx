import { useState, useEffect } from 'react';
import type { MatchDTO, Card } from './../Interface/Interfaces';
import './../style/TableroJuego.css';

export const TableroJuego = ()=> {
  const [cartaSeleccionada] = useState<number | null>(null);
  const [Partida] = useState<MatchDTO>(() => {
        const PartidoToken = localStorage.getItem('partido');
        try {
            return PartidoToken ? JSON.parse(PartidoToken) : PartidoToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    });
  useEffect(() => {
    const token = localStorage.getItem('partido');
    if (token) {
      try {
        const P: MatchDTO = JSON.parse(token);
        console.log(P);
      } catch (e) {
        console.error('Error parsing partido from localStorage', e);
      }
    }
  }, []);

  console.log(Partida);

  return (
  <div className="arena-wrapper">
    <div className="arena-container">
      
      {/* ================= BARRA SUPERIOR (INFORMACIÓN) ================= */}
      <div className="arena-header">
        <h3 className="arena-title">🎮 Arena de Batalla</h3>
        <span className="match-badge">
          ID PARTIDA: #{Partida?.IdMatch ?? '---'}
        </span>
      </div>

      {/* ================= MARCADOR DE PUNTOS ================= */}
      <div className="scoreboard">
        <div className="score-player">
          <div className="dot-status dot-player1"></div>
          <div>
            <span className="player-label">{Partida?.Player1?.Username ?? "Tú"}</span>
            <div className="pts-counter-p1">{Partida?.Points1 ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
        <div className="score-player rival">
          <div className="dot-status dot-player2"></div>
          <div>
            <span className="player-label">{Partida?.Player2?.Username ?? "Rival"}</span>
            <div className="pts-counter-p2">{Partida?.Points2 ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
      </div>

      {/* ================= 1. ZONA SUPERIOR: RIVAL (BOCA ABAJO) ================= */}
      <div className="rival-zone">
        <div className="rival-label">
          {/* Añadido ?. a deskUser para evitar el crash de la consola */}
          Mano de {Partida?.Player2?.Username ?? "Rival"} ({Partida?.Player2?.DeskUser?.Cards?.length ?? 0} cartas)
        </div>
        <div className="rival-hand-slots">
          {/* Aquí también protegemos con el ?.Cards?.map */}
          {Partida?.Player2?.DeskUser?.Cards?.map((carta: any, idx: number) => (
            <div key={`rival-${carta?.IdCard ?? idx}`} className="rival-card-back">
              <span style={{ fontSize: '14px' }}>❓</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 2. ZONA CENTRAL: CAMPO DE BATALLA ================= */}
      <div className="battlefield">
        <span className="battlefield-tag">CAMPO EN JUEGO</span>

        {/* Espacio Carta Rival Jugada */}
        <div className="combat-slot">
          <span className="slot-tag-rival">RIVAL</span>
          <div className="card-placeholder rival-side">
            EMPTY
          </div>
        </div>

        {/* Espacio Tu Carta Jugada */}
        <div className="combat-slot">
          <span className="slot-tag-player">TÚ</span>
          <div className={`card-placeholder player-side ${cartaSeleccionada ? 'active' : ''}`}>
            {cartaSeleccionada ? "⚔️ V" : "EMPTY"}
          </div>
        </div>
      </div>

      {/* ================= 3. ZONA INFERIOR: TUS CARTAS EN MANO ================= */}
      <div className="player-hand-container">
        <h4 className="hand-label">Tu Mano Operativa:</h4>
        <div className="player-cards-grid">
          {/* Protegido también con ?. antes de Cards */}
          {Partida?.Player1?.DeskUser?.Cards?.map((carta: any) => {
            const deshabilitado = cartaSeleccionada !== null;
            const esEstaCarta = cartaSeleccionada === carta.idCard;
            
            return (
              <button
                key={carta.idCard}
                disabled={deshabilitado}
                onClick={() => console.log('Lanzando Carta')}
                className={`card-button ${esEstaCarta ? 'selected' : ''}`}
              > 
                <div style={{ fontSize: '16px' }}>🃏</div>
                <div className="card-valour">⚔️ {carta.Valour}</div>
                <div className="card-id">ID: {carta.IdCard}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ALERTAS DE ESPERA */}
      {cartaSeleccionada && (
        <div className="wait-alert">
          ⌛ Movimiento realizado. Esperando resolución del turno de {Partida?.Player2?.Username}...
        </div>
      )}
    </div>
  </div>
  );
};