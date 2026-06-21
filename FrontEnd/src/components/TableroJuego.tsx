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
      Points1: Partida.Points2,
      Points2: Partida.Points1,
    });
  }

    //Metodo para preparar la Jugada
    const PrepararJugada = (carta:Card) =>{
      SetCartaSeleccionada(carta);
      const token = localStorage.getItem('Jugada');
      
        if (!token) {
          const Jugada: GameDTO = { idMatch: Partida.IdMatch, };
          localStorage.setItem('Jugada', JSON.stringify(Jugada));
        } else {

            let Jugada:GameDTO=JSON.parse(token);
            if(!Jugada.card1){
            Jugada.card1 = carta;
            return console.log('Jugada Realizada' + Jugada); }
            
          if (Jugada.card1 && !Jugada.card2){
          RealizarJugada(carta);
        }
      }
    }

    //Metodo para realizar la Jugada
    const RealizarJugada = (carta:Card) => {
      const token=localStorage.getItem('Jugada');

      if(!token){
        return console.log('Error, jugada no realizada');

      } else {
        let P1=0; let P2=0;
        const Jugada: GameDTO = JSON.parse(token);
        Jugada.card2 = carta;

        //Gana el Jugador 1
        if(Jugada.card1 && Jugada.card1.Valour > Jugada.card2.Valour){
        P1=Partida.Points1 + 150;
        alert(Partida.Player1.Username + ' Ha ganado la ronda');
        }

        //Gana el Jugador 2
        if(Jugada.card1 && Jugada.card2.Valour > Jugada.card1.Valour){
        P2=Partida.Points2 + 150;
        alert(Partida.Player2.Username + ' Ha ganado la ronda');
        }

        //Empate
        if(Jugada.card1 && Jugada.card2.Valour === Jugada.card1.Valour){
        P1=Partida.Points1 + 10;
        P2=Partida.Points2 + 10;
        alert('Empate entre ' + Partida.Player1.Username + " y " + Partida.Player2.Username);
        }

        //Actualización en el Mazo
        const nuevasCartasP2 = 
        Partida.Player2.DeskUser.Cards.filter( C => C.IdCard !== Jugada.card2?.IdCard);
        const nuevasCartasP1 =
        Partida.Player1.DeskUser.Cards.filter( C => C.IdCard !== Jugada.card1?.IdCard);
        ActualizarCartas(nuevasCartasP1,nuevasCartasP2,P1,P2);
      }
    }

    //Metodo para Actualizar la Interfaz
    const ActualizarCartas = (L1: Card[],L2:Card[],
                              P1:number,P2:number)=>{
    //Perspectiva del J2
    if(Partida.Player2.Username === miJugador) {
    SetPartida({
        ...Partida,
        Points1: P2,
        Points2: P1,
        State: Partida.State,
        Player1: {
          ...Partida.Player2,
          DeskUser: {
            ...Partida.Player2.DeskUser,
            Cards:L2,
          },
        },
        Player2: {
          ...Partida.Player1,
          DeskUser: {
            ...Partida.Player1.DeskUser,
            Cards: L1
          },
        },
      });
     }

     //Perspectiva del J1
     SetPartida({
        ...Partida,
        Points1: P1,
        Points2: P2,
        State: Partida.State,
        Player1: {
          ...Partida.Player1,
          DeskUser: {
            ...Partida.Player1.DeskUser,
            Cards:L1,
          },
        },
        Player2: {
          ...Partida.Player2,
          DeskUser: {
            ...Partida.Player2.DeskUser,
            Cards: L2
          },
        },
      });
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
            {cartaSeleccionada ? (
            <div className="card-placed-animation">
              <div style={{ fontSize: '18px' }}>🃏</div>
                <div style={{ fontWeight: 'bold', color: '#4ade80' }}>⚔️ {cartaSeleccionada.Valour}</div>
                <div style={{ fontSize: '10px', opacity: 0.5 }}>ID: {cartaSeleccionada.IdCard}</div>
            </div> ) : ( "SELECCIONA UNA CARTA" )}
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
          const esEstaCarta = cartaSeleccionada !!= null;
            return (
              <button
                key={carta.IdCard}
                disabled={esEstaCarta}
                onClick={() => {
                  console.log("Carta seleccionada: ", carta);
                  PrepararJugada(carta); 
                }}
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