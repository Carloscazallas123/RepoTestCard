import { useState } from 'react';
import type { MatchDTO, Card, GameDTO} from './../Interface/Interfaces';
import './../style/TableroJuego.css';

export const TableroJuego = ()=> {

  //Declaración de las variables
  const [cartaSeleccionada,SetCartaSeleccionada] = useState<Card | null>(null);

  //Obtención de la Partida
   const [Partida,SetPartida] = useState<MatchDTO>(() => {
        const PartidoToken = localStorage.getItem('partido');
        try {
            return PartidoToken ? JSON.parse(PartidoToken) : PartidoToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    }); console.log(Partida);

    //Obtención del Usuario Principal
    const [miJugador] = useState<String|null>(() => {
        const UserToken = localStorage.getItem('User');
        try {
            return UserToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    }); console.log(miJugador); 

  //Condición Para cambiar la Perpectiva 
   if (Partida.Player2.Username === miJugador){
    SetPartida({
      IdMatch: Partida.IdMatch,
      Player1: {
        idUser: Partida.Player2.idUser,
        Username: miJugador,
        DeskUser: Partida.Player2.DeskUser,
      },
      Player2: Partida.Player1,
      State: Partida.State,
      Points1: Partida.Points1,
      Points2: Partida.Points2,
    });
  }

    //Metodo para preparar la Jugada
    const PrepararJugada = (carta:Card) =>{
      SetCartaSeleccionada(carta);
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

      {/* ================= MARCADOR DE PUNTOS DINÁMICO ================= */}
      <div className="scoreboard">
        <div className="score-player">
          <div className="dot-status dot-player1"></div>
          <div>
            <span className="player-label">{Partida.Player1.Username ?? "Tú"}</span>
            <div className="pts-counter-p1">{Partida.Points1 ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
        <div className="score-player rival">
          <div className="dot-status dot-player2"></div>
          <div>
            <span className="player-label">{Partida.Player2.Username ?? "Rival"}</span>
            <div className="pts-counter-p2">{Partida.Points2 ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
      </div>

      {/* ================= 1. ZONA SUPERIOR: RIVAL (SIEMPRE EL OTRO) ================= */}
      <div className="rival-zone">
        <div className="rival-label">
          Mano de {Partida.Player2.Username ?? "Rival"} ({Partida.Player2.DeskUser.Cards.length ?? 0} cartas)
        </div>
        <div className="rival-hand-slots">
          {Partida.Player2.DeskUser.Cards.map((carta:Card) => (
            <div key={`rival-${carta.IdCard}`} className="rival-card-back">
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
          {Partida.Player1.DeskUser.Cards.map((carta: Card) => {
          // Comprobamos si esta carta específica es la que el jugador acaba de clickar
          // (Asegúrate de si usas carta.IdCard o carta.Card para identificarla)
          const deshabilitado = cartaSeleccionada?.IdCard === carta.IdCard;
          const esEstaCarta = cartaSeleccionada !== null;
            return (
              <button
                key={carta.IdCard}
                disabled={esEstaCarta}
                onClick={() => {
                  console.log("Carta seleccionada con clic:", carta);
                  // Le pasamos el objeto completo a tu función (¡adiós errores de TypeScript!)
                  PrepararJugada(carta); 
                }}
                // Si es la carta jugada, le metemos la clase 'jugada' para activar el CSS
                className={`card-button ${deshabilitado ? 'jugada' : ''}`} > 
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