export interface Card {
    idCard: number;
    valour: number; // El valor/fuerza de la carta
}

export interface Desk {
    idDesk: number;
    cards: number[]; // IDs de las cartas que le quedan al jugador
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
}

export interface GameDTO {
    idMatch: number;
    card1: number; // ID de la carta que tira el J1
    card2: number; // ID de la carta que tira el J2
}