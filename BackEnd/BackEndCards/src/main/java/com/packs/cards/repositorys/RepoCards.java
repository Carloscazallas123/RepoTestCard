package com.packs.cards.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.CardsEntity;

@Repository
public interface RepoCards extends JpaRepository<CardsEntity, Integer> {
	
	@Query("SELECT c FROM CardsEntity c")
	List<CardsEntity> Obtenertodaslascartas();
	
	@Query("SELECT c FROM CardsEntity c WHERE c.idcarta=:idcarta")
	CardsEntity ObtenerporId(int idcarta);
}
