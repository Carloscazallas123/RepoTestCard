package com.packs.cards.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.GameEntity;


@Repository
public interface RepoGame extends JpaRepository<GameEntity, Integer> {
	
	@Query("SELECT g FROM GameEntity g WHERE g.GameMatch.IdMatch=:IdMatch")
	List<GameEntity> Obtenerporpartida(@Param("IdMatch") int IdMatch);
}
