import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import localHymnsData from '../../data/hymns.json';

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
  const router = useRouter();
  const navigation = useNavigation();
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHymns = async () => {
      try {
        const response = await fetch('https://music.agiza.fi/hymns.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Hymn[] = await response.json();
        const foundHymn = data.find((h) => h.id === id);
        setHymn(foundHymn || null);
      } catch (error) {
        console.warn('Failed to fetch remote hymns, using local data.');
        const foundHymn = localHymnsData.find((h) => h.id === id);
        setHymn(foundHymn || null);
      } finally {
        setLoading(false);
      }
    };

    fetchHymns();
  }, [id]);

  // Function to handle going back
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!hymn) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Hymn not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{hymn.title}</Text>
        {hymn.lyrics.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {section.type === 'stanza' ? `Stanza ${index + 1}` : 'Chorus'}
            </Text>
            {section.text.map((line, lineIndex) => (
              <Text key={lineIndex} style={styles.verse}>
                {line}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007bff',
  },
  backButton: {
    padding: 8,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
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
