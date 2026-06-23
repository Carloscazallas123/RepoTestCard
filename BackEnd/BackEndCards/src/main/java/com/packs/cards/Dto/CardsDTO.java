package com.packs.cards.Dto;

public class CardsDTO {

	//Variable Opcional
	private int idMatch;
	
	private int IdCard;
	private int Valour;
	
	public CardsDTO() { }
	
	public CardsDTO(int idCard, int valour) {
		this.IdCard = idCard;
		this.Valour = valour;
	}
	
	
	
	public CardsDTO(int idMatch, int idCard, int valour) {
		this.idMatch = idMatch;
		IdCard = idCard;
		Valour = valour;
	}

	public int getIdMatch() {
		return idMatch;
	}

	public void setIdMatch(int idMatch) {
		this.idMatch = idMatch;
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
