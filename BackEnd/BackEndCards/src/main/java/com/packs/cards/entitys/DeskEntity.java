package com.packs.cards.entitys;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="TableDesk")
public class DeskEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="IdDesk")
    private int IdDesk;
    
	@Column(name="NameDesk")
	private String NameDesk;
	
	@OneToMany(mappedBy = "DeskCard", cascade = CascadeType.ALL)
    private List<CardsEntity> ListCards;

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

	public List<CardsEntity> getListCards() {
		return ListCards;
	}

	public void setListCards(List<CardsEntity> listCards) {
		ListCards = listCards;
	}
}
