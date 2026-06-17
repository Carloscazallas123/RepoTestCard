import { useState } from 'react';
import type { MatchDTO, Card, GameDTO } from './../Interface/Interfaces';
import './../style/TableroJuego.css';

export const TableroJuego = ()=> {
  //Obtención de la Partida
   const [Partida] = useState<MatchDTO>(() => {
        const PartidoToken = localStorage.getItem('partido');
        try {
            return PartidoToken ? JSON.parse(PartidoToken) : PartidoToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    }); console.log(Partida); localStorage.removeItem('partido');

  //Repartición de Usuarios
    const nombreUsuarioLogueado = localStorage.getItem('JugadorPartida');
    let miJugador=null;  let miPuntaje=null; let rivalJugador=null; let rivalPuntaje=null;

    if(nombreUsuarioLogueado === Partida.Player1.Username){
    miJugador = Partida.Player1; miPuntaje = Partida.Points1;
    rivalJugador = Partida.Player2; rivalPuntaje = Partida.Points2;

    } else if (nombreUsuarioLogueado === Partida.Player2.Username){

    miJugador = Partida.Player2; miPuntaje = Partida.Points2;
    rivalJugador = Partida.Player1; rivalPuntaje = Partida.Points1;

    }
    console.log(miJugador);
    console.log(rivalJugador);


  //Declaración de las variables
  const [cartaSeleccionada,SetCartaSeleccionada] = useState<number | null>(null);



    //Metodo para preparar la Jugada
    const PrepararJugada = (carta:Card) =>{
      SetCartaSeleccionada(carta.IdCard);
      const Jugada='Jugada de la Partida Nº '+ Partida.IdMatch;
      const token=localStorage.getItem(Jugada);

      if(!token){
        const Game: GameDTO = { idMatch: Partida.IdMatch, card1: carta, card2: null }
        localStorage.setItem(Jugada, JSON.stringify(Game));
        console.log('Esperando a que el jugador 2');
      } else {
        console.log('Realizando Jugada...');
        const GameToken: GameDTO = JSON.parse(token);
        const Game: GameDTO = { idMatch: GameToken.idMatch, card1: GameToken.card1, card2: carta }
        console.log(Game);
      }
    }

    
    
      

  return (
  <div className="arena-wrapper">
    <div className="arena-container">
      
      {/* ... BARRA SUPERIOR ... */}

      {/* ================= MARCADOR DE PUNTOS DINÁMICO ================= */}
      <div className="scoreboard">
        <div className="score-player">
          <div className="dot-status dot-player1"></div>
          <div>
            <span className="player-label">{miJugador?.Username ?? "Tú"}</span>
            <div className="pts-counter-p1">{miPuntaje ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
        <div className="score-player rival">
          <div className="dot-status dot-player2"></div>
          <div>
            <span className="player-label">{rivalJugador?.Username ?? "Rival"}</span>
            <div className="pts-counter-p2">{rivalPuntaje ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
      </div>

      {/* ================= 1. ZONA SUPERIOR: RIVAL (SIEMPRE EL OTRO) ================= */}
      <div className="rival-zone">
        <div className="rival-label">
          Mano de {rivalJugador?.Username ?? "Rival"} ({rivalJugador?.DeskUser?.Cards?.length ?? 0} cartas)
        </div>
        <div className="rival-hand-slots">
          {rivalJugador?.DeskUser.Cards.map((carta: any, idx: number) => (
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
            {/* Aquí pintarás la carta que tiró el rival real en tu backend */}
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

      {/* ================= 3. ZONA INFERIOR: TUS CARTAS EN MANO (TUS DATOS REALES) ================= */}
      <div className="player-hand-container">
        <h4 className="hand-label">Tu Mano Operativa:</h4>
        <div className="player-cards-grid">
          {miJugador?.DeskUser?.Cards?.map((carta: any) => {
            const deshabilitado = cartaSeleccionada !== null;
            const esEstaCarta = cartaSeleccionada === carta.IdCard;
            
            return (
              <button
                key={carta.IdCard}
                disabled={deshabilitado}
                onClick={() => PrepararJugada(carta)}
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

      {/* ... ALERTAS DE ESPERA ... */}
    </div>
  </div>
);
};