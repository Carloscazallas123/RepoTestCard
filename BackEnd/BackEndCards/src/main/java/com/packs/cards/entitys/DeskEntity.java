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
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor 
@Table(name="tabledesk")
public class DeskEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="`IdDesk`")
    private int IdDesk;
    
	@Column(name="`NameDesk`")
	private String NameDesk;
	
	@OneToMany(mappedBy = "Desk", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeskCardEntity> deskCards;

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

	public List<DeskCardEntity> getDeskCards() {
		return deskCards;
	}

	public void setDeskCards(List<DeskCardEntity> deskCards) {
		this.deskCards = deskCards;
	}

	
}
