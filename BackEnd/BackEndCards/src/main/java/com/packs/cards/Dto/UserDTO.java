package com.packs.cards.Dto;

public class UserDTO {

	private int Iduser;
	private String Username;
	private DeskDTO DeskUser;
	
	public UserDTO() { }

	public int getIduser() {
		return Iduser;
	}

	public void setIduser(int iduser) {
		Iduser = iduser;
	}

	public String getUsername() {
		return Username;
	}

	public void setUsername(String username) {
		Username = username;
	}

	public DeskDTO getDeskUser() {
		return DeskUser;
	}

	public void setDeskUser(DeskDTO deskUser) {
		DeskUser = deskUser;
	}
	
	
}
