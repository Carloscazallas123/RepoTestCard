package com.packs.cards.Dto;

public class MatchDTO {

	private int IdMatch;
	private UserDTO Player1;
	private UserDTO Player2;
	private String State;
	private int Points1;
	private int Points2;
	
	public MatchDTO() { }

	public int getIdMatch() {
		return IdMatch;
	}

	public void setIdMatch(int idMatch) {
		IdMatch = idMatch;
	}

	public UserDTO getPlayer1() {
		return Player1;
	}

	public void setPlayer1(UserDTO player1) {
		Player1 = player1;
	}

	public UserDTO getPlayer2() {
		return Player2;
	}

	public void setPlayer2(UserDTO player2) {
		Player2 = player2;
	}

	public String getState() {
		return State;
	}

	public void setState(String state) {
		State = state;
	}

	public int getPoints1() {
		return Points1;
	}

	public void setPoints1(int points1) {
		Points1 = points1;
	}

	public int getPoints2() {
		return Points2;
	}

	public void setPoints2(int points2) {
		Points2 = points2;
	}
	
	
}
