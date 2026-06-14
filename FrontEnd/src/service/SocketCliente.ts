import { Client } from '@stomp/stompjs';

// URL de tu servidor en Railway
const SOCKET_URL = `wss://backend-cards-production.up.railway.app/juego`;

export const stompClient = new Client({
  brokerURL: SOCKET_URL,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

// Forzamos el encendido del cable al importar el servicio
if (!stompClient.active) {
  stompClient.activate();
}