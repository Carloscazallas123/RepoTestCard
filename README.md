# ⚜️ Cartas Alocadas — Documentación del Proyecto

¡Bienvenido a las Crónicas de **Cartas Alocadas**! Este proyecto es un juego de cartas coleccionables y de estrategia clásico/fantasía en tiempo real, diseñado con una estética heráldica inspirada en tabernas medievales y juegos de mesa tradicionales como *Hearthstone* y *Magic: The Gathering*.

---

## 📖 1. ¿De qué va el Proyecto? (El Lore)

> *"En los confines de la Vieja Taberna, los magos y pícaros más audaces se baten en duelo. No hay hechizos que valgan aquí; solo tu astucia, tu mazo de criaturas inestables y la impredecible magia del caos. Las cartas han sido barajadas, el tapete está listo..."*

**Cartas Alocadas** es un simulador de duelos de cartas multijugador asíncrono y en tiempo real. 
* **El Objetivo:** Los jugadores se registran con su apodo de aventurero y entran a una Arena de combate. 
* **La Mecánica:** Cada jugador recibe una mano operativa de habilidades y criaturas con un valor único de **Poder (PWR / Valour)**. En cada turno, seleccionan una carta estratégicamente para colocarla en su slot del campo de batalla. El duelista con la carta de mayor poder en el tablero gana el enfrentamiento, acumulando puntos de gloria (**PTS**).

---

## 🛠️ 2. Arquitectura y Herramientas Utilizadas

El proyecto está construido bajo una arquitectura desacoplada moderna (Cliente-Servidor) orientada a eventos en tiempo real para soportar el emparejamiento (*matchmaking*) y las jugadas inmediatas.

### 💻 Frontend (El Cliente)
* **React.js:** SPA (*Single Page Application*) que gestiona de manera reactiva el estado de la partida, las manos de los jugadores, los puntos y el flujo del lobby.
* **HTML5 & CSS3 (Diseño Líquido y Clásico):** Maquetación adaptiva (*Responsive*) personalizada sin frameworks invasivos como Bootstrap o Tailwind. Utiliza variables CSS (`:root`), efectos heráldicos clásicos con degradados radiales, bordes dorados envejecidos (`#c5a059`) y fondos estilo pergamino/marfil (`#fbf8eb`).
* **WebSockets Client (STOMP / SockJS):** Permite la comunicación bidireccional inmediata con el servidor para escuchar los canales de emparejamiento y sincronizar las jugadas del rival de manera asíncrona.

### ☕ Backend (El Servidor)
* **Java & Spring Boot:** Núcleo robusto que gestiona la API REST y los controladores WebSocket.
* **Spring WebSocket & STOMP:** Broker de mensajería encargado de registrar los hilos de conexión, emparejar a los jugadores en colas e intercambiar los estados DTO de la partida (`MatchDTO`) instantáneamente.
* **Spring Data JPA & Hibernate:** Capa de persistencia encargada del mapeo objeto-relacional (ORM) para interactuar de forma segura con los registros.
* **MySQL / MariaDB:** Base de datos relacional donde se registran las entidades principales como `tablematch` (Partidas), `tableuser` (Usuarios de la sesión) y `tabledesk` (Los mazos/escritorios de cartas asignados).

---

## ⚙️ 3. Lógica Clave del Ciclo de Vida del Juego

### A. Perspectiva Simétrica del Cliente
Uno de los retos de desarrollo resueltos más interesantes es la **perspectiva del cliente**. 
* Cada dispositivo móvil o web renderiza de forma local al usuario logueado en la posición del **Jugador 1** ("TÚ") en la zona inferior, y al oponente en la zona superior como **Jugador 2** ("RIVAL").
* Al enviar una acción a través del WebSocket, el servidor unifica las perspectivas traduciendo los datos locales a la estructura real de la base de datos de manera agnóstica al dispositivo que disparó el evento.

### B. El Algoritmo de Limpieza y Borrado Seguro
Al finalizar una partida (`FinishMatch`), el servidor ejecuta un hilo de borrado integral en cascada controlado por logs internos (`[BORRADO-LOG]`):
1. Detecta los IDs asociados a la partida (`MatchRepo.ObtenerporId`).
2. Elimina los registros temporales del mazo/escritorio en la tabla intermedia.
3. Desvincula o remueve el registro principal de la partida de `tablematch`.
4. Borra los usuarios creados temporalmente para la sesión mediante salvaguardas de punteros nulos (`NullPointerException`), asegurando que si un jugador abandonó antes de tiempo o el slot quedó vacío (`idUser == 0`), el servidor continúe limpiando el resto del ecosistema sin colapsar.

---

## 📱 4. Vista Previa de la Interfaz

El proyecto cuenta con dos pantallas principales totalmente adaptadas a teléfonos móviles:
1. **El Registro de Aventurero (Lobby):** Un pergamino central elegante que contiene el *Lore*, las instrucciones paso a paso de las *Crónicas de Batalla* y los controles interactivos para encender/apagar el Socket y entrar a la cola.
2. **La Arena de Batalla:** Un tapete verde casino con el marcador clásico superior, la zona superior de cartas ocultas del rival, los slots centrales de combate con animaciones de espera y la baraja interactiva del jugador en la parte inferior.

---
*Desarrollado con pasión simulando el espíritu de los juegos de rol y cartas tradicionales.* ⚔️🛡️
