import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import React, {FC, useState, useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from './common/Icon';
import CallLogDatabase from '../database/CallLogDatabase';
import { Colors } from '../utility/constants';

type SearchProps = {
  onToggleMenu: () => void;
  onSelectItem: (item: any) => void;
};

const Search: FC<SearchProps> = ({onToggleMenu, onSelectItem}) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = (text: string) => {
    setSearchText(text);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (text.length > 0) {
        try {
          const realm = await CallLogDatabase.initialize();
          const results = realm.objects('CallLog')
            .filtered('phoneNumber CONTAINS[c] $0 OR name CONTAINS[c] $0', text)
            .slice(0, 5); // Limit to 5 suggestions
          
          const uniqueResults = Array.from(results).reduce((acc: any[], current: any) => {
            const exists = acc.some(item => item.phoneNumber === current.phoneNumber);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, []);

          setSuggestions(uniqueResults);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    }, 300); 
  };

  const handleSelect = (item: any) => {
    setSearchText('');
    setShowSuggestions(false);
    onSelectItem(item);
  };

  const HighlightText = ({text = '', searchQuery = ''}: {text: string, searchQuery: string}) => {
    if (!searchQuery || !text) return <Text>{text}</Text>;

    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return <Text>{text}</Text>;

    return (
      <Text>
        {text.substring(0, index)}
        <Text style={{fontWeight: 'bold', color: Colors.nightInManchestor}}>
          {text.substring(index, index + searchQuery.length)}
        </Text>
        {text.substring(index + searchQuery.length)}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or number"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={handleSearch}
          onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={onToggleMenu}>
          <Icon name="menu" iconFamily="Ionicons" color="#000" size={RFValue(22)} />
        </TouchableOpacity>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => `${item.phoneNumber}_${item.timestamp}`}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <HighlightText 
                  text={item.name || item.phoneNumber} 
                  searchQuery={searchText} 
                />
                {item.name && (
                  <Text style={styles.suggestionSubText}>
                    {item.phoneNumber}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: 10,
    zIndex: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
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
    padding: 6,
    borderRadius: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 101,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  suggestionSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default Search;