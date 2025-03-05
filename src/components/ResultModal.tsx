import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, Player } from '../types/game';
import CardComponent from './CardComponent';

interface ResultModalProps {
  visible: boolean;
  giftingPlayer: Player | undefined;
  receivingPlayer: Player | undefined;
  revealedCard: Card | null | undefined;
  selectedGiftName: string | undefined;
  penaltyPlayer: Player | undefined;
  onContinue: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  giftingPlayer,
  receivingPlayer,
  revealedCard,
  selectedGiftName,
  penaltyPlayer,
  onContinue,
}) => {
  if (!visible || !giftingPlayer || !receivingPlayer || !revealedCard || !selectedGiftName || !penaltyPlayer) {
    return null;
  }

  const isGiftingPlayerWrong = penaltyPlayer.id === giftingPlayer.id;
  const result = revealedCard.gift === selectedGiftName;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Gift Revealed!</Text>
          
          <View style={styles.cardContainer}>
            <CardComponent card={{ ...revealedCard, faceUp: true }} size="large" />
          </View>
          
          <View style={styles.resultContainer}>
            {result ? (
              <Text style={styles.correctResult}>
                {giftingPlayer.name} was right! It was a {revealedCard.gift}.
              </Text>
            ) : (
              <Text style={styles.incorrectResult}>
                {giftingPlayer.name} was wrong! It was a {revealedCard.gift}, not a {selectedGiftName}.
              </Text>
            )}
            
            <Text style={styles.penaltyText}>
              {penaltyPlayer.name} gets a penalty point!
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={onContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
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
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  correctResult: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    color: '#2b8a3e',
    fontWeight: 'bold',
  },
  incorrectResult: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    color: '#c92a2a',
    fontWeight: 'bold',
  },
  penaltyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#e03131',
  },
  continueButton: {
    backgroundColor: '#4dabf7',
    borderRadius: 16,
    padding: 10,
    paddingHorizontal: 24,
    elevation: 2,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ResultModal; 