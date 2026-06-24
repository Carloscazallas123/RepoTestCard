import { stompClient } from './SocketCliente';
import type { Message, StompSubscription } from '@stomp/stompjs';
import type { GameDTO, Card, MatchDTO } from './../Interface/Interfaces';

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
  },

  //Metodo para enviar la Jugada
  enviarJugadaRealizada(Carta: Card): void {
    if (stompClient && stompClient.connected) {
    stompClient.publish({
    destination: '/app/CrearJugada',
    body: JSON.stringify(Carta) });

    console.log('Carta añadida a la cola');
    } else {
      console.error('No se pudo enviar la jugada: El WebSocket está desconectado.');
    }
  },

  //Metodo para esuchar el Canal de la Jugada
  escucharPartidaTerminada (Partida: MatchDTO): void {
    if (suscripcionJugada) { suscripcionJugada.unsubscribe(); }
    JuegoService.EnviarJugadaTerminada(Partida);
      suscripcionJugada = stompClient.subscribe('/topic/Terminar', (mensaje: Message) => {
        if (mensaje.body) {
          const datos: GameDTO = JSON.parse(mensaje.body);
          localStorage.setItem('partido',JSON.stringify(datos));
          localStorage.removeItem('partido');
        }
      });
    console.log('📡 Escuchando el flujo de la partida en: /topic/Jugada');
  },

  //Metodo para enviar la Jugada
  EnviarJugadaTerminada (Partida: MatchDTO): void {
    if (stompClient && stompClient.connected) {
    stompClient.publish({
    destination: '/app/TerminarPartida',
    body: JSON.stringify(Partida) });
    console.log('Partida Enviada a la Cola para terminarla');

    } else {
      console.error('No se pudo enviar la jugada: El WebSocket está desconectado.');
    }
  },

};
export default JuegoService;