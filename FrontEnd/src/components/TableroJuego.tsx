import { useRef, useState } from 'react';
import type { MatchDTO, Card, GameDTO} from './../Interface/Interfaces';
import JuegoService from '../service/ServiceJuego';
import './../style/TableroJuego.css';

export const TableroJuego = ()=> {

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


  //Varaibles
  const EnBusqueda = useRef<ReturnType<typeof setInterval> | null>(null);
  const [cartaRivalSeleccionada,setCartaRivalSeleccionada] = useState<Card | null | undefined >(null);
  const [cartaSeleccionada,SetCartaSeleccionada] = useState<Card | null | undefined >(null);

    //Metodo para preparar la Jugada
    const PrepararJugada = (carta:Card) =>{
    SetCartaSeleccionada(carta);
    const CartaEnviada: Card = {
      idCard: carta.idCard,
      Valour: carta.Valour }

    JuegoService.escucharJugada(CartaEnviada);
      //Esperamos hasta que tengamos dos cartas
      EnBusqueda.current = setInterval(() => {
      const token=localStorage.getItem('Jugada');
      if(token){
        const Jugada: GameDTO = JSON.parse(token);
        console.log(Jugada);
        if(Jugada.card1 && Jugada.card2){
          if (Partida?.Player2.Username === miJugador){
          setCartaRivalSeleccionada(Jugada.card1); }
          setCartaRivalSeleccionada(Jugada.card2);
          console.log('Realizando Jugada...');
          RealizarJugada(Jugada);
          }
        }
      }, 1000);
    }

    const RealizarJugada= (Jugada:GameDTO)=> {
    const Carta1: Card | null | undefined = Jugada.card1;
    const Carta2: Card | null | undefined = Jugada.card2;
    if (!Carta1 || !Carta2) return;
    let P1 = 0; let P2 = 0;

    //Caso que Gana el Jugador 1
    if (Carta1.Valour > Carta2.Valour) {
      P1 = (Partida?.Points1 ?? 0) + 50; }

    //Caso que Gana el Jugador 2
    if (Carta1.Valour < Carta2.Valour) {
      P2 = (Partida?.Points2 ?? 0) + 50; }

    //Caso de Empate
    if (Carta1.Valour === Carta2.Valour) {
      P1 = (Partida?.Points1 ?? 0) + 10;
      P2 = (Partida?.Points2 ?? 0) + 10; }
      ActualizarMazo(Carta1, Carta2,P1,P2)
  }

    const ActualizarMazo=(Carta1:Card,Carta2:Card,P1: number,P2: number ) =>{
      if (!Partida) return;
      const desk1 = Partida.Player1.DeskUser;
      const desk2 = Partida.Player2.DeskUser;
      if (!desk1 || !desk2) return;

      const mazoActualizadoP1 = desk1.Cards?.filter(carta => carta.idCard !== Carta1.idCard);
      const mazoActualizadoP2 = desk2.Cards?.filter(carta => carta.idCard !== Carta2.idCard);

      SetPartida({
        ...Partida,
        Points1: P1,
        Points2: P2,
        Player1: {
          ...Partida.Player1,
          DeskUser: {
            ...desk1,
            Cards: mazoActualizadoP1
          }
        },
        Player2: {
          ...Partida.Player2,
          DeskUser: {
            ...desk2,
            Cards: mazoActualizadoP2
          }
        }
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
          Mano de {Partida?.Player2.Username ?? "Rival"} ({Partida?.Player2?.DeskUser?.Cards?.length ?? 0} cartas)
        </div>
        <div className="rival-hand-slots">
          {Partida?.Player2?.DeskUser?.Cards?.map((carta:Card) => (
            <div key={`rival-${carta.idCard}`} className="rival-card-back">
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
            I   D: {cartaRivalSeleccionada.idCard}
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
            ID: {cartaSeleccionada.idCard}
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
          {Partida?.Player1?.DeskUser?.Cards?.map((carta: Card) => {
          // Comprobamos si esta carta específica es la que el jugador acaba de clickar
          // (Asegúrate de si usas carta.IdCard o carta.Card para identificarla)
          const deshabilitado = cartaSeleccionada?.idCard === carta.idCard;
          const esEstaCarta = cartaSeleccionada !!= null;
            return (
              <button
                key={carta.idCard}
                disabled={esEstaCarta}
                onClick={() => { PrepararJugada(carta); }}
                // Si es la carta jugada, le metemos la clase 'jugada' para activar el CSS
                className={`card-button ${deshabilitado ? 'oculta' : ''}`} > 
                <div style={{ fontSize: '16px' }}>🃏</div>
                <div className="card-valour">⚔️ {carta.Valour}</div>
                <div className="card-id">ID: {carta.idCard}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};