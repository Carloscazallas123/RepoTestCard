import type { Message, StompSubscription } from '@stomp/stompjs';
import { stompClient } from './SocketCliente';
import type { MatchDTO } from '../Interface/Interfaces';

let suscripcionPartida: StompSubscription | null = null;
let Partida: MatchDTO|null=null;

const ServicioAcceso = {


  //Metodo para encender el Socket
  encenderSocket: () => {
    if (!stompClient.active) {
      stompClient.activate();
      console.log('⚡ Conectando el cable del WebSocket...');
    } else {
      console.log('Ya está activo');
    }
  },

  //Metodo para limpiar
  cancelarEscucha: () => {
    if (suscripcionPartida) {
      suscripcionPartida.unsubscribe();
      suscripcionPartida = null;
      console.log('🧹 Suscripción de matchmaking liberada.');
    }
  },

  //Metodo para apagar el Socket
  apagarSocket: () => {
  ServicioAcceso.cancelarEscucha();
    if (stompClient.active) {
      stompClient.deactivate();
      console.log('🛑 WebSocket desconectado y apagado por completo.');
    }
  },

  //Metodo para escuchar el canal
  escucharCanal: () => {
  console.log('Lo le que le le está llegando:' + suscripcionPartida);
  if (suscripcionPartida) { suscripcionPartida.unsubscribe(); }
  stompClient.subscribe('/topic/partida', 
    (mensaje: Message) => {
    if (mensaje.body) {
    const datos: MatchDTO = JSON.parse(mensaje.body); 
    Partida=datos;}})
    console.log(Partida);
    console.log('📡 Escuchando canal: /topic/partida');
  },

  //Metodo para Que el Usuario Introduzca su nombre
  IntroducirNombre(nameUser: string): void {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/CrearPartida',
        body: nameUser // Texto plano directo
      });
      console.log(`🚀 Nombre "${nameUser}" enviado con éxito a la cola.`);
    } else {
      console.error('No se pudo buscar partida: El WebSocket está apagado.');
    }
  }
}

export default ServicioAcceso;
