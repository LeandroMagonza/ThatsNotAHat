import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SetupScreen from './src/screens/SetupScreen';
import GameScreen from './src/screens/GameScreen';
import { Player } from './src/types/game';

// Ejecutar el script para generar el archivo de regalos
// Esta importación garantiza que el archivo se cargue aunque no lo usemos directamente
// La primera vez que se ejecuta la app, este archivo no existirá y se generará como fallback
try {
  require('./src/data/generatedGifts');
} catch (e) {
  console.warn('El archivo de regalos generados no existe, se usará la lista por defecto');
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [secondsToShowCard, setSecondsToShowCard] = useState(5);
  const [pointsToWin, setPointsToWin] = useState(3);
  const [arrowDirection, setArrowDirection] = useState<'mixed' | 'up' | 'down'>('mixed');
  const [initialCards, setInitialCards] = useState<1 | 2>(1);

  const handleStartGame = (
    configuredPlayers: Player[],
    configuredSeconds: number,
    configuredPoints: number,
    configuredArrowDirection: 'mixed' | 'up' | 'down',
    configuredInitialCards: 1 | 2
  ) => {
    setPlayers(configuredPlayers);
    setSecondsToShowCard(configuredSeconds);
    setPointsToWin(configuredPoints);
    setArrowDirection(configuredArrowDirection);
    setInitialCards(configuredInitialCards);
    setGameStarted(true);
  };

  const handleBackToSetup = () => {
    setGameStarted(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {!gameStarted ? (
        <SetupScreen onStartGame={handleStartGame} />
      ) : (
        <GameScreen
          players={players}
          secondsToShowCard={secondsToShowCard}
          pointsToWin={pointsToWin}
          arrowDirection={arrowDirection}
          initialCards={initialCards}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
