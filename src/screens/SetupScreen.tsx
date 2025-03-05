import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Switch
} from 'react-native';
import { Player } from '../types/game';

interface SetupScreenProps {
  onStartGame: (
    players: Player[], 
    secondsToShowCard: number, 
    pointsToWin: number,
    arrowDirection: 'mixed' | 'up' | 'down',
    initialCards: 1 | 2
  ) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [secondsToShowCard, setSecondsToShowCard] = useState<string>('5');
  const [pointsToWin, setPointsToWin] = useState<string>('3');
  const [arrowDirection, setArrowDirection] = useState<'mixed' | 'up' | 'down'>('mixed');
  const [initialCards, setInitialCards] = useState<1 | 2>(1);

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    } else {
      Alert.alert('Maximum Players', 'You can only have up to 8 players.');
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 3) {
      const newPlayerNames = [...playerNames];
      newPlayerNames.splice(index, 1);
      setPlayerNames(newPlayerNames);
    } else {
      Alert.alert('Minimum Players', 'You need at least 3 players.');
    }
  };

  const updatePlayerName = (text: string, index: number) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = text;
    setPlayerNames(newPlayerNames);
  };

  const startGame = () => {
    // Validate and prepare player names (use defaults if empty)
    const preparedPlayerNames = playerNames.map((name, index) => 
      name.trim() === '' ? `Player ${index + 1}` : name.trim()
    );
    
    // Ensure we have at least 3 players with names
    if (preparedPlayerNames.length < 3) {
      Alert.alert('Not Enough Players', 'You need at least 3 players.');
      return;
    }

    // Validate seconds
    const seconds = parseInt(secondsToShowCard);
    if (isNaN(seconds) || seconds < 1) {
      Alert.alert('Invalid Time', 'Seconds must be a positive number.');
      return;
    }

    // Validate points
    const points = parseInt(pointsToWin);
    if (isNaN(points) || points < 1) {
      Alert.alert('Invalid Points', 'Points to win must be a positive number.');
      return;
    }

    // Create players
    const players: Player[] = preparedPlayerNames.map((name, index) => ({
      id: index,
      name: name,
      points: 0,
      cards: []
    }));

    // Start the game
    onStartGame(players, seconds, points, arrowDirection, initialCards);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>That's Not a Hat!</Text>
      <Text style={styles.subtitle}>Game Setup</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Players:</Text>
        {playerNames.map((name, index) => (
          <View key={index} style={styles.playerRow}>
            <TextInput
              style={styles.input}
              placeholder={`Player ${index + 1}`}
              value={name}
              onChangeText={(text) => updatePlayerName(text, index)}
            />
            {playerNames.length > 3 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePlayer(index)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {playerNames.length < 8 && (
          <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
            <Text style={styles.buttonText}>+ Add Player</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings:</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Seconds to show cards:</Text>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={secondsToShowCard}
            onChangeText={setSecondsToShowCard}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Points to lose:</Text>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={pointsToWin}
            onChangeText={setPointsToWin}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Challenge Settings:</Text>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingTitle}>Arrow Direction:</Text>
          <Text style={styles.settingDescription}>
            Make the game more challenging by only using one type of arrow direction.
          </Text>
          
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                arrowDirection === 'mixed' && styles.optionButtonSelected
              ]}
              onPress={() => setArrowDirection('mixed')}
            >
              <Text style={[
                styles.optionText, 
                arrowDirection === 'mixed' && styles.optionTextSelected
              ]}>Mixed</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                arrowDirection === 'up' && styles.optionButtonSelected
              ]}
              onPress={() => setArrowDirection('up')}
            >
              <Text style={[
                styles.optionText, 
                arrowDirection === 'up' && styles.optionTextSelected
              ]}>Up Only</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                arrowDirection === 'down' && styles.optionButtonSelected
              ]}
              onPress={() => setArrowDirection('down')}
            >
              <Text style={[
                styles.optionText, 
                arrowDirection === 'down' && styles.optionTextSelected
              ]}>Down Only</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingTitle}>Initial Cards:</Text>
          <Text style={styles.settingDescription}>
            Start with 2 cards per player for a more challenging game or for 2-player games.
          </Text>
          
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                initialCards === 1 && styles.optionButtonSelected
              ]}
              onPress={() => setInitialCards(1)}
            >
              <Text style={[
                styles.optionText, 
                initialCards === 1 && styles.optionTextSelected
              ]}>1 Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                initialCards === 2 && styles.optionButtonSelected
              ]}
              onPress={() => setInitialCards(2)}
            >
              <Text style={[
                styles.optionText, 
                initialCards === 2 && styles.optionTextSelected
              ]}>2 Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4dabf7',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  numberInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#38d9a9',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#4dabf7',
  },
  optionText: {
    color: '#666',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SetupScreen; 