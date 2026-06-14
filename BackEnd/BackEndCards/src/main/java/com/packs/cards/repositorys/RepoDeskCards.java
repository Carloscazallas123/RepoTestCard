package com.packs.cards.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.packs.cards.entitys.CardsEntity;
import com.packs.cards.entitys.DeskCardEntity;

@Repository
public interface RepoDeskCards extends JpaRepository<DeskCardEntity, Integer> {
	
	@Query("SELECT Card c FROM DeskCardEntity c")
	List<CardsEntity> Obtenertodaslascartas();
}