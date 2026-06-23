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
  const [PuntajeJ1 ,SetPuntajeJ1] = useState<number | null | undefined >(Partida?.Points1);
  const [PuntajeJ2 ,SetPuntajeJ2] = useState<number | null | undefined >(Partida?.Points1);
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
        if(Partida?.IdMatch == Jugada.IdMatch){
          if (Partida?.Player1.Username === miJugador) {
          setCartaRivalSeleccionada(Jugada.Card1); 
        } else {setCartaRivalSeleccionada(Jugada.Card2);}
          console.log('Realizando Jugada...');
           if (EnBusqueda.current) clearInterval(EnBusqueda.current);
          RealizarJugada(Jugada);
          }
        }
      }, 1000);
    }

    const RealizarJugada= (Jugada:GameDTO)=> {
    const Carta1: Card | null | undefined = Jugada.Card1;
    const Carta2: Card | null | undefined = Jugada.Card2;
    if (!Carta1 || !Carta2) return;

    //Caso que Gana el Jugador 1
    if (Carta1.Valour > Carta2.Valour) {
      if (Partida?.Player1.Username === miJugador){
      SetPuntajeJ2((PuntajeJ2 ?? 0) + 150);  
      } else { SetPuntajeJ1((PuntajeJ1 ?? 0) + 150);   }

      setTimeout(() => { 
      setCartaRivalSeleccionada(null); 
      SetCartaSeleccionada(null); }, 3000);}

    //Caso que Gana el Jugador 2
    if (Carta1.Valour < Carta2.Valour) {
      if (Partida?.Player1.Username === miJugador){
      SetPuntajeJ1((PuntajeJ1 ?? 0) + 150); 
      } else { SetPuntajeJ2((PuntajeJ2 ?? 0) + 150);   }

      setTimeout(() => { 
      setCartaRivalSeleccionada(null); 
      SetCartaSeleccionada(null); }, 3000);}

    //Caso de Empate
    if (Carta1.Valour === Carta2.Valour) {
      SetPuntajeJ1((PuntajeJ1 ?? 0) + 150);  
      SetPuntajeJ2((PuntajeJ2 ?? 0) + 150);  

      setTimeout(() => { 
      setCartaRivalSeleccionada(null); 
      SetCartaSeleccionada(null); }, 3000); }
      
      localStorage.removeItem('Jugada');
      ActualizarMazo(Carta1, Carta2)
  }

    const ActualizarMazo=(Carta1:Card,Carta2:Card) =>{
      if (!Partida) return;
      let desk1 = Partida.Player1.DeskUser;
      let desk2 = Partida.Player2.DeskUser;
      if (Partida?.Player2.Username === miJugador) {
      desk1 = Partida.Player2.DeskUser;
      desk2 = Partida.Player1.DeskUser; }

      if (!desk1 || !desk2) return;

      let mazoActualizadoP1 = desk1.Cards?.filter(carta => carta.idCard !== Carta1.idCard &&
                                                  carta.idCard !== Carta2.idCard );

      let mazoActualizadoP2 = desk2.Cards?.filter(carta => carta.idCard !== Carta1.idCard &&
                                                  carta.idCard !== Carta2.idCard );

      //Perspectiva 1
      SetPartida({
        ...Partida,
        Points1: PuntajeJ1,
        Points2: PuntajeJ2,
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

        {/* ================= MARCADOR DE PUNTOS GAMER ================= */}
        <div className="scoreboard">
          <div className="score-player player1-box">
            <div className="player-avatar-wrapper">
              <div className="dot-status dot-player1"></div>
              <span className="player-label">{Partida?.Player1?.Username ?? "TÚ"}</span>
            </div>
            <div className="pts-counter-p1">
              {PuntajeJ1} <span className="pts-text">PTS</span>
            </div>
          </div>

          <div className="vs-badge">VS</div>

          <div className="score-player player2-box rival">
            <div className="player-avatar-wrapper">
              <span className="player-label">{Partida?.Player2?.Username ?? "RIVAL"}</span>
              <div className="dot-status dot-player2"></div>
            </div>
            <div className="pts-counter-p2">
              {PuntajeJ2} <span className="pts-text">PTS</span>
            </div>
          </div>
        </div>

        {/* ================= ZONA SUPERIOR: MANO DEL RIVAL ================= */}
        <div className="rival-zone">
          <div className="zone-header">
            <span className="cyber-tag rival-tag">RIVAL DISPOSITIVOS</span>
            <span className="cards-count">
              Mano: <strong>{Partida?.Player2?.DeskUser?.Cards?.length ?? 0}</strong> u.
            </span>
          </div>
          <div className="rival-hand-slots">
            {Partida?.Player2?.DeskUser?.Cards?.map((carta) => (
              <div key={`rival-${carta.idCard}`} className="rival-card-back">
                <div className="card-pattern"></div>
                <span className="cyber-icon">⚡</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ZONA CENTRAL: CAMPO DE BATALLA ================= */}
        <div className="battlefield">
          <div className="battlefield-grid">
            
            {/* Slot Carta Rival */}
            <div className="combat-slot-wrapper">
              <span className="slot-indicator rival-color">RIVAL SLOT</span>
              <div className={`combat-slot rival-side ${cartaRivalSeleccionada ? 'active' : ''}`}>
                {cartaRivalSeleccionada ? (
                  <div className="card-placed rival-card-style">
                    <div className="card-glow"></div>
                    <div className="card-header-id">#ID: {cartaRivalSeleccionada.idCard}</div>
                    <div className="card-body-icon">🛸</div>
                    <div className="card-power">
                      <span className="sword-icon">⚔️</span> {cartaRivalSeleccionada.Valour}
                    </div>
                  </div>
                ) : (
                  <div className="waiting-placeholder pulse">
                    <span className="loading-dots">ESPERANDO HOSTIL...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Slot Tu Carta */}
            <div className="combat-slot-wrapper">
              <span className="slot-indicator player-color">YOUR SLOT</span>
              <div className={`combat-slot player-side ${cartaSeleccionada ? 'active' : ''}`}>
                {cartaSeleccionada ? (
                  <div className="card-placed player-card-style">
                    <div className="card-glow"></div>
                    <div className="card-header-id">#ID: {cartaSeleccionada.idCard}</div>
                    <div className="card-body-icon">🛡️</div>
                    <div className="card-power">
                      <span className="sword-icon">⚔️</span> {cartaSeleccionada.Valour}
                    </div>
                  </div>
                ) : (
                  <div className="waiting-placeholder border-flash">
                    <span>SELECCIONA TÁCTICA</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ================= ZONA INFERIOR: TU MANO OPERATIVA ================= */}
        <div className="player-hand-container">
          <div className="zone-header">
            <span className="cyber-tag player-tag">MANO OPERATIVA</span>
            <span className="cards-count">Habilidades Listas</span>
          </div>
          
          <div className="player-cards-grid">
            {Partida?.Player1?.DeskUser?.Cards?.map((carta) => {
              const yaJugada = cartaSeleccionada?.idCard === carta.idCard;
              const manoBloqueada = cartaSeleccionada != null;
              
              return (
                <button
                  key={carta.idCard}
                  disabled={manoBloqueada}
                  onClick={() => PrepararJugada(carta)}
                  className={`card-button ${yaJugada ? 'card-faded' : ''}`}
                >
                  <div className="btn-glitch-effect"></div>
                  <div className="card-btn-id">ID: {carta.idCard}</div>
                  <div className="card-btn-icon">👾</div>
                  <div className="card-btn-valour">
                    <span>PWR</span> <strong>{carta.Valour}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};