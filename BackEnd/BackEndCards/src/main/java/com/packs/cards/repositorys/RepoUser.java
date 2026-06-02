package com.packs.cards.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.packs.cards.entitys.UserEntity;


@Repository
public interface RepoUser extends JpaRepository<UserEntity, Integer> {
	
	@Query("SELECT u FROM UserEntity u WHERE u.idUser=:idUser")
	UserEntity ObtenerporId(@Param("idUser") int idUser);
}
