-- Creacion de la Base de datos
SET NAMES 'utf8mb4';
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway ;
USE railway;

create table TableDesk (
	IdDesk int not null auto_increment,
	NameDesk varchar(25) not null,
    constraint PkDesk primary key (IdDesk)
);

create table TableCard (
	IdCard int not null auto_increment,
    Valour int null,
    DeskCard int null,
    constraint PkIdCard primary key (IdCard),
    constraint FkDeskCard foreign key (DeskCard) references TableDesk(IdDesk)
);

create table TableUser (
	IdUser int not null auto_increment,
    UserName varchar(250) null,
    DeskUser int null,
    constraint PkIdUser primary key (IdUser),
    constraint FkDeskUser foreign key (DeskUser) references TableDesk(IdDesk)
);

create table TableMatch (
	IdMatch int not null auto_increment,
    Player1 int null,
    Player2 int null,
    State varchar(25) null,
    Points1 int null comment 'puntos del jugador 1',
    Points2 int null comment 'puntos del jugador 2',
    constraint PkIdMatch primary key (IdMatch),
    constraint FkPlayer1 foreign key (Player1) references TableUser(IdUser),
    constraint FkPlayer2 foreign key (Player2) references TableUser(IdUser)
);

create table TableGame (
	IdGame int not null auto_increment,
    GameMatch int null,
    Card1 int null,
    Card2 int null,
    constraint PkIdGame primary key (IdGame),
    constraint FkGameMatch foreign key (GameMatch) references TableMatch(IdMatch),
    constraint FkCard1 foreign key (Card1) references TableCard(IdCard),
    constraint FkCard2 foreign key (Card2) references TableCard(IdCard)
);


-- Insertación de Datos
INSERT INTO TableDesk (IdDesk, NameDesk) 
VALUES (1, 'Desk Initial');
INSERT INTO TableCard (Valour, DeskCard) VALUES (FLOOR(1 + RAND() * 40), 1);
INSERT INTO TableCard (Valour, DeskCard) VALUES (FLOOR(1 + RAND() * 40), 1);
INSERT INTO TableCard (Valour, DeskCard) VALUES (FLOOR(1 + RAND() * 40), 1);
INSERT INTO TableCard (Valour, DeskCard) VALUES (FLOOR(1 + RAND() * 40), 1);
INSERT INTO TableCard (Valour, DeskCard) VALUES (FLOOR(1 + RAND() * 40), 1);

SELECT * FROM TableCard;

