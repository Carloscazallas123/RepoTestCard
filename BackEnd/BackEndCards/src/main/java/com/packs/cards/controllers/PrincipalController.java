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
@CrossOrigin(origins = "http://backend-cards-production.up.railway.app")
public class PrincipalController {

	@Autowired
	RepoDesk DeskRepo;
	@Autowired
	RepoUser UserRepo;
	@Autowired
	RepoMatch MatchRepo;
	@Autowired
	RepoCards CardsRepo;
	@Autowired
	RepoDeskCards RepoDC;

	//Lista para esperar la partida
	private static final ConcurrentLinkedQueue<String> MatchMaking = new ConcurrentLinkedQueue<>();

	@MessageMapping("/CrearPartida")
	@SendTo("/topic/partida")
	public MatchDTO realizarjugada(String NameUser) {
		MatchDTO Match = new MatchDTO();
		UserDTO Player1 = new UserDTO();
		boolean existente = usuarioexistente(NameUser,UserRepo);

		// Comprobar si el usuario no existe
		if (existente == false) {
			MatchMaking.add(NameUser);
			// Comprobar si hay mas de dos personas esperando
			if (MatchMaking.size() < 2) {
				Player1.setUsername(NameUser);
				Match.setPlayer1(Player1);
				Match.setPlayer2(null);
				Match.setIdMatch(0);
				Match.setPoints1(0);
				Match.setPoints2(0);
				Match.setState("Esperando Jugador...");
				return Match;
			}
			String UserName1 = MatchMaking.poll();
			Player1 = CreateUser(UserName1, DeskRepo, UserRepo, RepoDC, CardsRepo);
			String UserName2 = MatchMaking.poll();
			UserDTO Player2 = CreateUser(UserName2, DeskRepo, UserRepo, RepoDC, CardsRepo);
			Match = CreateMatch(Player1, Player2, UserRepo, MatchRepo);
			MatchMaking.clear();
			System.out.println("🧹 La cola de Matchmaking ha sido limpiada con éxito.");
			return Match;
		}
		System.out.println("Usuario Existente");
		Player1.setUsername(NameUser);
		Match.setPlayer1(Player1);
		Match.setPlayer2(null);
		Match.setIdMatch(0);
		Match.setPoints1(0);
		Match.setPoints2(0);
		Match.setState("Esperando Jugador...");
		return Match;
	}

	@MessageMapping("/JugadaRealizada")
	@SendTo("/topic/Jugada")
	public MatchDTO GameMatch(GameDTO game) {
		CardsEntity Card1 = CardsRepo.ObtenerporId(game.getCard1());
		CardsEntity Card2 = CardsRepo.ObtenerporId(game.getCard2());
		MatchEntity EntityMatch = MatchRepo.ObtenerporId(game.getIdMatch());
		MatchDTO ObjectMatch = new MatchDTO();
		ObjectMatch.setIdMatch(EntityMatch.getIdMatch());

		// No han tirado carta
		if (game.getCard1() == null || game.getCard2() == null) {
			System.out.println("Esperar a que el jugador lanze carta");
			ObjectMatch.setState(" Preparen sus Cartas!!!");
			UserDTO Player1 = CreateUser(EntityMatch.getPlayer1().getUserName(), DeskRepo, UserRepo, RepoDC, CardsRepo);
			UserDTO Player2 = CreateUser(EntityMatch.getPlayer1().getUserName(), DeskRepo, UserRepo, RepoDC, CardsRepo);
			ObjectMatch.setPlayer1(Player1);
			ObjectMatch.setPlayer2(Player2);
			ObjectMatch.setPoints1(EntityMatch.getPoints1());
			ObjectMatch.setPoints2(EntityMatch.getPoints2());
			return ObjectMatch;
		}

		// Gana el Jugador 2
		if (Card1.getValour() < Card2.getValour()) {
			EntityMatch.setPoints2(EntityMatch.getPoints2() + 100);
			ObjectMatch.setPoints2(EntityMatch.getPoints2());

			EntityMatch.setState("Turn Winner: " + EntityMatch.getPlayer2().getUserName());
			ObjectMatch.getPlayer2().getDeskUser().getCards().remove(Card2.getIdCard());
			ObjectMatch.setState(EntityMatch.getState());
			System.out.println("Ganó " + EntityMatch.getPlayer2().getUserName());
			MatchRepo.save(EntityMatch);
		}

		// Gana el Jugador 1
		if (Card1.getValour() > Card2.getValour()) {
			EntityMatch.setPoints1(EntityMatch.getPoints1() + 100);
			ObjectMatch.setPoints1(EntityMatch.getPoints1());

			EntityMatch.setState("Turn Winner: " + EntityMatch.getPlayer1().getUserName());
			ObjectMatch.getPlayer1().getDeskUser().getCards().remove(Card1.getIdCard());
			ObjectMatch.setState(EntityMatch.getState());
			System.out.println("Ganó " + EntityMatch.getPlayer1().getUserName());
			MatchRepo.save(EntityMatch);
		}

		// Empate Entre el jugador 1 y 2
		if (Card1.getValour() == Card2.getValour()) {
			EntityMatch.setPoints2(EntityMatch.getPoints1() + 50);
			EntityMatch.setPoints2(EntityMatch.getPoints2() + 50);
			EntityMatch.setState("Empate");
			System.out.println("Empate: Mismo Valor");
			MatchRepo.save(EntityMatch);
		}
		
		UserDTO Player1 = CreateUser(EntityMatch.getPlayer1().getUserName(), DeskRepo, UserRepo, RepoDC, CardsRepo);
		UserDTO Player2 = CreateUser(EntityMatch.getPlayer2().getUserName(), DeskRepo, UserRepo, RepoDC, CardsRepo);
		ObjectMatch.setPlayer1(Player1);
		ObjectMatch.setPlayer2(Player2);
		ObjectMatch.setPoints1(EntityMatch.getPoints1());
		ObjectMatch.setPoints2(EntityMatch.getPoints2());
		return ObjectMatch;

	}

