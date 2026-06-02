package com.packs.cards.controllers;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.packs.cards.Dto.*;
import com.packs.cards.entitys.*;
import com.packs.cards.repositorys.*;

@Controller
@CrossOrigin(origins = "*")
public class PrincipalController {

	@Autowired
	RepoDesk DeskRepo;
	RepoUser UserRepo;
	RepoMatch MatchRepo;
	RepoCards CardsRepo;

	private static final ConcurrentLinkedQueue<String> MatchMaking = new ConcurrentLinkedQueue<>();

	@MessageMapping("/CrearPartida")
	@SendTo("/topic/partida")
	public MatchDTO realizarjugada(String NameUser) {
		MatchMaking.add(NameUser);

		if (MatchMaking.size() < 2) {
			System.out.println("Esperando en la nube...");
			return null;
		}

		String UserName1 = MatchMaking.poll();
		UserDTO Player1 = CreateUser(UserName1, DeskRepo, UserRepo);
		String UserName2 = MatchMaking.poll();
		UserDTO Player2 = CreateUser(UserName2, DeskRepo, UserRepo);
		MatchDTO Match = CreateMatch(Player1, Player2, UserRepo, MatchRepo);

		return Match;
	}

	@MessageMapping("/JugadaRealizada")
	@SendTo("/topic/Jugada")
	public MatchDTO GameMatch(GameDTO game) {
		CardsEntity Card1 = CardsRepo.ObtenerporId(game.getCard1());
		CardsEntity Card2 = CardsRepo.ObtenerporId(game.getCard2());
		MatchEntity EntityMatch = MatchRepo.ObtenerporId(game.getIdMatch());
		MatchDTO ObjectMatch = new MatchDTO();

		// Gana el Jugador 1
		if (Card1.getValour() < Card2.getValour()) {
			EntityMatch.setPoints2(EntityMatch.getPoints2() + 100);
			ObjectMatch.setPoints2(EntityMatch.getPoints2());

			EntityMatch.setState("Turn Winner: " + EntityMatch.getPlayer2().getUserName());
			ObjectMatch.setState(EntityMatch.getState());

			ObjectMatch.getPlayer2().getDeskUser().getCards().remove(Card2.getIdCard());
		}
		// Gana el Jugador 2
		if (Card1.getValour() > Card2.getValour()) {
			EntityMatch.setPoints1(EntityMatch.getPoints1() + 100);
			ObjectMatch.setPoints1(EntityMatch.getPoints1());

			EntityMatch.setState("Turn Winner: " + EntityMatch.getPlayer1().getUserName());
			ObjectMatch.setState(EntityMatch.getState());

			ObjectMatch.getPlayer1().getDeskUser().getCards().remove(Card1.getIdCard());
		}
		// Empate
		if (Card1.getValour() == Card2.getValour()) {
			EntityMatch.setState("Nothing");
		}

		if (ObjectMatch.getPlayer1().getDeskUser().getCards().size() == 0
				|| ObjectMatch.getPlayer2().getDeskUser().getCards().size() == 0) {
			ObjectMatch.setState("Partida Acabada");
		}

		return ObjectMatch;

	}

	// Función Externa Nº1: Creacion del Usuario
	public static UserDTO CreateUser(String Username, RepoDesk DeskRepo, RepoUser UserRepo) {

		UserEntity EntityUser = new UserEntity();
		EntityUser.setUserName(Username);
		EntityUser.setDeskUser(DeskRepo.ObtenerporId(1));
		UserRepo.save(EntityUser);
		UserDTO ObjectUser = new UserDTO();
		ObjectUser.setUsername(Username);
		ObjectUser.setIduser(EntityUser.getIdUser());

		List<Integer> Cards = new ArrayList<>();
		List<CardsEntity> EntityCards = EntityUser.getDeskUser().getListCards();
		for (int i = 0; i < EntityCards.size(); i++) {
			Cards.add(EntityCards.get(i).getIdCard());
		}

		ObjectUser.setDeskUser(new DeskDTO(Cards));

		return ObjectUser;
	}

	// Función Externa Nº2: Creacion de la Partida
	public static MatchDTO CreateMatch(UserDTO Player1, UserDTO Player2, RepoUser UserRepo, RepoMatch MatchRepo) {

		MatchEntity EntityMatch = new MatchEntity();
		EntityMatch.setPlayer1(UserRepo.ObtenerporId(Player1.getIduser()));
		EntityMatch.setPlayer1(UserRepo.ObtenerporId(Player1.getIduser()));
		EntityMatch.setPoints1(0);
		EntityMatch.setPoints2(0);
		EntityMatch.setState("Empezando la partida");
		MatchRepo.save(EntityMatch);

		MatchDTO ObjectMatch = new MatchDTO();
		ObjectMatch.setIdMatch(EntityMatch.getIdMatch());
		ObjectMatch.setPlayer1(Player1);
		ObjectMatch.setPlayer2(Player2);
		ObjectMatch.setPoints1(EntityMatch.getPoints1());
		ObjectMatch.setPoints2(EntityMatch.getPoints2());
		ObjectMatch.setState(EntityMatch.getState());

		return null;

	}
}
