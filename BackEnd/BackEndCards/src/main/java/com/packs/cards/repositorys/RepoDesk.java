package com.packs.cards.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.packs.cards.entitys.DeskEntity;

@Repository
public interface RepoDesk extends JpaRepository<DeskEntity, Integer> { 
	
	@Query("SELECT d FROM DeskEntity d WHERE d.IdDesk=:IdDesk")
	DeskEntity ObtenerporId(@Param("IdDesk") int IdDesk);
}
