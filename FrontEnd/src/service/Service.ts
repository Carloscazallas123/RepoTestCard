import SockJS from 'sockjs-client';
import { Client, type Message, type StompSubscription } from '@stomp/stompjs';

class WebSocketService {
  private stompClient: Client | null = null;
  
  // Guardamos las suscripciones de tus dos canales de Java
  private subPartida: StompSubscription | null = null;
  private subJugada: StompSubscription | null = null;
  
  // URL de tu backend en Railway
  private readonly socketUrl = `${import.meta.env.VITE_API_URL}`;

  constructor() { }

  /**
   * 1. MÉTODO PARA CONECTAR EL WEBSOCKET Y REQUISITAR SUSCRIPCIONES
   * Levanta la conexión y, en cuanto se estabiliza, te suscribe automáticamente 
   * a los dos canales de tu controlador (@SendTo).
   */
  public conectar<T, K>(
    onMatchReceived: (partida: T) => void,
    onJugadaReceived: (resultado: K) => void,
    onError?: (error: any) => void
  ): void {
    
    // Si ya existe una conexión activa, la apagamos antes para no duplicar cables
    if (this.stompClient) {
      this.desactivar();
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.socketUrl),
      
      onConnect: () => {
        console.log('--- WebSocket Conectado y Listo ---');
        
        if (this.stompClient) {
          // A) Sintonizamos automáticamente el canal de Matchmaking (/topic/partida)
          this.subPartida = this.stompClient.subscribe('/topic/partida', (mensaje: Message) => {
            if (mensaje.body) onMatchReceived(JSON.parse(mensaje.body));
          });

          // B) Sintonizamos automáticamente el canal de Juego (/topic/Jugada)
          this.subJugada = this.stompClient.subscribe('/topic/Jugada', (mensaje: Message) => {
            if (mensaje.body) onJugadaReceived(JSON.parse(mensaje.body));
          });
          
          console.log('Suscripciones a /topic/partida y /topic/Jugada activadas.');
        }
      },
      onStompError: (frame) => {
        console.error('--- Error en el Broker STOMP ---', frame);
        if (onError) onError(frame);
      }
    });

    // Enciende el interruptor del WebSocket
    this.stompClient.activate();
  }

  /**
   * 2. MÉTODO PARA DESACTIVAR Y APAGAR EL WEBSOCKET
   * Cancela las escuchas de los canales de forma educada y destruye 
   * el cable de conexión para liberar memoria tanto en el Front como en Railway.
   */
  public desactivar(): void {
    // Primero cancelamos las suscripciones de los canales si estaban escuchando
    if (this.subPartida) {
      this.subPartida.unsubscribe();
      this.subPartida = null;
    }
    if (this.subJugada) {
      this.subJugada.unsubscribe();
      this.subJugada = null;
    }

    // Apagamos la conexión principal por completo
    if (this.stompClient !== null) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('--- WebSocket Desactivado y Desconectado por Completo ---');
    }
  }

  //Metodo para crear la partida 
  public enviarCrearPartida(nameUser: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/CrearPartida',
        body: nameUser
      });
    } else {
      console.error('No se pudo buscar partida: WebSocket desconectado.');
    }
  }

  /**
   * Envía las cartas jugadas en el turno (@MessageMapping("/JugadaRealizada"))
   */
  public enviarJugadaRealizada<T>(gameDto: T): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/JugadaRealizada',
        body: JSON.stringify(gameDto)
      });
    } else {
      console.error('No se pudo enviar la jugada: WebSocket desconectado.');
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;