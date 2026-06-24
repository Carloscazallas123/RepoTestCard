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

import jakarta.transaction.Transactional;

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
	@Autowired
	RepoGame RepoGame;

	// Lista para esperar la partida
	private static final ConcurrentLinkedQueue<String> MatchMaking = new ConcurrentLinkedQueue<>();

	// Lista para las Cartas
	private static final ConcurrentLinkedQueue<CardsDTO> ColaCartas = new ConcurrentLinkedQueue<>();
	
	@MessageMapping("/CrearPartida")
	@SendTo("/topic/partida")
	@Transactional
	public MatchDTO realizarjugada(String NameUser) {
		MatchDTO Match = new MatchDTO();
		UserDTO Player1 = new UserDTO();
		boolean existente = usuarioexistente(NameUser, UserRepo);

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

	@MessageMapping("/CrearJugada")
	@SendTo("/topic/Jugada")
	@Transactional
	public GameDTO GameMatch(CardsDTO carta) {
		
		//Comprobamos las cartas
		ColaCartas.add(carta);
		if (ColaCartas.size() < 2) { 
		System.out.println("No hay mas cartas..."); 
		return new GameDTO(999,carta,null) ; }
		
		//-----En Desarollo
		
		CardsDTO carta1=ColaCartas.poll();
		System.out.println("Carta Nº1 -->  ID:" + carta1.getIdCard() + " Valor: " + carta1.getValour());
		CardsDTO carta2=ColaCartas.poll();
		System.out.println("Carta Nº1 -->  ID:" + carta2.getIdCard() + " Valor: " + carta2.getValour());
		//Guardo la Jugada
		GameEntity EntityGame= new GameEntity();
		EntityGame.setCard1(CardsRepo.ObtenerporId(carta1.getIdCard()));
		EntityGame.setCard2(CardsRepo.ObtenerporId(carta2.getIdCard()));
		List<MatchEntity>ListaPartidos=MatchRepo.ObtenerTodos();
		
		
		for(int i=0;i<ListaPartidos.size();i++) {
		List<DeskCardEntity> Mazo1 = ListaPartidos.get(i).getPlayer1().getDeskUser().getDeskCards();
			for(int e=0;e<Mazo1.size();e++) {
				if(Mazo1.get(e).getCard().getIdCard() == carta1.getIdCard() 
				   || Mazo1.get(e).getCard().getIdCard() == carta2.getIdCard()) {
					EntityGame.setGameMatch(ListaPartidos.get(i));
				}
			}
		}
		
		RepoGame.save(EntityGame);
		GameDTO jugada=new GameDTO(EntityGame.getGameMatch().getIdMatch(), carta1,carta2); 
		ColaCartas.clear(); return jugada;
	}
	
	@MessageMapping("/TerminarPartida")
	@SendTo("/topic/Terminar")
	@Transactional
	public synchronized MatchDTO FinishMatch(MatchDTO Partida) {
		// 1. Obtenemos la partida fresca
		MatchEntity match = MatchRepo.findById(Partida.getIdMatch()).orElse(null);

		if (match != null) {
		    // 2. Guardamos las IDs de los usuarios
		    int idP1 = match.getPlayer1() != null ? match.getPlayer1().getIdUser() : 0;
		    int idP2 = match.getPlayer2() != null ? match.getPlayer2().getIdUser() : 0;
		    
		    // Guardamos las IDs de los tableros
		    int idDeskP1 = (match.getPlayer1() != null && match.getPlayer1().getDeskUser() != null) ? match.getPlayer1().getDeskUser().getIdDesk() : null;
		    int idDeskP2 = (match.getPlayer2() != null && match.getPlayer2().getDeskUser() != null) ? match.getPlayer2().getDeskUser().getIdDesk() : null;

		    // 3. Desvinculamos a los usuarios antes de borrarlos para evitar colisiones de FK
		    UserRepo.desvincularTablero(idP1);
		    UserRepo.desvincularTablero(idP2);

		    // 4. BORRAR CARTAS: Si tus tableros manejan cartas con orphanRemoval o Cascade en la lista 'deskCards', 
		    // al borrar el tablero se borrarán sus cartas automáticamente. 
		    // Si no es así, las vaciamos explícitamente desde el repositorio de cartas o el del tablero:
		    if (idDeskP1 != 0) {
		    	DeskRepo.findById(idDeskP1).ifPresent(desk -> {
		            if (desk.getDeskCards() != null) {
		                desk.getDeskCards().clear(); // Si tiene orphanRemoval, esto borra las cartas de la BD
		                DeskRepo.save(desk);
		            }
		        });
		    }
		    if (idDeskP2 != 0) {
		    	DeskRepo.findById(idDeskP2).ifPresent(desk -> {
		            if (desk.getDeskCards() != null) {
		                desk.getDeskCards().clear();
		                DeskRepo.save(desk);
		            }
		        });
		    }

		    // 5. BORRAR TABLEROS: Ahora que están vacíos de cartas y desvinculados de usuarios
		    if (idDeskP1 != 0) DeskRepo.deleteById(idDeskP1);
		    if (idDeskP2 != 0) DeskRepo.deleteById(idDeskP2);

		    // 6. BORRAR USUARIOS: Los eliminamos de la BD una vez sus dependencias están limpias
		    if (idP1 != 0) UserRepo.deleteById(idP1);
		    if (idP2 != 0) UserRepo.deleteById(idP2);

		    // 7. Por último, borramos la partida
		    MatchRepo.delete(match);
		}
	
	return Partida;
	}

	
	// Función Externa Nº1: Creacion del Usuario
	public static UserDTO CreateUser(String Username, RepoDesk DeskRepo, RepoUser UserRepo, RepoDeskCards RepoDC,
			RepoCards CardsRepo) {

		UserEntity EntityUser = new UserEntity();
		EntityUser.setUserName(Username);
		DeskEntity DeskUser = CreateDesk(Username, DeskRepo, RepoDC, CardsRepo);
		EntityUser.setDeskUser(DeskUser);
		UserRepo.save(EntityUser);
		UserDTO ObjectUser = new UserDTO();
		ObjectUser.setUsername(Username);
		ObjectUser.setIduser(EntityUser.getIdUser());
		ObjectUser.setDeskUser(new DeskDTO());
		ObjectUser.getDeskUser().setNameDesk(DeskUser.getNameDesk());
		ObjectUser.getDeskUser().setIdDesk(DeskUser.getIdDesk());
		List<CardsDTO> ListCardsDTO = new ArrayList<>();
		ObjectUser.getDeskUser().setCards(ListCardsDTO);

		for (int i = 0; i < DeskUser.getDeskCards().size(); i++) {
			ObjectUser.getDeskUser().getCards().add(new CardsDTO(DeskUser.getDeskCards().get(i).getCard().getIdCard(),
					DeskUser.getDeskCards().get(i).getCard().getValour()));
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

	// Función Externa nº3: Comprobar la exsitencia del usuario
	public static boolean usuarioexistente(String username, RepoUser UserRepo) {
		boolean existe = false;
		List<UserEntity> ListaUsuarios = UserRepo.Obtenertodos();
		for (int i = 0; i < ListaUsuarios.size(); i++) {
			if (ListaUsuarios.get(i).getUserName().equals(username)) {
				existe = true;
			}
		}
		return existe;

	}

	// Función Externa nº4: Crear el Mazo
	public static DeskEntity CreateDesk(String Username, RepoDesk DeskRepo, RepoDeskCards RepoDC, RepoCards CardsRepo) {
		DeskEntity EntityDesk = new DeskEntity();
		String NameDesk = "Mazo de " + Username;
		EntityDesk.setNameDesk(NameDesk);
		EntityDesk = DeskRepo.save(EntityDesk);

		List<CardsEntity> Cards = new ArrayList<>();
		List<DeskCardEntity> DeskCards = new ArrayList<>();

		// Bucle para crear las cartas
		for (int i = 0; i < 5; i++) {
			int aleatorio = (int) (Math.random() * 130);
			CardsEntity nuevaCarta = new CardsEntity();
			nuevaCarta.setValour(aleatorio);
			Cards.add(nuevaCarta);
			nuevaCarta = CardsRepo.save(nuevaCarta);
			DeskCardEntity relacion = new DeskCardEntity(EntityDesk, nuevaCarta);
			DeskCards.add(RepoDC.save(relacion));

		}
		EntityDesk.setDeskCards(DeskCards);

		return EntityDesk;

	}

}
