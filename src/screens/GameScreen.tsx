import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import PlayerList from '../components/PlayerList';
import CardModal from '../components/CardModal';
import GiftSelectionModal from '../components/GiftSelectionModal';
import AcceptRejectModal from '../components/AcceptRejectModal';
import ResultModal from '../components/ResultModal';
import GameOverModal from '../components/GameOverModal';
import CardRevealModal from '../components/CardRevealModal';
import { Card, GameState, Player } from '../types/game';
import {
  createDeck,
  dealInitialCards,
  getReceivingPlayerIndex,
  drawCard,
  addCardToPlayer,
  prepareTurnForGifting,
  removeOldestCard,
  addPenaltyPoint,
  isGameOver,
  getWinner
} from '../utils/gameUtils';

interface GameScreenProps {
  players: Player[];
  secondsToShowCard: number;
  pointsToWin: number;
  arrowDirection: 'mixed' | 'up' | 'down';
  initialCards: 1 | 2;
  onBackToSetup: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  players: initialPlayers,
  secondsToShowCard,
  pointsToWin,
  arrowDirection,
  initialCards,
  onBackToSetup,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    deck: [],
    currentPlayerIndex: 0,
    gamePhase: 'setup',
    secondsToShowCard,
    pointsToWin,
  });

  const [showCardModal, setShowCardModal] = useState(false);
  const [showGiftSelectionModal, setShowGiftSelectionModal] = useState(false);
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showCardRevealModal, setShowCardRevealModal] = useState(false);
  const [revealedCard, setRevealedCard] = useState<Card | null>(null);
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [penaltyPlayer, setPenaltyPlayer] = useState<Player | undefined>(undefined);
  const [pendingGameState, setPendingGameState] = useState<GameState | null>(null);
  
  // Nuevos estados para el botón de salida y la funcionalidad de depuración
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Initialize the game
  useEffect(() => {
    if (gameState.gamePhase === 'setup') {
      const deck = createDeck(arrowDirection);
      const { players: dealtPlayers, deck: remainingDeck } = dealInitialCards(initialPlayers, deck, initialCards);
      
      // Las cartas iniciales deben estar boca arriba
      setGameState({
        ...gameState,
        players: dealtPlayers,
        deck: remainingDeck,
        gamePhase: 'drawCard', // El primer jugador debe levantar una carta
      });
    }
  }, [gameState.gamePhase, initialPlayers, arrowDirection, initialCards]);

  // Current player
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  // Functions to advance the game
  const handleDrawCard = () => {
    if (gameState.deck.length === 0) {
      console.error("El mazo está vacío");
      return;
    }
    
    console.log("[handleDrawCard] Levantando carta del mazo");
    
    // Levantar carta del mazo
    const { card: drawnCard, deck: updatedDeck } = drawCard(gameState.deck);
    
    // Mostrar la carta brevemente
    drawnCard.faceUp = true;
    setRevealedCard(drawnCard);
    
    // Copiar todos los jugadores para evitar mutaciones
    const updatedPlayers = gameState.players.map(p => ({
      ...p,
      cards: [...p.cards],
      justDrawnCard: p.justDrawnCard ? { ...p.justDrawnCard } : null
    }));
    
    // Obtener y actualizar el jugador actual
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const updatedCurrentPlayer = { 
      ...updatedPlayers[currentPlayerIndex],
      justDrawnCard: drawnCard  // Guardar la carta en justDrawnCard, no en cards[]
    };
    
    // Actualizar el jugador en el array
    updatedPlayers[currentPlayerIndex] = updatedCurrentPlayer;
    
    // Actualizar el estado del juego
    setGameState({
      ...gameState,
      players: updatedPlayers,
      deck: updatedDeck,
      gamePhase: 'selectGift'
    });
    
    // Mostrar el modal con la carta
    setShowCardModal(true);
  };

  const handleCardModalClose = () => {
    setShowCardModal(false);
    
    // Si estamos en fase de seleccionar regalo, es momento de iniciar el proceso
    if (gameState.gamePhase === 'selectGift') {
      startGiftingProcess();
    }
  };

  const startGiftingProcess = () => {
    console.log("[startGiftingProcess] Iniciando proceso de regalo");
    console.log("[startGiftingProcess] Estado actual del jugador:", currentPlayer);
    
    if (!currentPlayer) {
      console.error("Error: No hay jugador actual");
      return;
    }
    
    // LÓGICA CLARA: Determinamos qué carta regalar
    // PRIORIDAD: Primero justDrawnCard, luego la más antigua en la cola
    let giftCard: Card | null = null;
    let isDrawnCard = false;
    
    // Caso 1: Usar justDrawnCard si existe (primera prioridad)
    if (currentPlayer.justDrawnCard !== null) {
      console.log("[startGiftingProcess] Usando carta recién levantada:", currentPlayer.justDrawnCard);
      giftCard = { ...currentPlayer.justDrawnCard }; // Copia para evitar modificar el original
      isDrawnCard = true;
    } 
    // Caso 2: Usar la carta más antigua de la cola (segunda prioridad)
    else if (currentPlayer.cards.length > 0) {
      console.log("[startGiftingProcess] Usando carta más antigua:", currentPlayer.cards[0]);
      giftCard = { ...currentPlayer.cards[0] }; // Copia para evitar modificar el original
    }
    
    if (!giftCard) {
      console.error("Error: El jugador no tiene cartas para regalar");
      return;
    }
    
    // Guardamos un log de qué carta se está regalando
    console.log("[startGiftingProcess] Carta a regalar ID:", giftCard.id, "Regalo:", giftCard.gift);
    
    // Determinar a quién le toca recibir el regalo
    const giftDirection = giftCard.direction;
    const receivingPlayerIndex = getReceivingPlayerIndex(
      gameState.currentPlayerIndex,
      giftDirection,
      gameState.players.length
    );
    
    // Actualizar el estado del juego con la información del regalo
    setGameState({
      ...gameState,
      currentGift: giftCard,
      giftingPlayer: currentPlayer,
      receivingPlayer: gameState.players[receivingPlayerIndex],
    });
    
    // Mostrar el modal para elegir el nombre del regalo
    setShowGiftSelectionModal(true);
  };

  const handleGiftSelection = (giftName: string) => {
    setShowGiftSelectionModal(false);
    
    if (!gameState.giftingPlayer || !gameState.receivingPlayer) return;
    
    setGameState({
      ...gameState,
      selectedGiftName: giftName,
    });
    
    setShowAcceptRejectModal(true);
  };

  // Función para llevar el juego al siguiente turno después de un regalo aceptado
  const moveToNextTurn = (updatedPlayers: Player[], nextPlayerIndex: number) => {
    const nextPlayer = updatedPlayers[nextPlayerIndex];
    
    // Si el siguiente jugador no tiene cartas, necesitamos un manejo especial
    if (!nextPlayer || !nextPlayer.cards || nextPlayer.cards.length === 0) {
      console.log("El siguiente jugador no tiene cartas. Pasando al turno de levantar carta.");
      setGameState({
        ...gameState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentGift: undefined,
        giftingPlayer: undefined,
        receivingPlayer: undefined,
        selectedGiftName: undefined,
        gamePhase: 'drawCard', // El jugador debe levantar una carta
      });
      return;
    }
    
    // Manejo normal cuando el jugador tiene cartas
    // Determinar a quién deberá regalar el siguiente jugador
    const nextGiftDirection = nextPlayer.cards[0].direction;
    const nextReceivingPlayerIndex = getReceivingPlayerIndex(
      nextPlayerIndex,
      nextGiftDirection,
      updatedPlayers.length
    );
    
    // Hacer una copia de la carta más antigua del siguiente jugador
    const nextOldestCard = { ...nextPlayer.cards[0] };
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentGift: nextOldestCard, // Usar una copia para evitar referencias compartidas
      giftingPlayer: nextPlayer,
      receivingPlayer: updatedPlayers[nextReceivingPlayerIndex],
      selectedGiftName: undefined,
      gamePhase: 'selectGift',
    });
  };

  const handleGiftAccepted = () => {
    setShowAcceptRejectModal(false);
    
    if (!gameState.giftingPlayer || !gameState.receivingPlayer || !gameState.currentGift) {
      console.error("No se puede aceptar un regalo sin jugador que regala, jugador que recibe o carta de regalo");
      return;
    }
    
    console.log("[handleGiftAccepted] Aceptando regalo");
    console.log("[handleGiftAccepted] Jugador que regala:", gameState.giftingPlayer.name, gameState.giftingPlayer);
    console.log("[handleGiftAccepted] Jugador que recibe:", gameState.receivingPlayer.name);
    console.log("[handleGiftAccepted] Regalo actual:", gameState.currentGift);
    
    // 1. Hacemos una copia profunda de los jugadores para evitar mutación
    const updatedPlayers = gameState.players.map(p => ({
      ...p,
      cards: [...p.cards],
      justDrawnCard: p.justDrawnCard ? { ...p.justDrawnCard } : null
    }));
    
    // 2. Obtenemos referencias a los jugadores actualizados
    let updatedGiftingPlayer = updatedPlayers[gameState.giftingPlayer.id];
    let updatedReceivingPlayer = updatedPlayers[gameState.receivingPlayer.id];
    
    // 3. Creamos una copia del regalo actual
    const giftCard = { ...gameState.currentGift };
    
    // 4. LÓGICA CLARA: Quitar la carta del jugador que regala
    if (updatedGiftingPlayer.justDrawnCard !== null && 
        updatedGiftingPlayer.justDrawnCard.id === giftCard.id) {
      // Si es la carta recién levantada, la limpiamos
      console.log("[handleGiftAccepted] Quitando carta de justDrawnCard");
      updatedGiftingPlayer.justDrawnCard = null;
    } else {
      // Si es de la cola, filtramos por ID para eliminarla
      console.log("[handleGiftAccepted] Cartas antes:", updatedGiftingPlayer.cards.map(c => `${c.id}:${c.gift}`));
      updatedGiftingPlayer.cards = updatedGiftingPlayer.cards.filter(card => card.id !== giftCard.id);
      console.log("[handleGiftAccepted] Cartas después:", updatedGiftingPlayer.cards.map(c => `${c.id}:${c.gift}`));
    }
    
    // 5. Añadir la carta a la cola del jugador que recibe (siempre boca abajo)
    const receivedGift = { ...giftCard, faceUp: false };
    updatedReceivingPlayer.cards.push(receivedGift);
    console.log("[handleGiftAccepted] Cartas del receptor:", updatedReceivingPlayer.cards.map(c => `${c.id}:${c.gift}`));
    
    // 6. Si había un jugador penalizado, lo reseteamos
    if (penaltyPlayer !== undefined) {
      setPenaltyPlayer(undefined);
    }
    
    // 7. Preparar para el siguiente turno (si no es el primer turno)
    let nextPlayerIndex = gameState.receivingPlayer.id;
    let nextPlayer = updatedReceivingPlayer;
    
    if (!isFirstTurn) {
      // El jugador que recibió debe regalar su carta más antigua
      nextPlayer = prepareTurnForGifting(nextPlayer);
      updatedPlayers[nextPlayerIndex] = nextPlayer;
    }
    
    // 8. Determinar el siguiente jugador que recibirá un regalo
    const nextReceivingPlayerIndex = getReceivingPlayerIndex(
      nextPlayerIndex,
      nextPlayer.cards[0]?.direction || 'up', // Protección contra undefined
      updatedPlayers.length
    );
    
    // 9. Crear una copia de la siguiente carta a regalar (fix para TypeScript)
    const nextOldestCard = nextPlayer.cards.length > 0 ? { ...nextPlayer.cards[0] } : undefined;
    
    // 10. Actualizar el estado del juego
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentGift: nextOldestCard,
      giftingPlayer: nextPlayer,
      receivingPlayer: updatedPlayers[nextReceivingPlayerIndex],
      selectedGiftName: undefined,
      gamePhase: 'selectGift',
    });
  };

  // Función que maneja cuando se rechaza un regalo
  const handleGiftRejected = () => {
    setShowAcceptRejectModal(false);
    
    if (
      !gameState.giftingPlayer || 
      !gameState.receivingPlayer || 
      !gameState.currentGift || 
      !gameState.selectedGiftName
    ) {
      console.error("No se puede rechazar un regalo sin jugador que regala, jugador que recibe, carta de regalo o nombre de regalo seleccionado");
      return;
    }
    
    try {
      console.log("[handleGiftRejected] Rechazando regalo");
      console.log("[handleGiftRejected] Jugador que regala:", gameState.giftingPlayer.name);
      console.log("[handleGiftRejected] Jugador que recibe:", gameState.receivingPlayer.name);
      console.log("[handleGiftRejected] Regalo actual:", gameState.currentGift);
      
      // Ahora TypeScript sabe que estos valores no son null ni undefined
      const currentGift = gameState.currentGift;
      const selectedGiftName = gameState.selectedGiftName;
      
      // 1. Hacemos una copia profunda de todos los jugadores
      const updatedPlayers = gameState.players.map(p => ({
        ...p,
        cards: [...p.cards],
        justDrawnCard: p.justDrawnCard ? { ...p.justDrawnCard } : null
      }));
      
      // 2. Obtenemos referencias a los jugadores actualizados
      let updatedGiftingPlayer = updatedPlayers[gameState.giftingPlayer.id];
      let updatedReceivingPlayer = updatedPlayers[gameState.receivingPlayer.id];
      
      // 3. Hacemos una copia de la carta del regalo actual
      let giftCard = { ...currentGift };
      
      // 4. LÓGICA CLARA: Quitar la carta del jugador que regala
      if (updatedGiftingPlayer.justDrawnCard !== null && 
          updatedGiftingPlayer.justDrawnCard.id === giftCard.id) {
        // Si es la carta recién levantada, la limpiamos
        console.log("[handleGiftRejected] Quitando carta de justDrawnCard");
        updatedGiftingPlayer.justDrawnCard = null;
      } else {
        // Si es de la cola, filtramos por ID para eliminarla
        console.log("[handleGiftRejected] Cartas antes:", updatedGiftingPlayer.cards.map(c => `${c.id}:${c.gift}`));
        updatedGiftingPlayer.cards = updatedGiftingPlayer.cards.filter(card => card.id !== giftCard.id);
        console.log("[handleGiftRejected] Cartas después:", updatedGiftingPlayer.cards.map(c => `${c.id}:${c.gift}`));
      }
      
      // 5. Revelamos la carta para mostrar si era correcta
      giftCard.faceUp = true;
      setRevealedCard(giftCard);
      
      // 6. Comprobamos si el nombre del regalo era correcto
      const isGiftNameCorrect = giftCard.gift === selectedGiftName;
      console.log("[handleGiftRejected] ¿Nombre correcto?", isGiftNameCorrect, "Dicho:", selectedGiftName, "Real:", giftCard.gift);
      
      // 7. Determinamos quién recibe la penalización
      let penalizedPlayer;
      if (isGiftNameCorrect) {
        // El jugador que recibe estaba equivocado al rechazar
        console.log("[handleGiftRejected] Penalizando al jugador que recibe por rechazar un regalo correcto");
        penalizedPlayer = addPenaltyPoint(updatedReceivingPlayer);
        updatedPlayers[updatedReceivingPlayer.id] = penalizedPlayer;
      } else {
        // El jugador que regala estaba equivocado sobre el regalo
        console.log("[handleGiftRejected] Penalizando al jugador que regala por mentir sobre el regalo");
        penalizedPlayer = addPenaltyPoint(updatedGiftingPlayer);
        updatedPlayers[updatedGiftingPlayer.id] = penalizedPlayer;
      }
      
      // 8. Guardamos el jugador penalizado para su uso posterior
      setPenaltyPlayer(penalizedPlayer);
      
      // 9. Verificamos si el juego ha terminado
      const isGameOverNow = isGameOver(updatedPlayers, gameState.pointsToWin);
      
      // 10. Agregamos la carta rechazada al final del mazo
      const updatedDeck = [...gameState.deck];
      // Reiniciamos la carta para que esté boca abajo antes de ponerla en el mazo
      giftCard.faceUp = false;
      updatedDeck.push(giftCard);
      console.log("[handleGiftRejected] Carta rechazada agregada al final del mazo:", giftCard.gift);
      
      // 11. Guardar el estado pendiente para aplicarlo después de los modales
      setPendingGameState({
        ...gameState,
        players: updatedPlayers,
        deck: updatedDeck, // Actualizamos el mazo con la carta rechazada
        // Importante: El jugador penalizado será el próximo en jugar
        currentPlayerIndex: penalizedPlayer.id,
        giftingPlayer: undefined,
        receivingPlayer: undefined,
        currentGift: undefined,
        selectedGiftName: undefined,
        gamePhase: isGameOverNow ? 'gameOver' : 'drawCard'
      });
      
      // 12. Mostramos primero el modal de revelación de carta con animación
      setShowCardRevealModal(true);
    } catch (error) {
      console.error("Error en handleGiftRejected:", error);
    }
  };

  const handleCardRevealContinue = () => {
    setShowCardRevealModal(false);
    
    // Si hay un estado pendiente, lo aplicamos ahora
    if (pendingGameState) {
      console.log("Aplicando estado pendiente después de rechazo de regalo");
      
      // Establecer el estado del juego con el estado pendiente
      setGameState(pendingGameState);
      setPendingGameState(null);
      
      // Si el juego ha terminado, mostrar el modal de fin de juego
      if (pendingGameState.gamePhase === 'gameOver') {
        setTimeout(() => {
          setShowGameOverModal(true);
        }, 500);
        return;
      }
      
      // Si el jugador penalizado debe robar una carta, comenzar ese proceso
      if (pendingGameState.gamePhase === 'drawCard' && penaltyPlayer) {
        if (pendingGameState.deck.length === 0) {
          // Si no hay más cartas, crear un nuevo mazo
          const newDeck = createDeck(arrowDirection);
          setGameState({
            ...pendingGameState,
            deck: newDeck,
          });
          return;
        }
        
        // El jugador penalizado levanta una carta nueva
        const { card: originalCard, deck } = drawCard(pendingGameState.deck);
        
        // Creamos una copia de la carta para evitar referencias compartidas
        const card = { ...originalCard };
        card.faceUp = true; // Aseguramos que la carta está boca arriba para mostrarla
        
        // Mostrar la carta a todos
        setRevealedCard(card);
        setShowCardModal(true);
        
        // IMPORTANTE: Cuando un jugador levanta una carta después de una penalización,
        // debe regalarla inmediatamente a otro jugador, pero primero debe ver la carta
        const updatedPlayers = [...pendingGameState.players];
        const penalizedPlayerIndex = updatedPlayers.findIndex(p => p.id === penaltyPlayer.id);
        
        // Verificamos que el jugador penalizado todavía tenga sus cartas originales
        // No agregamos la carta nueva a su mano, solo la guardamos como currentGift
        // para regalarla directamente
        const updatedPenalizedPlayer = { ...penaltyPlayer };
        // Asignamos la carta recién sacada a justDrawnCard para asegurar que esta carta es la que se usará
        updatedPenalizedPlayer.justDrawnCard = card;
        
        // Aseguramos que el jugador penalizado nunca se quede sin cartas
        // Si por algún error no tiene cartas, le agregamos esta carta a su mano
        if (updatedPenalizedPlayer.cards.length === 0) {
          console.warn("Corrigiendo: El jugador penalizado no tiene cartas. Esto no debería ocurrir.");
          // En este caso excepcional, le damos la carta al jugador
          updatedPenalizedPlayer.cards.push({ ...card, faceUp: true });
          // Y le damos otra carta del mazo para regalar
          if (deck.length > 0) {
            const { card: newGiftCard, deck: updatedDeck } = drawCard(deck);
            newGiftCard.faceUp = true; // Hacemos que esta carta sea visible
            updatedPlayers[penalizedPlayerIndex] = updatedPenalizedPlayer;
            
            // Actualizamos el mazo y la carta a regalar
            setGameState({
              ...pendingGameState,
              players: updatedPlayers,
              deck: updatedDeck,
              currentGift: newGiftCard,
              currentPlayerIndex: penalizedPlayerIndex,
              giftingPlayer: updatedPenalizedPlayer,
              gamePhase: 'selectGift'
            });
            return;
          }
        } else {
          // Flujo normal: El jugador mantiene sus cartas originales
          updatedPlayers[penalizedPlayerIndex] = updatedPenalizedPlayer;
        }
        
        // Determinamos a quién se le regalará basado en la dirección de la flecha
        const receivingPlayerIndex = getReceivingPlayerIndex(
          penalizedPlayerIndex,
          card.direction,
          updatedPlayers.length
        );
        
        setGameState({
          ...pendingGameState,
          players: updatedPlayers,
          deck,
          currentGift: card, // Esta carta se regalará directamente
          currentPlayerIndex: penalizedPlayerIndex,
          giftingPlayer: updatedPenalizedPlayer,
          receivingPlayer: updatedPlayers[receivingPlayerIndex],
          gamePhase: 'selectGift' // Después de levantar una carta, el jugador debe seleccionar qué regalo es
        });
        
        // Reiniciar el jugador penalizado
        setPenaltyPlayer(undefined);
      }
    }
  };

  // Función para manejar cuando el jugador continúa después de ver el resultado
  const handleResultContinue = () => {
    setShowResultModal(false);
    
    console.log("[handleResultContinue] Continuando después de mostrar resultado");
    
    // Si hay un estado pendiente (después de un rechazo), lo aplicamos
    if (pendingGameState) {
      console.log("[handleResultContinue] Aplicando estado pendiente:", pendingGameState);
      setGameState(pendingGameState);
      setPendingGameState(null);
      
      // Si el juego ha terminado, mostrar el modal de fin de juego
      if (pendingGameState.gamePhase === 'gameOver') {
        setTimeout(() => {
          setShowGameOverModal(true);
        }, 500);
        return;
      }
      
      // Si no, vamos a drawCard para que el jugador penalizado levante una carta
      return;
    }
    
    // Si no hay estado pendiente, es un flujo normal 
    // (después de aceptar un regalo, continuamos con el siguiente jugador)
    // Esto debería ser gestionado completamente por handleGiftAccepted
    console.log("[handleResultContinue] No hay estado pendiente, flujo normal");
  };

  const handlePlayAgain = () => {
    // Reset the game with the same players but clear points and cards
    const resetPlayers = gameState.players.map(player => ({
      ...player,
      points: 0,
      cards: []
    }));
    
    setGameState({
      ...gameState,
      players: resetPlayers,
      deck: [],
      currentPlayerIndex: 0,
      gamePhase: 'setup',
      giftingPlayer: undefined,
      receivingPlayer: undefined,
      currentGift: undefined,
      selectedGiftName: undefined,
    });
    
    setShowGameOverModal(false);
  };

  const handleNewGame = () => {
    setShowGameOverModal(false);
    onBackToSetup();
  };

  // Effect para actualizar la carta revelada cuando cambia el estado del juego
  useEffect(() => {
    // Eliminamos esta lógica que está sobrescribiendo la carta revelada incorrectamente
    // cuando se muestra el modal de carta
    // if (showCardModal && gameState.currentGift) {
    //   setRevealedCard(gameState.currentGift);
    // }
  }, [showCardModal, gameState.currentGift]);
  
  // Funciones para el botón de salida
  const handleExitButtonPress = () => {
    setShowExitConfirmation(true);
  };
  
  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    onBackToSetup();
  };
  
  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };
  
  // Funciones para la funcionalidad de depuración
  const handleLongPressStart = () => {
    console.log("Inicio de presión larga para modo depuración");
    const timer = setTimeout(() => {
      console.log("Activando modo depuración: cartas boca arriba");
      toggleDebugMode();
    }, 8000); // 8 segundos
    
    setLongPressTimer(timer);
  };
  
  const handleLongPressEnd = () => {
    if (longPressTimer) {
      console.log("Cancelando presión larga");
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  const toggleDebugMode = () => {
    // Crear copia profunda del estado actual
    const updatedPlayers = gameState.players.map(player => ({
      ...player,
      // Voltear todas las cartas boca arriba
      cards: player.cards.map(card => ({
        ...card,
        faceUp: !isDebugMode // En modo depuración: true, al salir: false
      })),
      justDrawnCard: player.justDrawnCard ? {
        ...player.justDrawnCard,
        faceUp: !isDebugMode
      } : null
    }));
    
    // Voltear todas las cartas del mazo
    const updatedDeck = gameState.deck.map(card => ({
      ...card,
      faceUp: !isDebugMode
    }));
    
    // Actualizar el estado del juego
    setGameState({
      ...gameState,
      players: updatedPlayers,
      deck: updatedDeck
    });
    
    // Cambiar el estado de depuración
    setIsDebugMode(!isDebugMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de salida */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={handleExitButtonPress}
        onPressIn={handleLongPressStart}
        onPressOut={handleLongPressEnd}
      >
        <Text style={styles.exitButtonText}>X</Text>
      </TouchableOpacity>
      
      {/* Modal de confirmación de salida */}
      {showExitConfirmation && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showExitConfirmation}
          onRequestClose={handleCancelExit}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>¿Estás seguro?</Text>
              <Text style={styles.modalText}>
                ¿Deseas salir de la partida actual y volver a la configuración?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelExit}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmExit}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      
      {/* Indicador de modo depuración */}
      {isDebugMode && (
        <View style={styles.debugIndicator}>
          <Text style={styles.debugText}>MODO DEPURACIÓN</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.title}>That's Not a Hat!</Text>
        <Text style={styles.subtitle}>
          {gameState.gamePhase === 'drawCard' && currentPlayer
            ? `${currentPlayer.name}'s Turn - Draw a card`
            : gameState.gamePhase === 'selectGift' && currentPlayer
            ? `${currentPlayer.name}'s Turn - Give a gift to another player`
            : 'Pass the device to the current player'}
        </Text>
      </View>
      
      <View style={styles.playersContainer}>
        <PlayerList 
          players={gameState.players} 
          currentPlayerIndex={gameState.currentPlayerIndex} 
        />
      </View>
      
      {gameState.gamePhase === 'drawCard' && (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleDrawCard}
        >
          <Text style={styles.actionButtonText}>
            {currentPlayer?.cards.length === 0 
              ? "Draw Your First Card" 
              : "Draw a Card"
            }
          </Text>
        </TouchableOpacity>
      )}
      
      {/* For subsequent turns, we need a way to start the gift giving process */}
      {gameState.gamePhase === 'selectGift' && !showGiftSelectionModal && (
        <View style={styles.actionContainer}>
          <Text style={styles.instructionText}>
            {isFirstTurn || (gameState.currentGift && !currentPlayer?.cards.length)
              ? "Gift the card you just drew to another player"
              : gameState.currentPlayerIndex !== undefined && gameState.receivingPlayer
                ? `Gift your oldest card to ${gameState.receivingPlayer?.name}`
                : 'Ready to give a gift'
            }
          </Text>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={startGiftingProcess}
          >
            <Text style={styles.actionButtonText}>Give a Gift</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <CardModal
        visible={showCardModal}
        card={revealedCard}
        secondsToShow={gameState.secondsToShowCard}
        onClose={handleCardModalClose}
        message={`${currentPlayer?.name}, here's your card!`}
      />
      
      <GiftSelectionModal
        visible={showGiftSelectionModal}
        giftingPlayer={gameState.giftingPlayer}
        receivingPlayer={gameState.receivingPlayer}
        onSelect={handleGiftSelection}
        onCancel={() => setShowGiftSelectionModal(false)}
      />
      
      <AcceptRejectModal
        visible={showAcceptRejectModal}
        giftingPlayer={gameState.giftingPlayer}
        receivingPlayer={gameState.receivingPlayer}
        selectedGiftName={gameState.selectedGiftName}
        onAccept={handleGiftAccepted}
        onReject={handleGiftRejected}
      />
      
      <CardRevealModal
        visible={showCardRevealModal}
        giftingPlayer={gameState.giftingPlayer}
        receivingPlayer={gameState.receivingPlayer}
        revealedCard={revealedCard}
        selectedGiftName={gameState.selectedGiftName}
        onContinue={handleCardRevealContinue}
      />
      
      <ResultModal
        visible={showResultModal}
        giftingPlayer={gameState.giftingPlayer}
        receivingPlayer={gameState.receivingPlayer}
        revealedCard={revealedCard}
        selectedGiftName={gameState.selectedGiftName}
        penaltyPlayer={penaltyPlayer}
        onContinue={handleResultContinue}
      />
      
      <GameOverModal
        visible={showGameOverModal}
        players={gameState.players}
        winner={gameState.gamePhase === 'gameOver' ? getWinner(gameState.players) : null}
        onPlayAgain={handlePlayAgain}
        onNewGame={handleNewGame}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 10,
    backgroundColor: '#4dabf7',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  playersContainer: {
    flex: 1,
    padding: 5,
  },
  actionContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 15,
    paddingTop: 5,
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#4dabf7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ff3b30',
    zIndex: 100,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugIndicator: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    alignItems: 'center',
    zIndex: 99,
  },
  debugText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen; 