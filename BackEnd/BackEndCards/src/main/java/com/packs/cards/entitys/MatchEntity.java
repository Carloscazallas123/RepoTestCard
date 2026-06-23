package com.packs.cards.entitys;

import java.io.Serializable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor 
@Table(name="tablematch")
public class MatchEntity implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="`IdMatch`")
    private int IdMatch;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`Player1`", referencedColumnName = "`IdUser`")
    private UserEntity Player1; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`Player2`", referencedColumnName = "`IdUser`")
    private UserEntity Player2;
    
    @Column(name = "`State`")
    private String State;

    @Column(name = "`Points1`")
    private Integer Points1;

    @Column(name = "`Points2`")
    private Integer Points2;

	public int getIdMatch() {
		return IdMatch;
	}

	public void setIdMatch(int idMatch) {
		IdMatch = idMatch;
	}

	public UserEntity getPlayer1() {
		return Player1;
	}

	public void setPlayer1(UserEntity player1) {
		Player1 = player1;
	}

	public UserEntity getPlayer2() {
		return Player2;
	}

	public void setPlayer2(UserEntity player2) {
		Player2 = player2;
	}

	public String getState() {
		return State;
	}

	public void setState(String state) {
		State = state;
	}

	

	public Integer getPoints1() {
		return Points1;
	}

	public void setPoints1(Integer points1) {
		Points1 = points1;
	}

	public Integer getPoints2() {
		return Points2;
	}

	public void setPoints2(Integer points2) {
		Points2 = points2;
	}
	
	

	
}
