import { useState } from 'react';
import type { MatchDTO, Card, GameDTO} from './../Interface/Interfaces';
import JuegoService from '../service/ServiceJuego';
import './../style/TableroJuego.css';

export const TableroJuego = ()=> {

  //Declaración de las variables
  const [cartaRivalSeleccionada,setCartaRivalSeleccionada] = useState<Card | null>(null);
  const [cartaSeleccionada,SetCartaSeleccionada] = useState<Card | null>(null);

  //Obtención de la Partida
   const [Partida,SetPartida] = useState<MatchDTO | null>(() => {
        const PartidoToken = localStorage.getItem('partido');
        try {
            return PartidoToken ? JSON.parse(PartidoToken) : PartidoToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    });

    //Obtención del Usuario Principal
    const [miJugador] = useState<String|null>(() => {
        const UserToken = localStorage.getItem('User');
        try {
            return UserToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    }); 

  //Condición Para cambiar la Perpectiva 
   if (Partida?.Player2.Username === miJugador){
    SetPartida({
      IdMatch: Partida.IdMatch,
      Player1: {
        idUser: Partida.Player2.idUser,
        Username: miJugador,
        DeskUser: Partida.Player2.DeskUser,
      },
      Player2: Partida.Player1,
      State: Partida.State,
      Points1: Partida.Points2,
      Points2: Partida.Points1,
    });
  }

    //Metodo para preparar la Jugada
    const PrepararJugada = (cartaa:Card) =>{
      const token=localStorage.getItem('Jugada');

        if(token) {
              const JugadaToken:GameDTO=JSON.parse(token);
              const carta: Card | null = cartaa || null;

              //Carta 1
              if(!JugadaToken.card1) {
              SetCartaSeleccionada(carta);
              const Jugada: GameDTO = { idMatch:JugadaToken.idMatch, card1: carta, };
              localStorage.setItem('Jugada',JSON.stringify(Jugada)); }
              
              //Carta 2
              if(JugadaToken.card1 && !JugadaToken.card2){
              setCartaRivalSeleccionada(carta);
              const Jugada: GameDTO = {idMatch: JugadaToken.idMatch, card1: JugadaToken.card1, card2: carta };
              localStorage.setItem('Jugada',JSON.stringify(Jugada));  }
              
              //Carta 1 || Carta 2
              if(JugadaToken.card1 && JugadaToken.card2){
                const token = localStorage.getItem('Jugada');
                if(token) {
                const Jugada: GameDTO = JSON.parse(token); 
                localStorage.setItem('Jugada',JSON.stringify(Jugada)); EnviarJugada()}
                
              }

      } else {
          const Jugada: GameDTO = { idMatch: Partida?.IdMatch, };
          localStorage.setItem('Jugada', JSON.stringify(Jugada));
          PrepararJugada(cartaa);
      }
    }

      const EnviarJugada = () =>{
      const token= localStorage.getItem('Jugada');
      if(token){
        const Jugada: GameDTO = JSON.parse(token);
        const PartidaActualizada: MatchDTO | null = JuegoService.escucharJugada(Jugada);
        SetPartida(PartidaActualizada); } }



  return (
  <div className="arena-wrapper">
    <div className="arena-container">

      {/* ================= MARCADOR DE PUNTOS DINÁMICO ================= */}
      <div className="scoreboard">
        <div className="score-player">
          <div className="dot-status dot-player1"></div>
          <div>
            <span className="player-label">{Partida?.Player1.Username ?? "Tú"}</span>
            <div className="pts-counter-p1">{Partida?.Points1 ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
        <div className="score-player rival">
          <div className="dot-status dot-player2"></div>
          <div>
            <span className="player-label">{Partida?.Player2.Username ?? "Rival"}</span>
            <div className="pts-counter-p2">{Partida?.Points2 ?? 0} <span className="pts-text">PTS</span></div>
          </div>
        </div>
      </div>

      {/* ================= 1. ZONA SUPERIOR: RIVAL (SIEMPRE EL OTRO) ================= */}
      <div className="rival-zone">
        <div className="rival-label">
          Mano de {Partida?.Player2.Username ?? "Rival"} ({Partida?.Player2.DeskUser.Cards.length ?? 0} cartas)
        </div>
        <div className="rival-hand-slots">
          {Partida?.Player2.DeskUser.Cards.map((carta:Card) => (
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
          {/* Agregamos dinámicamente la clase 'active' si el rival ya seleccionó carta */}
      <div className={`card-placeholder rival-side ${cartaRivalSeleccionada ? 'active' : ''}`}>
            {cartaRivalSeleccionada ? (
        <div className="card-placed-animation rival-card">
              <div style={{ fontSize: '18px' }}>🃏</div>

              {/* Mostramos el poder de la carta del rival en un color rojo/naranja competitivo */}
              <div style={{ fontWeight: 'bold', color: '#ef4444' }}>
                ⚔️ {cartaRivalSeleccionada.Valour}
              </div>

              <div style={{ fontSize: '10px', opacity: 0.5 }}>
            I   D: {cartaRivalSeleccionada.IdCard}
              </div>
        </div>
      ) : (
        "ESPERANDO RIVAL..."
      )}
    </div>
  </div>

        {/* Espacio Tu Carta Jugada */}
  <div className="combat-slot">
    <span className="slot-tag-player">TÚ</span>
    <div className={`card-placeholder player-side ${cartaSeleccionada ? 'active' : ''}`}>
      {cartaSeleccionada ? (
        <div className="card-placed-animation">
          <div style={{ fontSize: '18px' }}>🃏</div>
          <div style={{ fontWeight: 'bold', color: '#4ade80' }}>
            ⚔️ {cartaSeleccionada.Valour}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.5 }}>
            ID: {cartaSeleccionada.IdCard}
          </div>
        </div>
      ) : (
        "SELECCIONA UNA CARTA"
      )}
    </div>
  </div>
</div>

      {/* ================= 3. ZONA INFERIOR: TUS CARTAS EN MANO (TUS DATOS REALES) ================= */}
      <div className="player-hand-container">
        <h4 className="hand-label">Tu Mano Operativa:</h4>
        <div className="player-cards-grid">
          {Partida?.Player1.DeskUser.Cards.map((carta: Card) => {
          // Comprobamos si esta carta específica es la que el jugador acaba de clickar
          // (Asegúrate de si usas carta.IdCard o carta.Card para identificarla)
          const deshabilitado = cartaSeleccionada?.IdCard === carta.IdCard;
          const esEstaCarta = cartaSeleccionada !!= null;
            return (
              <button
                key={carta.IdCard}
                disabled={esEstaCarta}
                onClick={() => { PrepararJugada(carta); }}
                // Si es la carta jugada, le metemos la clase 'jugada' para activar el CSS
                className={`card-button ${deshabilitado ? 'oculta' : ''}`} > 
                <div style={{ fontSize: '16px' }}>🃏</div>
                <div className="card-valour">⚔️ {carta.Valour}</div>
                <div className="card-id">ID: {carta.IdCard}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};