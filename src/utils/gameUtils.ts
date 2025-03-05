import { Card, Direction, GameState, Player } from "../types/game";
import { gifts } from "../data/generatedGifts";

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Initialize a new deck of cards with optional direction preference
export const createDeck = (arrowDirection: 'mixed' | 'up' | 'down' = 'mixed'): Card[] => {
  return shuffleArray(gifts).map((gift, index) => {
    // Determine direction based on the arrowDirection parameter
    let direction: Direction;
    if (arrowDirection === 'mixed') {
      direction = Math.random() < 0.5 ? 'up' : 'down';
    } else {
      direction = arrowDirection;
    }
    
    return {
      id: index,
      gift,
      direction,
      faceUp: false
    };
  });
};

// Deal initial cards to each player - the initial cards are face up
export const dealInitialCards = (
  players: Player[], 
  deck: Card[], 
  initialCards: 1 | 2 = 1
): { players: Player[], deck: Card[] } => {
  const newPlayers = [...players];
  const newDeck = [...deck];
  
  // Deal the specified number of initial cards to each player
  for (const player of newPlayers) {
    player.cards = []; // Clear any existing cards
    player.justDrawnCard = null; // Inicializar justDrawnCard como null
    
    // Deal 1 or 2 cards based on the initialCards parameter
    for (let i = 0; i < initialCards; i++) {
      if (newDeck.length > 0) {
        const card = newDeck.shift()!;
        card.faceUp = true; // Initial cards are face up so players can see them
        player.cards.push(card);
      }
    }
  }
  
  return { players: newPlayers, deck: newDeck };
};

// Get the index of the player who should receive the gift
export const getReceivingPlayerIndex = (
  currentPlayerIndex: number, 
  direction: Direction, 
  totalPlayers: number
): number => {
  if (direction === 'up') {
    return (currentPlayerIndex - 1 + totalPlayers) % totalPlayers;
  } else {
    return (currentPlayerIndex + 1) % totalPlayers;
  }
};

// Draw a card from the deck
export const drawCard = (deck: Card[]): { card: Card, deck: Card[] } => {
  const newDeck = [...deck];
  const card = newDeck.shift()!;
  card.faceUp = true; // Card is initially shown face up
  return { card, deck: newDeck };
};

// Add a card to a player
export const addCardToPlayer = (player: Player, card: Card): Player => {
  return {
    ...player,
    cards: [...player.cards, card]
  };
};

// Turn player's old card face down for gifting
export const prepareTurnForGifting = (player: Player): Player => {
  const newPlayer = { ...player };
  if (newPlayer.cards.length > 0) {
    newPlayer.cards = newPlayer.cards.map((card, index) => {
      if (index === 0) { // Only flip the oldest card (first in array)
        return { ...card, faceUp: false };
      }
      return card;
    });
  }
  return newPlayer;
};

// Remove the first card from a player
export const removeOldestCard = (player: Player): { player: Player, card: Card } => {
  // Hacer una copia profunda del jugador y sus cartas
  const newPlayer = { 
    ...player,
    cards: [...player.cards] // Copia del array
  };
  
  // Si el jugador tiene más de una carta, podemos quitar la más antigua
  if (newPlayer.cards.length > 1) {
    const card = { ...newPlayer.cards.shift()! }; // Copia de la carta
    return { player: newPlayer, card };
  } 
  // Si solo tiene una carta, registramos un warning pero devolvemos una copia de la carta
  // sin quitarla del jugador
  else if (newPlayer.cards.length === 1) {
    console.warn("Intento de quitar la única carta de un jugador, devolviendo una copia sin quitarla");
    const card = { ...newPlayer.cards[0] }; // Copia de la carta sin quitarla
    return { player: newPlayer, card };
  } 
  // Si el jugador no tiene cartas (no debería ocurrir), devolvemos al jugador sin cambios
  else {
    console.error("Error: Intentando quitar una carta de un jugador que no tiene cartas");
    // Crear una carta vacía con valores por defecto para evitar errores
    const defaultCard: Card = {
      id: -1,
      gift: "Error",
      direction: "up",
      faceUp: true
    };
    return { player: newPlayer, card: defaultCard };
  }
};

// Add a penalty point to a player
export const addPenaltyPoint = (player: Player): Player => {
  return {
    ...player,
    points: player.points + 1
  };
};

// Check if the game is over
export const isGameOver = (players: Player[], pointsToWin: number): boolean => {
  return players.some(player => player.points >= pointsToWin);
};

// Get the winner
export const getWinner = (players: Player[]): Player => {
  // The player with the LEAST points wins
  return [...players].sort((a, b) => a.points - b.points)[0];
}; 