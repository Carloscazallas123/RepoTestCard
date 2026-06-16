package com.packs.cards.entitys;

import java.io.Serializable;

import jakarta.persistence.*;

@Entity
@Table(name = "tablegame")
public class GameEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`IdGame`")
    private int IdGame;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`GameMatch`", referencedColumnName = "IdMatch")
    private MatchEntity GameMatch;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`Card1`", referencedColumnName = "IdCard")
    private CardsEntity Card1; 


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`Card2`", referencedColumnName = "IdCard")
    private CardsEntity Card2;


	public int getIdGame() {
		return IdGame;
	}


	public void setIdGame(int idGame) {
		IdGame = idGame;
	}


	public MatchEntity getGameMatch() {
		return GameMatch;
	}


	public void setGameMatch(MatchEntity gameMatch) {
		GameMatch = gameMatch;
	}


	public CardsEntity getCard1() {
		return Card1;
	}


	public void setCard1(CardsEntity card1) {
		Card1 = card1;
	}


	public CardsEntity getCard2() {
		return Card2;
	}


	public void setCard2(CardsEntity card2) {
		Card2 = card2;
	} 

  


}
