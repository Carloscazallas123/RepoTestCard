export interface Card {
    idCard: number;
    valour: number; // El valor/fuerza de la carta
}

export interface Desk {
    idDesk: number;
    Cards: Card[]; // IDs de las cartas que le quedan al jugador
}

export interface UserDTO {
    idUser: number;
    userName: string;
    deskUser: Desk;
}

export interface MatchDTO {
    idMatch?: number;
    Player1: UserDTO;
    Player2: UserDTO;
    State?: string;
    Points1?: number;
    Points2?: number;
    cartaMesaPlayer1?: Card | null; 
    cartaMesaPlayer2?: Card | null;
}

export interface GameDTO {
    idMatch: number;
    card1: number | null;
    card2: number | null;
}