-- Creacion de la Base de datos
SET NAMES 'utf8mb4';
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway ;
USE railway;

create table baraja (
	id_baraja int not null auto_increment comment 'identificador de la carta',
	nombre varchar(25) not null comment 'nombre de la baraja',
    constraint pkbaraja primary key (id_baraja)
);

create table carta (
	id_carta int not null auto_increment comment 'identificador de la carta',
    valor int null comment 'nombre del usuario',
    id_barajac int null comment 'identificador de la carta',
    constraint pkcarta primary key (id_carta),
    constraint fkbarajac foreign key (id_barajac) references baraja(id_baraja)
);

create table usuario (
	id_usuario int not null auto_increment comment 'identificador de la carta',
    nombre varchar(250) null comment 'nombre del usuario',
    puntos int null comment 'puntos del usuario',
    id_baraja int null comment 'baraja del usuario',
    constraint pkusuario primary key (id_usuario),
    constraint fkbaraja foreign key (id_baraja) references baraja(id_baraja)
);

create table partida (
	id_partida int not null auto_increment comment 'identificador de la partida',
    usuario1 int null comment 'primer jugador',
    usuario2 int null comment 'segundo jugador',
    constraint pkpartida primary key (id_partida),
    constraint fkusuario1 foreign key (usuario1) references usuario(id_usuario),
    constraint fkusuario2 foreign key (usuario2) references usuario(id_usuario)
);

create table estadopartida (
	id_jugada int not null auto_increment comment 'identificador de la partida',
    id_partida int null comment 'identificador de la partida',
    estado varchar(25) null comment 'estado de la jugada',
    carta1 int null comment 'carta del jugador 2',
    carta2 int null comment 'carta del jugador 2',
    puntos1 int null comment 'puntos del jugador 1',
    puntos2 int null comment 'puntos del jugador 2',
    constraint pkjugada primary key (id_jugada),
    constraint fpartida foreign key (id_partida) references partida(id_partida),
    constraint fcarta1 foreign key (carta1) references carta(id_carta),
    constraint fcarta2 foreign key (carta2) references carta(id_carta)
);


-- Insertación de Datos
INSERT INTO baraja (id_baraja, nombre) 
VALUES (1, 'Mazo Inicial Básico');
INSERT INTO carta (valor, id_barajac) VALUES (1, 1);
INSERT INTO carta (valor, id_barajac) VALUES (2, 1);
INSERT INTO carta (valor, id_barajac) VALUES (3, 1);
INSERT INTO carta (valor, id_barajac) VALUES (4, 1);
INSERT INTO carta (valor, id_barajac) VALUES (5, 1);

