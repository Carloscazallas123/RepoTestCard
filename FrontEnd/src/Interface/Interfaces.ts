export interface Card {
    idCard: number;
    valour: number; // El valor/fuerza de la carta
}

export interface Desk {
    idDesk: number;
    cards: Card[]; // IDs de las cartas que le quedan al jugador
}

export interface UserDTO {
    idUser: number;
    userName: string;
    deskUser: Desk;
}

export interface MatchDTO {
    idMatch: number;
    player1: UserDTO;
    player2: UserDTO;
    state: string;
    points1: number;
    points2: number;
    cartaMesaPlayer1: Card | null; 
    cartaMesaPlayer2: Card | null;
}

export interface GameDTO {
    idMatch: number;
    card1: number | null;
    card2: number | null;
}