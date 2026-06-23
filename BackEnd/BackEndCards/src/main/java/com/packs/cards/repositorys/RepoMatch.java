package com.packs.cards.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.MatchEntity;


@Repository
public interface RepoMatch extends JpaRepository<MatchEntity, Integer> {
	
	@Query("SELECT m FROM MatchEntity m WHERE m.IdMatch=:IdMatch")
	MatchEntity ObtenerporId(@Param("IdMatch") int IdMatch);
	
	@Query("SELECT p FROM MatchEntity p " +
	           "LEFT JOIN p.Player1.DeskUser.deskCards c1 " +
	           "LEFT JOIN p.Player2.DeskUser.deskCards c2 " +
	           "WHERE c1.idCard = :idCarta OR c2.idCard = :idCarta")
	MatchEntity findPartidaByCartaId(@Param("idCarta") int idCarta);
}
