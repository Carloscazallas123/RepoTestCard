package com.packs.cards.Dto;

import java.util.List;

public class DeskDTO {

	private int IdDesk;
	private String NameDesk;
	private List<Integer>Cards;
	
	public DeskDTO() { }
	
	public DeskDTO(List<Integer>Cards) { 
	this.Cards = Cards;
	}

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

	public List<Integer> getCards() {
		return Cards;
	}

	public void setCards(List<Integer> cards) {
		Cards = cards;
	}
	
	
	
	
}
