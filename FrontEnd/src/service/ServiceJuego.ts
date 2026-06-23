import { stompClient } from './SocketCliente';
import type { Message, StompSubscription } from '@stomp/stompjs';
import type { GameDTO, Card } from './../Interface/Interfaces';

let suscripcionJugada: StompSubscription | null = null;

const JuegoService = {
    
  //Metodo para esuchar el Canal de la Jugada
  escucharJugada (Carta: Card): void {
    if (suscripcionJugada) { suscripcionJugada.unsubscribe(); }
    JuegoService.enviarJugadaRealizada(Carta);
      suscripcionJugada = stompClient.subscribe('/topic/Jugada', (mensaje: Message) => {
        if (mensaje.body) {
          const datos: GameDTO = JSON.parse(mensaje.body);
          localStorage.setItem('Jugada',JSON.stringify(datos));
        }
      });
    console.log('📡 Escuchando el flujo de la partida en: /topic/Jugada');
    console.log(suscripcionJugada);
  },

  //Metodo para enviar la Jugada
  enviarJugadaRealizada(Carta: Card): void {
    if (stompClient && stompClient.connected) {
    stompClient.publish({
    destination: '/app/JugadaRealizada',
    body: JSON.stringify(Carta) });

    console.log('Carta añadida a la cola');
    } else {
      console.error('No se pudo enviar la jugada: El WebSocket está desconectado.');
    }
  },

};
export default JuegoService;