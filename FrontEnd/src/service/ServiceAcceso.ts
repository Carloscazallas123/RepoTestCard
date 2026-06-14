import type { Message, StompSubscription } from '@stomp/stompjs';
import { stompClient } from './SocketCliente';
import type { MatchDTO } from '../Interface/Interfaces';
let suscripcionPartida: StompSubscription | null = null;


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
  console.log(suscripcionPartida);
  if (suscripcionPartida) { suscripcionPartida.unsubscribe(); }
    
    const suscribir = () => {
      suscripcionPartida = 
      stompClient.subscribe('/topic/partida', 
        (mensaje: Message) => {
        if (mensaje.body) {
          const datos: MatchDTO = JSON.parse(mensaje.body);
          console.log(datos);
          if(datos===null){ console.log("Aun esperando a jugador..."); 
          } else { localStorage.setItem('partido',JSON.stringify(datos))}
        }
      });
      console.log('📡 Escuchando canal: /topic/partida');
    };
    suscribir();

    if (stompClient.connected) {
      suscribir();
    } else {
    // Si el socket se está encendiendo, esperamos a que termine de conectar
      stompClient.onConnect = suscribir;
    }
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
