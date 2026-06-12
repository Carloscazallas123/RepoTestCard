import { stompClient } from './SocketCliente';
import type { Message, StompSubscription } from '@stomp/stompjs';
import type { MatchDTO, GameDTO } from './../Interface/Interfaces';

let suscripcionJugada: StompSubscription | null = null;

const juegoService = {
    
  //Metodo para esuchar el Canal
  escucharJugada(onJugadaReceived: (partidaActualizada: MatchDTO) => void): void {
    if (suscripcionJugada) { suscripcionJugada.unsubscribe(); }
    const suscribir = () => {
      suscripcionJugada = stompClient.subscribe('/topic/Jugada', (mensaje: Message) => {
        if (mensaje.body) {
          const datos: MatchDTO = JSON.parse(mensaje.body);
          console.log(datos);

          onJugadaReceived(datos);
        }
      });
      console.log('📡 Escuchando el flujo de la partida en: /topic/Jugada');
    };

    if (stompClient.connected) {
      suscribir();
    } else {
      // Si por alguna razón se recarga la web en mitad de la partida, esperamos al reenganche
      stompClient.onConnect = suscribir;
    }
  },

  //Metodo para enviar la Jugada
  enviarJugadaRealizada(jugada: GameDTO): void {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/JugadaRealizada',
        body: JSON.stringify(jugada) // Aquí sí mandamos un objeto serializado (JSON entero)
      });
      console.log(`🃏 Jugada enviada al servidor: Carta del jugador tirada.`);
    } else {
      console.error('No se pudo enviar la jugada: El WebSocket está desconectado.');
    }
  },

  //Metodo para Limpiar
  cancelarEscuchaJugada(): void {
    if (suscripcionJugada) {
      suscripcionJugada.unsubscribe();
      suscripcionJugada = null;
      console.log('🧹 Suscripción del tablero liberada con éxito.');
    }
  }
};
export default juegoService;