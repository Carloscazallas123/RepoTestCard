export interface Card {
    idCard: number;
    valour: number; 
}

export interface Desk {
    idDesk: number;
    NameDesk: string;
    Cards: Card[]; 
}

export interface UserDTO {
    idUser: number;
    Username: string;
    DeskUser: Desk;
}

export interface MatchDTO {
    IdMatch: number;
    Player1: UserDTO;
    Player2: UserDTO;
    State: string;
    Points1: number;
    Points2: number;
}

export interface GameDTO {
    idMatch: number;
    card1: number | null;
    card2: number | null;
}