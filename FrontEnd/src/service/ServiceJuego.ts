import { stompClient } from './SocketCliente';
import type { Message, StompSubscription } from '@stomp/stompjs';
import type { MatchDTO, GameDTO } from './../Interface/Interfaces';

let suscripcionJugada: StompSubscription | null = null;

const JuegoService = {
    
  //Metodo para esuchar el Canal de la Jugada
  escucharJugada: (Jugada: GameDTO) => {
    if (suscripcionJugada) { suscripcionJugada.unsubscribe(); }
    JuegoService.enviarJugadaRealizada(Jugada);
      suscripcionJugada = stompClient.subscribe('/topic/Jugada', (mensaje: Message) => {
        if (mensaje.body) {
          const datos: MatchDTO = JSON.parse(mensaje.body);
          localStorage.setItem('partido',JSON.stringify(datos));
        }
      });

    console.log('📡 Escuchando el flujo de la partida en: /topic/Jugada');
    console.log(suscripcionJugada);
  },

  //Metodo para enviar la Jugada
  enviarJugadaRealizada(jugada: GameDTO): void {

    if (stompClient && stompClient.connected) {
    stompClient.publish({
    destination: '/app/JugadaRealizada',
    body: JSON.stringify(jugada) });
    console.log('Jugada Realizada: ' + jugada);
      const valour1 = jugada.card1?.Valour;
      const valour2 = jugada.card2?.Valour;

      if (typeof valour1 === 'number' && 
          typeof valour2 === 'number' && 
          valour1 > valour2) { alert('Ganaste'); }

      if (typeof valour1 === 'number' && 
          typeof valour2 === 'number' && 
          valour1 < valour2) { alert('Perdiste'); }

      if (typeof valour1 === 'number' && 
          typeof valour2 === 'number' && 
          valour1 === valour2) { alert('Empate'); }

    } else {
      console.error('No se pudo enviar la jugada: El WebSocket está desconectado.');
    }
  },
};
export default JuegoService;