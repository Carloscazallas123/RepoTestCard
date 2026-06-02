package com.packs.cards.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.packs.cards.entitys.DeskEntity;

@Repository
public interface RepoDesk extends JpaRepository<DeskEntity, Integer> { 
	
	@Query("SELECT D FROM DeskEntity c WHERE c.IdDesk=:IdDesk")
	DeskEntity ObtenerporId(int IdDesk);
}
