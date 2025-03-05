export type Direction = 'up' | 'down';

export interface Card {
  id: number;
  gift: string;
  direction: Direction;
  faceUp: boolean;
}

export interface Player {
  id: number;
  name: string;
  points: number;
  cards: Card[];
  justDrawnCard: Card | null;
}

export interface GameState {
  players: Player[];
  deck: Card[];
  currentPlayerIndex: number;
  gamePhase: 'setup' | 'drawCard' | 'selectGift' | 'acceptReject' | 'gameOver';
  secondsToShowCard: number;
  pointsToWin: number;
  giftingPlayer?: Player;
  receivingPlayer?: Player;
  currentGift?: Card;
  selectedGiftName?: string;
} 