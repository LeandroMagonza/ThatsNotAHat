import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Card, Direction } from '../types/game';
import { getGiftImageSource } from '../data/generatedGifts';

interface CardComponentProps {
  card: Card | null | undefined;
  size?: 'small' | 'medium' | 'large';
  isOldest?: boolean; // Flag to indicate if this is the oldest card (to be gifted)
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  card, 
  size = 'medium',
  isOldest = false
}) => {
  if (!card) {
    return (
      <View style={[
        styles.emptyCard, 
        styles[`${size}Card`]
      ]}>
        <Text style={styles.emptyText}>No Card</Text>
      </View>
    );
  }

  if (card.faceUp) {
    return (
      <View style={[
        styles.card, 
        styles[`${size}Card`], 
        styles.faceUp,
        isOldest && styles.oldestCard
      ]}>
        <Image
          source={getGiftImageSource(card.gift)}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.cardText}>{card.gift}</Text>
        {isOldest && <Text style={styles.oldestLabel}>To Gift</Text>}
      </View>
    );
  } else {
    return (
      <View style={[
        styles.card, 
        styles[`${size}Card`], 
        styles.faceDown,
        isOldest && styles.oldestCard
      ]}>
        <Text style={styles.cardText}>?</Text>
        {card.direction && (
          <View style={styles.directionContainer}>
            <Text style={styles.directionText}>
              {card.direction === 'up' ? '↑' : '↓'}
            </Text>
          </View>
        )}
        {isOldest && <Text style={styles.oldestLabel}>To Gift</Text>}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  smallCard: {
    width: 80,
    height: 60,
    borderRadius: 6,
  },
  mediumCard: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  largeCard: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  faceUp: {
    backgroundColor: 'white',
    borderColor: '#ddd',
  },
  faceDown: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  emptyCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 5,
  },
  cardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  cardImage: {
    width: '70%',
    height: '60%',
  },
  emptyText: {
    fontSize: 12,
    color: '#999',
  },
  directionContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  oldestCard: {
    borderWidth: 2,
    borderColor: '#e67700',
  },
  oldestLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff3bf',
    color: '#e67700',
    fontSize: 9,
    fontWeight: 'bold',
    padding: 2,
    borderRadius: 4,
  },
});

export default CardComponent; 