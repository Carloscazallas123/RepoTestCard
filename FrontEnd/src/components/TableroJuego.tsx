import { useRef, useState } from 'react';
import type { MatchDTO, Card, GameDTO} from './../Interface/Interfaces';
import { useNavigate } from 'react-router-dom';
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


  //los Hooks
  const EnBusqueda = useRef<ReturnType<typeof setInterval> | null>(null);
  const [cartaRivalSeleccionada,setCartaRivalSeleccionada] = useState<Card | null | undefined >(null);
  const [cartaSeleccionada,SetCartaSeleccionada] = useState<Card | null | undefined >(null);
  const navegar = useNavigate();

    //Metodo para preparar la Jugada
    const PrepararJugada = (carta:Card) =>{
    

    JuegoService.escucharJugada(carta);

      //Esperamos hasta que tengamos dos cartas
      EnBusqueda.current = setInterval(() => {
      const token=localStorage.getItem('Jugada');
      if(token){
        let Jugada: GameDTO = JSON.parse(token);
        if(Partida?.IdMatch == Jugada.IdMatch) {

            if(carta.idCard === Jugada.Card1?.idCard){
              SetCartaSeleccionada(carta);
              setCartaRivalSeleccionada(Jugada.Card2); 
              Jugada = {IdMatch: Jugada.IdMatch, Card1: carta, Card2: Jugada.Card2 };
              console.log('Realizando Jugada...');
              if (EnBusqueda.current) clearInterval(EnBusqueda.current);
              RealizarJugada(Jugada); }

            if(carta.idCard === Jugada.Card2?.idCard){
              SetCartaSeleccionada(carta);
              setCartaRivalSeleccionada(Jugada.Card1); 
              Jugada = {IdMatch: Jugada.IdMatch, Card1: carta, Card2: Jugada.Card1 };
              console.log('Realizando Jugada...');
              if (EnBusqueda.current) clearInterval(EnBusqueda.current);
              RealizarJugada(Jugada); }
          }
        }
      }, 1000);
    }

    const RealizarJugada= (Jugada:GameDTO)=> {
    const Carta1: Card | null | undefined = Jugada.Card1;
    console.log('Carta Nº1: ' + Carta1);
    const Carta2: Card | null | undefined = Jugada.Card2;
    console.log('Carta Nº2: ' + Carta2);
    let P1= Partida?.Points1 ?? 0 ; let P2=Partida?.Points2 ?? 0;
    if (!Carta1 || !Carta2) return;

    //Caso que Gana el Jugador 
    if (Carta1.Valour > Carta2.Valour) {
      P1 = P1 + 40;
      setTimeout(() => { 
      alert('Ronda Ganada');
      setCartaRivalSeleccionada(null); 
      SetCartaSeleccionada(null); }, 2400);}

    //Caso que Gana el Oponente
    if (Carta1.Valour < Carta2.Valour) {
      P2 = P2 + 40;
      setTimeout(() => { 
      alert('Ronda Perdida');
      setCartaRivalSeleccionada(null); 
      SetCartaSeleccionada(null); }, 2400);}

    //Caso de Empate
    if (Carta1.Valour === Carta2.Valour) {
       P1 = P1 + 20; 
       P2 = P2 + 20;

      setTimeout(() => { 
      alert('Ronda Empatada');
      setCartaRivalSeleccionada(null); 
      SetCartaSeleccionada(null); }, 2400); }
      
      localStorage.removeItem('Jugada');
      ActualizarMazo(Carta1, Carta2,P1,P2)
  }

    const ActualizarMazo=(Carta1:Card,Carta2:Card,P1:number,P2:number) =>{
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
      
      //Partida Terminada
      if (mazoActualizadoP1?.length === 0 
          || mazoActualizadoP2?.length === 0) {
            setTimeout(() => {  
            console.log('Partida Terminada');
            if (P1 > P2) {
              alert('Has Ganado la Partida'); 
              JuegoService.escucharPartidaTerminada(Partida); }
            if (P1 < P2) {
              alert('Has Perdido la Partida'); 
              JuegoService.escucharPartidaTerminada(Partida);}

      
      localStorage.clear(); navegar('/'); }, 4800);}
      
    }

  return (
  <div className="tabletop-arena">
    <div className="tabletop-container">

      {/* ================= MARCADOR CLÁSICO ================= */}
      <div className="game-scoreboard">
        <div className="scoreboard-player player-one">
          <div className="player-meta">
            <span className="player-name">{Partida?.Player1?.Username ?? "Tú"}</span>
            <span className="player-status-indicator status-online"></span>
          </div>
          <div className="player-score">
            <strong>{Partida?.Points1}</strong> <span className="score-label">PTS</span>
          </div>
        </div>

        <div className="scoreboard-divider">
          <span className="divider-line"></span>
          <div className="vs-emblem">VS</div>
          <span className="divider-line"></span>
        </div>

        <div className="scoreboard-player player-two">
          <div className="player-meta">
            <span className="player-name">{Partida?.Player2?.Username ?? "Rival"}</span>
            <span className="player-status-indicator status-away"></span>
          </div>
          <div className="player-score">
            <strong>{Partida?.Points2}</strong> <span className="score-label">PTS</span>
          </div>
        </div>
      </div>

      {/* ================= ZONA SUPERIOR: MANO DEL RIVAL ================= */}
      <div className="arena-zone rival-zone">
        <div className="zone-info">
          <h3 className="zone-title">Mano del Oponente</h3>
          <span className="cards-badge">
            {Partida?.Player2?.DeskUser?.Cards?.length ?? 0} cartas
          </span>
        </div>
        <div className="hand-cards-flex rival-cards">
          {Partida?.Player2?.DeskUser?.Cards?.map((carta) => (
            <div key={`rival-${carta.idCard}`} className="classic-card-back">
              <div className="card-back-ornament"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ZONA CENTRAL: CAMPO DE BATALLA ================= */}
      <div className="battlefield-zone">
        <div className="battlefield-mat">
          
          {/* Espacio del Rival */}
          <div className="battlefield-slot rival-slot">
            <span className="slot-title">Campo Rival</span>
            <div className={`card-cradle ${cartaRivalSeleccionada ? 'has-card' : 'empty'}`}>
              {cartaRivalSeleccionada ? (
                <div className="classic-card-placed card-theme-rival">
                  <div className="card-inner-frame">
                    <div className="card-id-badge">#{cartaRivalSeleccionada.idCard}</div>
                    <div className="card-art-placeholder">👑</div>
                    <div className="card-stats-row">
                      <span className="stat-power">⚔️ {cartaRivalSeleccionada.Valour}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="classic-placeholder pulse-effect">
                  <span>Esperando jugada...</span>
                </div>
              )}
            </div>
          </div>

          {/* Espacio del Jugador */}
          <div className="battlefield-slot player-slot">
            <span className="slot-title">Tu Campo</span>
            <div className={`card-cradle ${cartaSeleccionada ? 'has-card' : 'empty'}`}>
              {cartaSeleccionada ? (
                <div className="classic-card-placed card-theme-player">
                  <div className="card-inner-frame">
                    <div className="card-id-badge">#{cartaSeleccionada.idCard}</div>
                    <div className="card-art-placeholder">🛡️</div>
                    <div className="card-stats-row">
                      <span className="stat-power">⚔️ {cartaSeleccionada.Valour}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="classic-placeholder">
                  <span>Elige una carta</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ================= ZONA INFERIOR: TU MANO ================= */}
      <div className="arena-zone player-zone">
        <div className="zone-info">
          <h3 className="zone-title">Tu Mano</h3>
          <span className="cards-badge">Cartas Disponibles</span>
        </div>
        
        <div className="player-hand-grid">
          {Partida?.Player1?.DeskUser?.Cards?.map((carta) => {
            const yaJugada = cartaSeleccionada?.idCard === carta.idCard;
            const manoBloqueada = cartaSeleccionada != null;
            
            return (
              <button
                key={carta.idCard}
                disabled={manoBloqueada}
                onClick={() => PrepararJugada(carta)}
                className={`classic-card-button ${yaJugada ? 'card-disabled' : ''}`}
              >
                <div className="card-button-frame">
                  <div className="card-btn-header">ID: {carta.idCard}</div>
                  <div className="card-btn-illustration">✨</div>
                  <div className="card-btn-footer">
                    <span className="pwr-label">PODER</span>
                    <strong className="pwr-value">{carta.Valour}</strong>
                  </div>
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