package com.packs.cards.Dto;

public class CardsDTO {
	
	private int idCard;
	private int Valour;
	
	public CardsDTO() { }
	
	public CardsDTO(int idCard, int Valour) {
		this.idCard = idCard;
		this.Valour = Valour;
	}
	
	public int getIdCard() {
		return idCard;
	}

	public void setIdCard(int idCard) {
		this.idCard = idCard;
	}

	public int getValour() {
		return Valour;
	}

	public void setValour(int Valour) {
		this.Valour = Valour;
	}

	
	
}
