import React, { useEffect, useState, useRef } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { Card, Player } from '../types/game';
import CardComponent from './CardComponent';

interface CardRevealModalProps {
  visible: boolean;
  giftingPlayer: Player | undefined;
  receivingPlayer: Player | undefined;
  revealedCard: Card | null | undefined;
  selectedGiftName: string | undefined;
  onContinue: () => void;
}

const CardRevealModal: React.FC<CardRevealModalProps> = ({
  visible,
  giftingPlayer,
  receivingPlayer,
  revealedCard,
  selectedGiftName,
  onContinue,
}) => {
  const [showResult, setShowResult] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
  // Reset states when modal opens
  useEffect(() => {
    if (visible) {
      setShowResult(false);
      flipAnimation.setValue(0);
      
      // Start the flip animation after a short delay
      setTimeout(() => {
        Animated.timing(flipAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start(() => {
          // Show the result after the animation completes
          setTimeout(() => {
            setShowResult(true);
          }, 500);
        });
      }, 1000);
    }
  }, [visible, flipAnimation]);
  
  // Interpolate for the flip animation
  const frontFlip = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  
  const backFlip = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });
  
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [1, 0, 0, 0],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  if (!visible || !giftingPlayer || !receivingPlayer || !revealedCard || !selectedGiftName) {
    return null;
  }

  const isGiftNameCorrect = revealedCard.gift === selectedGiftName;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {receivingPlayer.name} refused the gift from {giftingPlayer.name} saying it's NOT a {selectedGiftName}!
          </Text>
          
          <View style={styles.cardContainer}>
            <View style={styles.cardWrapper}>
              {/* Card Back (facing initially) */}
              <Animated.View
                style={[
                  styles.cardFace,
                  {
                    transform: [{ rotateY: frontFlip }],
                    opacity: frontOpacity,
                    zIndex: flipAnimation.interpolate({
                      inputRange: [0, 0.5],
                      outputRange: [2, 1],
                    }),
                  },
                ]}
              >
                <View style={styles.cardBack}>
                  <Text style={styles.cardBackText}>?</Text>
                </View>
              </Animated.View>
              
              {/* Card Front (will be visible after flip) */}
              <Animated.View
                style={[
                  styles.cardFace,
                  {
                    transform: [{ rotateY: backFlip }],
                    opacity: backOpacity,
                    zIndex: flipAnimation.interpolate({
                      inputRange: [0.5, 1],
                      outputRange: [1, 2],
                    }),
                  },
                ]}
              >
                <CardComponent card={{ ...revealedCard, faceUp: true }} size="large" />
              </Animated.View>
            </View>
          </View>
          
          {showResult && (
            <View style={styles.resultContainer}>
              {isGiftNameCorrect ? (
                <Text style={styles.correctResult}>
                  <Text style={styles.dramaticReveal}>The gift is revealed!</Text>
                  {"\n\n"}
                  <Text style={styles.highlightedText}>{giftingPlayer.name} was telling the truth!</Text> 
                  {"\n"}
                  It really was a {revealedCard.gift}.
                  {"\n\n"}
                  <Text style={styles.penaltyText}>{receivingPlayer.name} was wrong to doubt!</Text>
                  {"\n"}
                  {receivingPlayer.name} gets a penalty point and must draw a new card.
                </Text>
              ) : (
                <Text style={styles.incorrectResult}>
                  <Text style={styles.dramaticReveal}>The gift is revealed!</Text>
                  {"\n\n"}
                  <Text style={styles.highlightedText}>{giftingPlayer.name} was lying!</Text>
                  {"\n"}
                  It was a {revealedCard.gift}, not a {selectedGiftName} as claimed!
                  {"\n\n"}
                  <Text style={styles.penaltyText}>{receivingPlayer.name} was right to be suspicious!</Text>
                  {"\n"}
                  {giftingPlayer.name} gets a penalty point and must draw a new card.
                </Text>
              )}
            </View>
          )}
          
          {showResult && (
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={onContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
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
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
    marginVertical: 10,
  },
  cardWrapper: {
    width: 200,
    height: 150,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    width: 200,
    height: 150,
    backgroundColor: '#4dabf7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cardBackText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
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
    lineHeight: 20,
    color: '#2b8a3e',
    fontWeight: 'bold',
  },
  incorrectResult: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: '#c92a2a',
    fontWeight: 'bold',
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
  dramaticReveal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c92a2a',
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b8a3e',
  },
  penaltyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c92a2a',
  },
});

export default CardRevealModal; 