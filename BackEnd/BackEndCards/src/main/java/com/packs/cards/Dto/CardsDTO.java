package com.packs.cards.Dto;

public class CardsDTO {
	
	private int IdCard;
	private int Valour;
	
	public CardsDTO() { }
	
	public CardsDTO(int idCard, int valour) {
		this.IdCard = idCard;
		this.Valour = valour;
	}
	
	public int getIdCard() {
		return IdCard;
	}

	public void setIdCard(int idCard) {
		IdCard = idCard;
	}

	public int getValour() {
		return Valour;
	}

	public void setValour(int valour) {
		Valour = valour;
	}

	
	
}
