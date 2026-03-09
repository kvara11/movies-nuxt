app.js;
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieCard from '../components/MovieCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = require('../data/genres.json');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const anim = require('../data/anim.json');
      const fav = require('../data/fav.json');
      const comedy = require('../data/comedy.json');
      const doc = require('../data/doc.json');
      const series = require('../data/series.json');
      const short = require('../data/short.json');

      // Add category field and unique ID to each movie
      const data = [...fav, ...doc, ...anim, ...comedy, ...short, ...series]
        .map((movie, index) => ({
          ...movie,
          id: movie.imdbId || `movie_${index}`,
          category: movie.genre || 'Unknown'
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      console.log('Movies fetched successfully:', data);
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return ['All', ...genres];
  }, [genres]);

  const filteredMovies = useMemo(() => {
    if (selectedCategory === 'All') {
      return movies;
    }
    return movies.filter(movie => movie.category.includes(selectedCategory));
  }, [movies, selectedCategory]);

  const getGridColumns = () => {
    if (width < 600) return 2;
    if (width < 900) return 3;
    if (width < 1200) return 4;
    return 5;
  };

  const getMovieItemWidth = () => {
    const columns = getGridColumns();
    const padding = 32;
    const gap = 30;
    return (width - padding - (gap * (columns - 1))) / columns;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category, index) => (

          <TouchableOpacity
            key={category + index}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      {/* Movies Grid */}
      <ScrollView style={styles.moviesContainer}>
        <View style={[styles.moviesGrid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {filteredMovies.map((movie) => (
            <TouchableOpacity key={movie.id || movie.title} style={[styles.movieItem, { width: getMovieItemWidth() }]}>
              <MovieCard movie={movie} />
            </TouchableOpacity>
          ))}
        </View>

        {/* No movies message */}
        {filteredMovies.length === 0 && (
          <View style={styles.noMoviesContainer}>
            <Text style={styles.noMoviesText}>No movies found in this category.</Text>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#111827',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },



  categoryContainer: {
    maxHeight: 30,
    marginVertical: 18,
  },
  categoryContent: {
    maxHeight: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#374151', // gray-700
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB', // blue-600
    transform: [{ scale: 1.05 }],
  },
  categoryButtonText: {
    color: '#D1D5DB', // gray-300
    fontWeight: '500',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },


  moviesContainer: {
    flex: 1,
    // flexGrow: 10,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  moviesGrid: {
    justifyContent: 'space-between',
  },
  movieItem: {
    marginBottom: 24,
    marginRight: 8,
  },

  noMoviesContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  noMoviesText: {
    color: '#9CA3AF', // gray-400
    fontSize: 18,
  },
});



moviecard
import { Image, StyleSheet, Text, View } from 'react-native';

export default function MovieCard({ movie }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: movie.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.year}>{movie.year}</Text>
          <Text style={styles.genre} numberOfLines={1}>
            {movie.genre.join(', ')}
          </Text>
        </View>
        <View>
          {movie.imdb && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {movie.imdb}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937', // gray-800
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flex: 1,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3, // Standard movie poster aspect ratio
    backgroundColor: '#374151', // gray-700
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  year: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    marginBottom: 4,
  },
  genre: {
    color: '#D1D5DB', // gray-300
    fontSize: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    color: '#FBBF24', // yellow-400
    fontSize: 16,
    fontWeight: '600',
  },
});


yearpicker

import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const YearPicker = ({ value, onValueChange, minimumYear = 1900, maximumYear = 2100 }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value);

  const years = [];
  for (let year = maximumYear; year >= minimumYear; year--) {
    years.push(year);
  }

  const handleValueChange = (itemValue) => {
    setSelectedYear(itemValue);
    onValueChange(itemValue);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>{selectedYear}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
            <Picker
              selectedValue={selectedYear}
              onValueChange={handleValueChange}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {years.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%',
  },
  closeButton: {
    alignItems: 'flex-end',
    padding: 12,
  },
  closeText: {
    fontSize: 16,
    color: '#007AFF',
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    fontSize: 16,
    height: 40,
  },
});

export default YearPicker;



