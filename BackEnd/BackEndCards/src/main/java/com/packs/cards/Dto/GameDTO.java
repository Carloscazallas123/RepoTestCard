package com.packs.cards.Dto;

public class GameDTO {

	private int IdMatch;
	private CardsDTO Card1;
	private CardsDTO Card2; 
	
	
	
	public GameDTO(int idMatch, CardsDTO card1, CardsDTO card2) {
		IdMatch = idMatch;
		Card1 = card1;
		Card2 = card2;
	}


	public GameDTO() { }


	public int getIdMatch() {
		return IdMatch;
	}


	public void setIdMatch(int idMatch) {
		IdMatch = idMatch;
	}


	public CardsDTO getCard1() {
		return Card1;
	}


	public void setCard1(CardsDTO card1) {
		Card1 = card1;
	}


	public CardsDTO getCard2() {
		return Card2;
	}


	public void setCard2(CardsDTO card2) {
		Card2 = card2;
	}

	
	
	
}

