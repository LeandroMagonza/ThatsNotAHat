import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card } from '../types/game';
import CardComponent from './CardComponent';

interface CardModalProps {
  visible: boolean;
  card: Card | null | undefined;
  secondsToShow: number;
  onClose: () => void;
  message?: string;
}

const CardModal: React.FC<CardModalProps> = ({
  visible,
  card,
  secondsToShow,
  onClose,
  message = 'New card drawn!'
}) => {
  const [timeLeft, setTimeLeft] = useState(secondsToShow);

  useEffect(() => {
    if (visible) {
      setTimeLeft(secondsToShow);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [visible, secondsToShow, onClose]);

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.cardContainer}>
            <CardComponent card={card} size="large" />
          </View>
          
          <Text style={styles.timer}>
            Closing in {timeLeft} {timeLeft === 1 ? 'second' : 'seconds'}...
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close Now</Text>
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
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timer: {
    marginTop: 10,
    color: '#666',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#15aabf',
    borderRadius: 16,
    padding: 8,
    paddingHorizontal: 16,
    elevation: 2,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default CardModal; 