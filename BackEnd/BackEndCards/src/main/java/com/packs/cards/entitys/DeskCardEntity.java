package com.packs.cards.entitys;

import jakarta.persistence.*;

@Entity
@Table(name = "tabledesk_card")
public class DeskCardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`IdDesk_Card`")
    private int idDeskCard;

    @ManyToOne
    @JoinColumn(name = "`IdDesk`")
    private DeskEntity Desk;

    @ManyToOne
    @JoinColumn(name = "`IdCard`") 
    private CardsEntity Card;


}
