import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Player } from '../types/game';
import CardComponent from './CardComponent';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ 
  players, 
  currentPlayerIndex 
}) => {
  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const isCurrentPlayer = index === currentPlayerIndex;
    
    return (
      <View style={[
        styles.playerItem, 
        isCurrentPlayer && styles.currentPlayer
      ]}>
        <View style={styles.playerInfo}>
          <Text style={[
            styles.playerName,
            isCurrentPlayer && styles.currentPlayerText
          ]}>
            {isCurrentPlayer ? '➤ ' : ''}{item.name}
          </Text>
          <Text style={styles.playerPoints}>
            {item.points} {item.points === 1 ? 'point' : 'points'}
          </Text>
        </View>
        
        <View style={styles.cardsContainer}>
          {item.cards.length > 0 ? (
            item.cards.map((card, cardIndex) => (
              <View key={cardIndex} style={styles.cardWrapper}>
                <CardComponent 
                  card={card} 
                  size="small" 
                  isOldest={cardIndex === 0}
                />
              </View>
            ))
          ) : (
            <CardComponent card={null} size="small" />
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={players}
      renderItem={renderPlayer}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 5,
  },
  playerItem: {
    flexDirection: 'row',
    padding: 8,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentPlayer: {
    backgroundColor: '#e3fafc',
    borderWidth: 2,
    borderColor: '#15aabf',
  },
  playerInfo: {
    flex: 1,
    paddingRight: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currentPlayerText: {
    color: '#0b7285',
  },
  playerPoints: {
    fontSize: 12,
    color: '#666',
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '60%',
  },
  cardWrapper: {
    marginLeft: -15, // Reducido el overlap para cartas apaisadas
  },
});

export default PlayerList; 