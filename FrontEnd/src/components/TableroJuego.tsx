import { useState, useEffect } from 'react';
import type { MatchDTO, Card } from './../Interface/Interfaces';

export const TableroJuego = ()=> {
  const [cartaSeleccionada] = useState<number | null>(null);
  const [Partida] = useState<MatchDTO>(() => {
        const PartidoToken = localStorage.getItem('partido');
        try {
            return PartidoToken ? JSON.parse(PartidoToken) : PartidoToken;
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage:", e);
            return null;
        }
    });
  useEffect(() => {
    const token = localStorage.getItem('partido');
    if (token) {
      try {
        const P: MatchDTO = JSON.parse(token);
        console.log(P);
      } catch (e) {
        console.error('Error parsing partido from localStorage', e);
      }
    }
  }, []);

  console.log(Partida);

  return (
  <div style={{
    marginTop: '20px',
    border: '1px solid #1a202c',
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: '#1a202c', // Fondo oscuro estilo Arena de Duelo
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    maxWidth: '750px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff'
  }}>
    
    {/* ================= BARRA SUPERIOR (INFORMACIÓN) ================= */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #2d3748', paddingBottom: '10px' }}>
      <h3 style={{ margin: 0, color: '#f7fafc', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🎮 Arena de Batalla
      </h3>
      <span style={{ fontSize: '11px', color: '#63b3ed', background: '#2b6cb0', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
        ID PARTIDA: #{Partida?.IdMatch ?? '---'}
      </span>
    </div>

    {/* ================= MARCADOR DE PUNTOS DE AMBOS JUGADORES ================= */}
    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#2d3748', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4299e1' }}></div>
        <div>
          <span style={{ fontSize: '12px', color: '#a0aec0', display: 'inline' }}>{Partida?.Player1?.Username ?? "Tú"}</span>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#63b3ed' }}>{Partida?.Points1 ?? 0} <span style={{fontSize: '12px'}}>PTS</span></div>
        </div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'row-reverse' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f56565' }}></div>
        <div>
          <span style={{ fontSize: '12px', color: '#a0aec0' }}>{Partida?.Player2?.Username ?? "Rival"}</span>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fc8181' }}>{Partida?.Points2 ?? 0} <span style={{fontSize: '12px'}}>PTS</span></div>
        </div>
      </div>
    </div>

    {/* ================= 1. ZONA SUPERIOR: RIVAL (BOCA ABAJO) ================= */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px' }}>
      <div style={{ fontSize: '12px', color: '#cbd5e0', marginBottom: '8px', fontWeight: '500' }}>
        Mano de {Partida?.Player2?.Username ?? "Rival"} ({Partida?.Player2?.DeskUser?.Cards?.length ?? 0} cartas)
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {Partida?.Player2?.DeskUser?.Cards?.map((carta: Card) => (
          <div
            key={`rival-${carta.idCard}`}
            style={{
              width: '50px',
              height: '70px',
              backgroundColor: '#2c5282',
              border: '2px solid #4299e1',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              background: 'repeating-linear-gradient(45deg, #2b6cb0, #2b6cb0 5px, #2c5282 5px, #2c5282 10px)'
            }}
          >
            <span style={{ fontSize: '14px', color: '#fff' }}>❓</span>
          </div>
        ))}
      </div>
    </div>

    {/* ================= 2. ZONA CENTRAL: CAMPO DE BATALLA (SEÚN TU DIBUJO) ================= */}
    <div style={{
      height: '140px',
      border: '2px dashed #4a5568',
      borderRadius: '12px',
      margin: '20px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      background: 'radial-gradient(circle, #2d3748 0%, #1a202c 100%)',
      position: 'relative'
    }}>
      {/* Etiqueta del centro */}
      <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '10px', color: '#4a5568', fontWeight: 'bold', letterSpacing: '2px' }}>
        CAMPO EN JUEGO
      </span>

      {/* Espacio Carta Rival Jugada (Arriba en el centro) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '10px', color: '#fc8181' }}>RIVAL</span>
        <div style={{
          width: '60px',
          height: '85px',
          border: '2px solid #f56565',
          borderRadius: '8px',
          background: 'rgba(245, 101, 101, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f56565',
          fontSize: '12px'
        }}>
          {/* Aquí pintarás la carta que tire el rival cuando implementes esa lógica */}
          EMPTY
        </div>
      </div>

      {/* Espacio Tu Carta Jugada (Abajo en el centro) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '10px', color: '#63b3ed' }}>TÚ</span>
        <div style={{
          width: '60px',
          height: '85px',
          border: '2px solid #4299e1',
          borderRadius: '8px',
          background: cartaSeleccionada ? 'rgba(66, 153, 225, 0.2)' : 'rgba(66, 153, 225, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4299e1',
          fontSize: '12px',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}>
          {cartaSeleccionada ? "⚔️ V" : "EMPTY"}
        </div>
      </div>
    </div>

    {/* ================= 3. ZONA INFERIOR: TUS CARTAS EN MANO ================= */}
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid #2d3748' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e0', fontSize: '13px', fontWeight: 'normal' }}>
        Tu Mano Operativa:
      </h4>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Partida?.Player1?.DeskUser?.Cards?.map((carta: any) => {
          const deshabilitado = cartaSeleccionada !== null;
          const esEstaCarta = cartaSeleccionada === carta.idCard;
          
          return (
            <button
              key={carta.idCard}
              disabled={deshabilitado}
              onClick={() => console.log('Lanzando Carta')}
              style={{
                padding: '12px 8px',
                width: '85px',
                height: '120px',
                backgroundColor: esEstaCarta ? '#2f855a' : '#2d3748',
                color: '#fff',
                border: esEstaCarta ? '2px solid #48bb78' : '2px solid #4a5568',
                borderRadius: '8px',
                cursor: deshabilitado ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                transform: esEstaCarta ? 'translateY(-10px)' : 'none',
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            > 
              <div style={{ fontSize: '16px' }}>🃏</div>
              <div style={{ fontSize: '16px', fontWeight: 'extrabold', color: '#edf2f7' }}>
                ⚔️ {carta.Valour}
              </div>
              <div style={{ fontSize: '9px', color: '#a0aec0' }}>
                ID: {carta.IdCard}
              </div>
            </button>
          );
        })}
      </div>
    </div>

    {/* ALERTAS DE ESPERA */}
    {cartaSeleccionada && (
      <div style={{ marginTop: '15px', padding: '10px', background: '#22543d', color: '#c6f6d5', borderRadius: '8px', fontSize: '12px', textAlign: 'center', border: '1px solid #2f855a' }}>
        ⌛ Movimiento realizado. Esperando resolución del turno de {Partida?.Player2?.Username}...
      </div>
    )}
  </div>
);
};