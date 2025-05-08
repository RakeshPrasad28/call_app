import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import React, { FC } from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from './common/Icon';


type SearchProps = {
  onToggleMenu: () => void;
};

const Search: FC<SearchProps> = ({ onToggleMenu }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.iconContainer} onPress={onToggleMenu}>
        <Icon
          name="menu"
          iconFamily="Ionicons"
          color="#000"
          size={RFValue(22)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  iconContainer: {
    // marginLeft: 10,
    padding: 6,
    borderRadius: 8,
  },
});
