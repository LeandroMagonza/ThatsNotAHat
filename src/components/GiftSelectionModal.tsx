import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Player } from '../types/game';
import { gifts, getGiftImageSource } from '../data/generatedGifts';

interface GiftSelectionModalProps {
  visible: boolean;
  giftingPlayer: Player | undefined;
  receivingPlayer: Player | undefined;
  onSelect: (giftName: string) => void;
  onCancel: () => void;
}

const GiftSelectionModal: React.FC<GiftSelectionModalProps> = ({
  visible,
  giftingPlayer,
  receivingPlayer,
  onSelect,
  onCancel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGifts, setFilteredGifts] = useState(gifts);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = gifts.filter(gift =>
      gift.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGifts(filtered);
  };

  const handleSelectGift = (giftName: string) => {
    onSelect(giftName);
    setSearchQuery('');
    setFilteredGifts(gifts);
  };

  if (!visible || !giftingPlayer || !receivingPlayer) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Gift Selection</Text>
          
          <Text style={styles.message}>
            {giftingPlayer.name}, you are giving a gift to {receivingPlayer.name}
          </Text>
          
          <Text style={styles.instruction}>
            What gift are you giving?
          </Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a gift..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          
          <FlatList
            data={filteredGifts}
            keyExtractor={(item) => item}
            style={styles.list}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.giftItem}
                onPress={() => handleSelectGift(item)}
              >
                <Image 
                  source={getGiftImageSource(item)}
                  style={styles.giftImage}
                  resizeMode="contain"
                />
                <Text style={styles.giftText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    width: '90%',
    maxHeight: '90%',
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
    marginBottom: 8,
    color: '#444',
  },
  instruction: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  list: {
    width: '100%',
    maxHeight: 400,
  },
  giftItem: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
  },
  giftImage: {
    width: 60,
    height: 60,
    marginBottom: 4,
  },
  giftText: {
    fontSize: 12,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 16,
    padding: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default GiftSelectionModal; 