package com.packs.cards.Dto;

public class CardsDTO {
	
	private int idCard;
	private int Valour;
	
	public CardsDTO() { }
	
	public CardsDTO(int idCard, int valour) {
		this.idCard = idCard;
		this.Valour = valour;
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

	public void setValour(int valour) {
		this.Valour = valour;
	}

	
	
}
