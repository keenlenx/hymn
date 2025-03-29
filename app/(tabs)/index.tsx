import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, View, TextInput, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import hymnData from '../data/hymns.json'; // Make sure hymnData is typed correctly
import { Hymn } from '../types'; // Import Hymn type
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HymnList(): React.JSX.Element {
  const router = useRouter();
  const [hymns, setHymns] = useState<Hymn[]>(hymnData); // Explicitly type hymnData as Hymn[]
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();

    // Filter hymns based on search query
    const filteredHymns: Hymn[] = hymnData.filter((hymn) => {
      const idMatch = hymn.id.includes(searchQuery); // Match hymn id
      const titleMatch = hymn.title.toLowerCase().includes(lowerQuery); // Match title
      const lyricsMatch = hymn.lyrics.some((line) =>
        line.text.some((lyric) => lyric.toLowerCase().includes(lowerQuery)) // Match lyrics (each line in text)
      );

      return idMatch || titleMatch || lyricsMatch; // If any of the conditions match
    });

    // Update the hymns state with the filtered hymns
    setHymns(filteredHymns);
  }, [searchQuery]);

  // Render each hymn item
  const renderItem = ({ item }: { item: Hymn }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(`../hymn/${item.id}`)}
    >
      <Text style={styles.itemSubtitle}>{item.id}</Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>SDA Hymnal</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hymns by number, title, or lyrics..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={hymns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hymns found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0056b3',
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});
