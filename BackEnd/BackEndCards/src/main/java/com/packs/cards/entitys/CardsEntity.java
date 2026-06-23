package com.packs.cards.entitys;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor 
@Table(name="tablecard")
public class CardsEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "`IdCard`") 
    private int IdCard;
    
	@Column(name="`Valour`")
    private int Valour;
	
	@OneToMany(mappedBy = "Card")
    private List<DeskCardEntity> DeskCards;



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
	public List<DeskCardEntity> getDeskCards() {
		return DeskCards;
	}
	public void setDeskCards(List<DeskCardEntity> deskCards) {
		DeskCards = deskCards;
	}
	
}
