import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Player } from '../types/game';

interface GameOverModalProps {
  visible: boolean;
  players: Player[];
  winner: Player | null;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  players,
  winner,
  onPlayAgain,
  onNewGame,
}) => {
  if (!visible || !players.length) return null;

  // Sort players by points (lowest first, since lower points is better)
  const sortedPlayers = [...players].sort((a, b) => a.points - b.points);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Game Over!</Text>
          
          {winner && (
            <View style={styles.winnerContainer}>
              <Text style={styles.winnerText}>
                {winner.name} wins with {winner.points} {winner.points === 1 ? 'point' : 'points'}!
              </Text>
            </View>
          )}
          
          <Text style={styles.resultsTitle}>Final Results:</Text>
          
          <FlatList
            data={sortedPlayers}
            keyExtractor={(item) => item.id.toString()}
            style={styles.playersList}
            renderItem={({ item, index }) => (
              <View style={[
                styles.playerItem,
                index === 0 && styles.winnerItem
              ]}>
                <Text style={styles.playerRank}>#{index + 1}</Text>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerPoints}>
                  {item.points} {item.points === 1 ? 'point' : 'points'}
                </Text>
              </View>
            )}
          />
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain}>
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.newGameButton} onPress={onNewGame}>
              <Text style={styles.buttonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  winnerContainer: {
    backgroundColor: '#fff9db',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fcc419',
    width: '100%',
  },
  winnerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e67700',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  playersList: {
    width: '100%',
    maxHeight: 200,
  },
  playerItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  winnerItem: {
    backgroundColor: '#fff3bf',
    borderWidth: 1,
    borderColor: '#fcc419',
  },
  playerRank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
  },
  playerPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 70,
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  playAgainButton: {
    backgroundColor: '#4dabf7',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    elevation: 2,
  },
  newGameButton: {
    backgroundColor: '#38d9a9',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default GameOverModal; 