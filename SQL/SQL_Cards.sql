-- Creacion de la Base de datos
SET NAMES 'utf8mb4';
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway ;
USE railway;

create table tablecard (
	IdCard int not null auto_increment,
    Valour int null,
    constraint PkIdCard primary key (IdCard)
);

create table tabledesk (
	IdDesk int not null auto_increment,
	NameDesk varchar(25) not null,
    constraint PkDesk primary key (IdDesk)
);

create table tabledesk_card (
	IdDesk_Card int not null auto_increment,
	IdDesk int null,
    IdCard int null,
    constraint PkDesk_Card primary key (IdDesk_Card),
    constraint FkDesk foreign key (IdDesk) references tabledesk(IdDesk),
    constraint FkDCard foreign key (IdCard) references tablecard(IdCard)
);


create table tableuser (
	IdUser int not null auto_increment,
    UserName varchar(250) null,
    DeskUser int null,
    constraint PkIdUser primary key (IdUser),
    constraint FkDeskUser foreign key (DeskUser) references tabledesk(IdDesk)
);

create table tablematch (
	IdMatch int not null auto_increment,
    Player1 int null,
    Player2 int null,
    State varchar(55) null,
    Points1 int null comment 'puntos del jugador 1',
    Points2 int null comment 'puntos del jugador 2',
    constraint PkIdMatch primary key (IdMatch),
    constraint FkPlayer1 foreign key (Player1) references tableuser(IdUser),
    constraint FkPlayer2 foreign key (Player2) references tableuser(IdUser)
);

create table tablegame (
	IdGame int not null auto_increment,
    GameMatch int null,
    Card1 int null,
    Card2 int null,
    constraint PkIdGame primary key (IdGame),
    constraint FkGameMatch foreign key (GameMatch) references tablematch(IdMatch),
    constraint FkCard1 foreign key (Card1) references tablecard(IdCard),
    constraint FkCard2 foreign key (Card2) references tablecard(IdCard)
);

-- 1. Creamos la baraja (Mazo)
INSERT INTO tabledesk (NameDesk) 
VALUES ('Baraja Principal');

-- 2. Creamos las 5 cartas con valores de fuerza aleatorios (ej. entre 1 y 100)
-- Usamos FLOOR(RAND() * 100) + 1 para generar el número aleatorio en MySQL
INSERT INTO tablecard (Valour) VALUES (FLOOR(RAND() * 100) + 1);
INSERT INTO tablecard (Valour) VALUES (FLOOR(RAND() * 100) + 1);
INSERT INTO tablecard (Valour) VALUES (FLOOR(RAND() * 100) + 1);
INSERT INTO tablecard (Valour) VALUES (FLOOR(RAND() * 100) + 1);
INSERT INTO tablecard (Valour) VALUES (FLOOR(RAND() * 100) + 1);

-- 3. Metemos las 5 cartas dentro de la baraja que acabamos de crear
-- Como es la primera baraja, su IdDesk será 1. 
-- Como son las primeras cartas, sus IdCard serán 1, 2, 3, 4 y 5.
INSERT INTO tabledesk_card (IdDesk, IdCard) VALUES (1, 1);
INSERT INTO tabledesk_card (IdDesk, IdCard) VALUES (1, 2);
INSERT INTO tabledesk_card (IdDesk, IdCard) VALUES (1, 3);
INSERT INTO tabledesk_card (IdDesk, IdCard) VALUES (1, 4);
INSERT INTO tabledesk_card (IdDesk, IdCard) VALUES (1, 5);

SELECT * FROM tableuser;
