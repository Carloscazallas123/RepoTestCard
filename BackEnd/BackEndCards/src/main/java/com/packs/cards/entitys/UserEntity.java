package com.packs.cards.entitys;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="TableUser")
public class UserEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="IdUser")
    private int IdUser;
    
	@Column(name="UserName")
	private String UserName;
	
	@ManyToOne
    @JoinColumn(name = "DeskUser", nullable = true) 
    private DeskEntity DeskUser;

	public int getIdUser() {
		return IdUser;
	}

	public void setIdUser(int idUser) {
		IdUser = idUser;
	}

	public String getUserName() {
		return UserName;
	}

	public void setUserName(String userName) {
		UserName = userName;
	}

	public DeskEntity getDeskUser() {
		return DeskUser;
	}

	public void setDeskUser(DeskEntity deskUser) {
		DeskUser = deskUser;
	}
	
}
