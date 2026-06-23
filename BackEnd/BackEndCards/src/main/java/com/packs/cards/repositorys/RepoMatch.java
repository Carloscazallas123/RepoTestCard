package com.packs.cards.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.MatchEntity;


@Repository
public interface RepoMatch extends JpaRepository<MatchEntity, Integer> {
	
	@Query("SELECT m FROM MatchEntity m WHERE m.IdMatch=:IdMatch")
	MatchEntity ObtenerporId(@Param("IdMatch") int IdMatch);
	
	@Query("SELECT m FROM MatchEntity m")
	List<MatchEntity>ObtenerTodos();
	
	
}
