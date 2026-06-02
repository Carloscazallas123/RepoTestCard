package com.packs.cards.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.GameEntity;


@Repository
public interface RepoGame extends JpaRepository<GameEntity, Integer> {
	
	@Query("SELECT g FROM GameEntity g WHERE e.partida.idpartida=:idpartida")
	GameEntity Obtenerporpartida(int idpartida);
}
