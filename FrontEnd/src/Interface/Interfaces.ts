export interface Card {
    idCard: number;
    Valour: number; 
}

export interface Desk {
    idDesk: number;
    NameDesk: string;
    Cards: Card[] | undefined ; 
}

export interface UserDTO {
    idUser: number;
    Username: String;
    DeskUser: Desk | undefined;
}

export interface MatchDTO {
    IdMatch: number | undefined;
    Player1: UserDTO;
    Player2: UserDTO;
    State: string;
    Points1: number;
    Points2: number;
}

export interface GameDTO {
    IdMatch?: number | null;
    Card1?: Card | null;
    Card2?: Card | null;
}