import { Client, type IMessage } from '@stomp/stompjs';
import  type { MatchDTO, GameDTO } from './../Interface/Interfaces';

class WebSocketService {
    private client: Client | null = null;

    // 1. Método para conectar al servidor e iniciar el Matchmaking
    conectar(
        userName: string, 
        onMatchFound: (match: MatchDTO) => void, 
        onJugadaResult: (match: MatchDTO) => void
    ) {
        // Configuración del cliente STOMP
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws-endpoint', // ⚠️ Ajusta '/ws-endpoint' según tu WebSocketConfig de Java
            onConnect: () => {
                console.log('🔌 [WS Service] Conectado con éxito al backend.');

                // Suscripción 1: Detectar cuando se encuentra una partida (2 jugadores en la cola)
                this.client?.subscribe('/topic/partida', (mensaje: IMessage) => {
                    const datosMatch: MatchDTO = JSON.parse(mensaje.body);
                    if (datosMatch) {
                        onMatchFound(datosMatch);
                    }
                });

                // Suscripción 2: Detectar el resultado de cada ronda/jugada tirada
                this.client?.subscribe('/topic/Jugada', (mensaje: IMessage) => {
                    const datosActualizados: MatchDTO = JSON.parse(mensaje.body);
                    if (datosActualizados) {
                        onJugadaResult(datosActualizados);
                    }
                });

                // Publicar el nombre del usuario inmediatamente para entrar en el Matchmaking
                this.client?.publish({
                    destination: '/app/empezarpartida',
                    body: userName
                });
            },
            onStompError: (frame) => {
                console.error('❌ Broker error: ' + frame.headers['message']);
            }
        });

        // Activar la conexión
        this.client.activate();
    }

    // 2. Método para enviar una jugada (GameDTO) cuando el usuario lanza una carta
    enviarJugada(jugada: GameDTO) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: '/app/JugadaRealizada',
                body: JSON.stringify(jugada)
            });
            console.log('📤 [WS Service] Jugada enviada al backend:', jugada);
        } else {
            console.error('❌ [WS Service] No se pudo enviar la jugada: No hay conexión activa.');
        }
    }

    // 3. Método para desconectarse de forma limpia (por ejemplo, si el usuario sale del juego)
    desconectar() {
        if (this.client) {
            this.client.deactivate();
            console.log('🔌 [WS Service] Desconectado del servidor.');
        }
    }
}

// Exportamos una única instancia del servicio (Patrón Singleton) para usarla en todo el Front
export const webSocketService = new WebSocketService();