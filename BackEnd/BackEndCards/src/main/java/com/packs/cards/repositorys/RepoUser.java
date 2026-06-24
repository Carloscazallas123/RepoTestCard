package com.packs.cards.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.packs.cards.entitys.UserEntity;

import jakarta.transaction.Transactional;


@Repository
public interface RepoUser extends JpaRepository<UserEntity, Integer> {
	
	@Query("SELECT u FROM UserEntity u WHERE u.IdUser=:idUser")
	UserEntity ObtenerporId(@Param("idUser") int idUser);
	
	@Query("SELECT u FROM UserEntity u WHERE u.UserName=:UserName")
	UserEntity ObtenerporNombre(@Param("UserName") String UserName);
	@Query("SELECT u FROM UserEntity u")
	List<UserEntity> Obtenertodos();
	
}
