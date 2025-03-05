import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, Player } from '../types/game';

interface AcceptRejectModalProps {
  visible: boolean;
  giftingPlayer: Player | undefined;
  receivingPlayer: Player | undefined;
  selectedGiftName: string | undefined;
  onAccept: () => void;
  onReject: () => void;
}

const AcceptRejectModal: React.FC<AcceptRejectModalProps> = ({
  visible,
  giftingPlayer,
  receivingPlayer,
  selectedGiftName,
  onAccept,
  onReject,
}) => {
  if (!visible || !giftingPlayer || !receivingPlayer || !selectedGiftName) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Gift Offered</Text>
          
          <Text style={styles.message}>
            {receivingPlayer.name}, {giftingPlayer.name} is giving you a gift
          </Text>
          
          <View style={styles.giftInfo}>
            <Text style={styles.giftText}>
              {giftingPlayer.name} says: "I have a nice <Text style={styles.giftName}>{selectedGiftName}</Text> for you."
            </Text>
          </View>
          
          <Text style={styles.question}>
            Do you believe that's what the gift really is?
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]} 
              onPress={onAccept}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.rejectButton]} 
              onPress={onReject}
            >
              <Text style={styles.buttonText}>
                That's not a {selectedGiftName}!
              </Text>
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
    marginBottom: 8,
    color: '#333',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#444',
  },
  giftInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  giftText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  giftName: {
    fontWeight: 'bold',
    color: '#1098ad',
  },
  question: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    elevation: 2,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#38d9a9',
  },
  rejectButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AcceptRejectModal; 