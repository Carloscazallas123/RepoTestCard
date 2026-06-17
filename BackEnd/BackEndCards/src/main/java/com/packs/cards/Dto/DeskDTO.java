package com.packs.cards.Dto;

import java.util.List;

public class DeskDTO {

	private int IdDesk;
	private String NameDesk;
	private List<CardsDTO>Cards;
	
	public DeskDTO() { }


	public int getIdDesk() {
		return IdDesk;
	}

	public void setIdDesk(int idDesk) {
		IdDesk = idDesk;
	}

	public String getNameDesk() {
		return NameDesk;
	}

	public void setNameDesk(String nameDesk) {
		NameDesk = nameDesk;
	}


	public List<CardsDTO> getCards() {
		return Cards;
	}


	public void setCards(List<CardsDTO> cards) {
		Cards = cards;
	}

	
	
	
	
	
}
