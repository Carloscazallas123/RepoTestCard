import { Client } from '@stomp/stompjs';

// URL de tu servidor en Railway
const SOCKET_URL = `wss://backend-cards-production.up.railway.app/juego`;

export const stompClient = new Client({
  brokerURL: SOCKET_URL,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  
  onConnect: (frame) => {
    console.log('✅ ¡EXITO! Conectado con éxito al servidor STOMP:', frame);
  },
  onStompError: (frame) => {
    console.error('❌ ERROR de STOMP reportado por el servidor:', frame.headers['message']);
    console.error('Detalles:', frame.body);
  },
  onWebSocketClose: () => {
    console.warn('⚠️ El WebSocket se ha cerrado de golpe.');
  }
});