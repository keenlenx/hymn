import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import hymnsData from '../../data/hymns.json';

interface Hymn {
  id: string;
  title: string;
  lyrics: {
    type: 'stanza' | 'chorus';
    text: string[];
  }[];
}

export default function HymnDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hymn = (hymnsData as Hymn[]).find(h => h.id === id);

  if (!hymn) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Hymn not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{hymn.title}</Text>
      {hymn.lyrics.map((section, index) => (
        <View key={index} style={styles.sectionContainer}>
          {section.type === 'stanza' ? (
            <>
              <Text style={styles.sectionTitle}>Stanza {index + 1}</Text>
              {section.text.map((verse, verseIndex) => (
                <Text key={verseIndex} style={styles.verse}>
                  {verse}
                </Text>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Chorus</Text>
              {section.text.map((chorusLine, chorusIndex) => (
                <Text key={chorusIndex} style={styles.verse}>
                  {chorusLine}
                </Text>
              ))}
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  verse: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'gray',
  },
});
