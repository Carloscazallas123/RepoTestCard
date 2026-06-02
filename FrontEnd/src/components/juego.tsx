import React, { useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import type { MatchDTO, GameDTO } from './../Interface/Interfaces';

export const Juego: React.FC = () => {
    // Estados del formulario y partida
    const [userName, setUserName] = useState<string>('');
    const [buscando, setBuscando] = useState<boolean>(false);
    const [partida, setPartida] = useState<MatchDTO | null>(null);
    const [mensajeTurno, setMensajeTurno] = useState<string>('Esperando jugadas...');

    // Estado local para simular las cartas elegidas en el cliente antes de enviarlas
    const [cartaSeleccionada, setCartaSeleccionada] = useState<number | null>(null);

    // Referencia para mantener la conexión del WebSocket activa
    const stompClientRef = useRef<Client | null>(null);

    // 1. Función para conectarse e iniciar Matchmaking
    const unirseALaCola = () => {
        if (!userName.trim()) return alert("Escribe tu nombre de usuario");

        setBuscando(true);

        // Configuración del cliente WebSocket (Ajusta la URL si usas Railway)
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws-endpoint', // Cambia '/ws-endpoint' por tu configuración de Spring
            onConnect: () => {
                console.log('¡Conectado al servidor de WebSockets!');

                // Suscribirse al canal de emparejamiento general
                client.subscribe('/topic/partida', (mensaje) => {
                    const datosMatch: MatchDTO = JSON.parse(mensaje.body);
                    if (datosMatch) {
                        setPartida(datosMatch);
                        setBuscando(false);
                    }
                });

                // Suscribirse al canal de los resultados de las jugadas
                client.subscribe('/topic/Jugada', (mensaje) => {
                    const datosActualizados: MatchDTO = JSON.parse(mensaje.body);
                    setPartida(prev => prev ? { ...prev, ...datosActualizados } : null);
                    if (datosActualizados.state) {
                        setMensajeTurno(datosActualizados.state);
                    }
                });

                // Enviar nuestro nombre para que el Backend nos meta en la Queue
                client.publish({
                    destination: '/app/empezarpartida',
                    body: userName
                });
            },
            onDisconnect: () => {
                console.log('Desconectado');
            }
        });

        client.activate();
        stompClientRef.current = client;
    };

    // 2. Función para enviar la jugada al servidor
    const enviarJugada = () => {
        if (!partida || cartaSeleccionada === null || !stompClientRef.current) return;

        // Estructuramos el GameDTO que espera tu método 'GameMatch(GameDTO game)'
        const jugada: GameDTO = {
            idMatch: partida.idMatch,
            // Aquí un ejemplo simplificado: Dependiendo de si eres Player1 o Player2, seteas tu carta.
            // Para la prueba, enviaremos la carta seleccionada como card1 y una fija en card2 si juegas solo.
            card1: cartaSeleccionada, 
            card2: 2 // Id de carta dummy o del rival para simular la lógica de tu controlador
        };

        stompClientRef.current.publish({
            destination: '/app/JugadaRealizada',
            body: JSON.stringify(jugada)
        });

        setCartaSeleccionada(null); // Limpiar selección
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🃏 Juego de Cartas Multiplayer</h2>

            {/* FASE 1: LOGIN / MATCHMAKING */}
            {!partida && (
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                    <h3>Ingresar a la Sala de Espera</h3>
                    <input
                        type="text"
                        placeholder="Tu Nickname..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={buscando}
                        style={{ padding: '8px', marginRight: '10px' }}
                    />
                    <button onClick={unirseALaCola} disabled={buscando} style={{ padding: '8px 16px' }}>
                        {buscando ? 'Buscando partida en la nube...' : 'Buscar Partida'}
                    </button>
                </div>
            )}

            {/* FASE 2: TABLERO DE JUEGO EN VIVO */}
            {partida && (
                <div style={{ marginTop: '20px', border: '2px solid #000', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#ddd', padding: '10px' }}>
                        <div>
                            <h4>🔴 Jugador 1: {partida.player1?.userName || userName}</h4>
                            <p>Puntos: <strong>{partida.points1 || 0}</strong></p>
                        </div>
                        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
                            <h3>VS</h3>
                            <p style={{ color: 'blue', fontWeight: 'bold' }}>{mensajeTurno}</p>
                        </div>
                        <div>
                            <h4>🔵 Jugador 2: {partida.player2?.userName || 'Rival'}</h4>
                            <p>Puntos: <strong>{partida.points2 || 0}</strong></p>
                        </div>
                    </div>

                    {/* ZONA DE CARTAS DEL USUARIO CONECTADO */}
                    <div style={{ marginTop: '30px' }}>
                        <h3>Tus Cartas Disponibles:</h3>
                        <p style={{ fontSize: '12px', color: '#666' }}>Selecciona una carta de tu mazo (IDs simulados de tu Desk):</p>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {/* Simulamos que el mazo del jugador tiene cartas con IDs del 1 al 4 para clickear */}
                            {[1, 2, 3, 4].map((idCarta) => (
                                <button
                                    key={idCarta}
                                    onClick={() => setCartaSeleccionada(idCarta)}
                                    style={{
                                        width: '70px',
                                        height: '100px',
                                        backgroundColor: cartaSeleccionada === idCarta ? '#4CAF50' : '#fff',
                                        color: cartaSeleccionada === idCarta ? '#fff' : '#000',
                                        border: '2px solid #333',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Carta ID: {idCarta}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <button 
                                onClick={enviarJugada} 
                                disabled={cartaSeleccionada === null}
                                style={{ padding: '10px 20px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Confirmar y lanzar carta al Servidor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};