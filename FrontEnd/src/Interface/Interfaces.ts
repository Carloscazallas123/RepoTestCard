export interface Card {
    IdCard: number;
    Valour: number; 
}

export interface Desk {
    idDesk: number;
    NameDesk: string;
    Cards: Card[] ; 
}

export interface UserDTO {
    idUser: number;
    Username: String;
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
    idMatch?: number | null;
    card1?: Card | null;
    card2?: Card | null;
}