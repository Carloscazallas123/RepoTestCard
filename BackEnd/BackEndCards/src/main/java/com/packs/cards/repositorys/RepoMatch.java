package com.packs.cards.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.MatchEntity;


@Repository
public interface RepoMatch extends JpaRepository<MatchEntity, Integer> {
	
	@Query("SELECT m FROM MatchEntity m WHERE m.IdMatch=:IdMatch")
	MatchEntity ObtenerporId(int IdMatch);
}