	// Función Externa Nº1: Creacion del Usuario
	public static UserDTO CreateUser(String Username, 
									RepoDesk DeskRepo, 
									RepoUser UserRepo, 
									RepoDeskCards RepoDC,
									RepoCards CardsRepo) {

		UserEntity EntityUser = new UserEntity();
		EntityUser.setUserName(Username);
		DeskEntity DeskUser=CreateDesk(Username,DeskRepo,RepoDC, CardsRepo);
		EntityUser.setDeskUser(DeskUser);
		UserRepo.save(EntityUser);
		UserDTO ObjectUser = new UserDTO();
		ObjectUser.setUsername(Username);
		ObjectUser.setIduser(EntityUser.getIdUser());
		ObjectUser.setDeskUser( new DeskDTO());
		ObjectUser.getDeskUser().setNameDesk(DeskUser.getNameDesk());
		ObjectUser.getDeskUser().setIdDesk(DeskUser.getIdDesk());
		List<CardsDTO>ListCardsDTO=new ArrayList<>();
		ObjectUser.getDeskUser().setCards(ListCardsDTO);
		
		for(int i=0;i<DeskUser.getDeskCards().size();i++) {
		ObjectUser.getDeskUser().getCards().add(new CardsDTO(
												DeskUser.getDeskCards().get(i).getCard().getIdCard(),
												DeskUser.getDeskCards().get(i).getCard().getValour()
	));
		}

		

		return ObjectUser;
	}

	// Función Externa Nº2: Creacion de la Partida
	public static MatchDTO CreateMatch(UserDTO Player1, UserDTO Player2, RepoUser UserRepo, RepoMatch MatchRepo) {

		MatchEntity EntityMatch = new MatchEntity();
		EntityMatch.setPlayer1(UserRepo.ObtenerporId(Player1.getIduser()));
		EntityMatch.setPlayer1(UserRepo.ObtenerporId(Player1.getIduser()));
		EntityMatch.setPoints1(0);
		EntityMatch.setPoints2(0);
		EntityMatch.setState("¡ La partida ha empezado ! ");
		MatchRepo.save(EntityMatch);

		MatchDTO ObjectMatch = new MatchDTO();
		ObjectMatch.setIdMatch(EntityMatch.getIdMatch());
		ObjectMatch.setPlayer1(Player1);
		ObjectMatch.setPlayer2(Player2);
		ObjectMatch.setPoints1(EntityMatch.getPoints1());
		ObjectMatch.setPoints2(EntityMatch.getPoints2());
		ObjectMatch.setState(EntityMatch.getState());

		return ObjectMatch;

	}

	//Función Externa nº3: Comprobar la exsitencia del usuario
	public static boolean usuarioexistente(String username, 
										   RepoUser UserRepo) {
		boolean existe = false;
		List<UserEntity> ListaUsuarios = UserRepo.Obtenertodos();
		for (int i = 0; i < ListaUsuarios.size(); i++) {
			if (ListaUsuarios.get(i).getUserName().equals(username)) {
				existe = true;
			}
		}
		return existe;

	}
	
	public static DeskEntity CreateDesk(String Username,
										RepoDesk DeskRepo,
										RepoDeskCards RepoDC,
										RepoCards CardsRepo) {
	DeskEntity EntityDesk= new DeskEntity();
	String NameDesk= "Mazo de " + Username;
	EntityDesk.setNameDesk(NameDesk);
	EntityDesk=DeskRepo.save(EntityDesk);
	
	List<CardsEntity> Cards = new ArrayList<>();
	List<DeskCardEntity>DeskCards=new ArrayList<>();
	
	//Bucle para crear las cartas
	for (int i = 0; i < 5; i++) {
	int aleatorio = (int)(Math.random() * 130);
    CardsEntity nuevaCarta = new CardsEntity(aleatorio);
    Cards.add(nuevaCarta);
    nuevaCarta = CardsRepo.save(nuevaCarta); 
    DeskCardEntity relacion = new DeskCardEntity(EntityDesk, nuevaCarta);
    DeskCards.add(RepoDC.save(relacion)); 
	
	}
	EntityDesk.setDeskCards(DeskCards);
	
	
	return EntityDesk;
	}
}
