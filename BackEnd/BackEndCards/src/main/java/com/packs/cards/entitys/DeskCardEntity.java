package com.packs.cards.entitys;

import jakarta.persistence.*;

@Entity
@Table(name = "tabledesk_card")
public class DeskCardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`IdDesk_Card`")
    private int idDeskCard;
    
    @ManyToOne (cascade = CascadeType.ALL)
    @JoinColumn(name = "`IdDesk`")
    private DeskEntity Desk;

    @ManyToOne (cascade = CascadeType.ALL)
    @JoinColumn(name = "`IdCard`") 
    private CardsEntity Card;
    
    

	public DeskCardEntity(DeskEntity desk, CardsEntity card) {
		Desk = desk;
		Card = card;
	}

	public DeskEntity getDesk() {
		return Desk;
	}

	public void setDesk(DeskEntity desk) {
		Desk = desk;
	}

	public CardsEntity getCard() {
		return Card;
	}

	public void setCard(CardsEntity card) {
		Card = card;
	}


    
}
