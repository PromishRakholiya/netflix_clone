import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Create axios instance for OMDB API
const omdbInstance = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: OMDB_API_KEY,
  },
});

// Add request interceptor for debugging
omdbInstance.interceptors.request.use(
  (config) => {
    console.log('Making OMDB request:', config.url, config.params);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
omdbInstance.interceptors.response.use(
  (response) => {
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'API request failed');
    }
    return response;
  },
  (error) => {
    console.error('OMDB API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const movieAPI = {
  // Search movies by title
  searchMovies: async (query, page = 1) => {
    try {
      const response = await omdbInstance.get('', {
        params: {
          s: query,
          page: page,
          type: 'movie'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search TV series
  searchSeries: async (query, page = 1) => {
    try {
      const response = await omdbInstance.get('', {
        params: {
          s: query,
          page: page,
          type: 'series'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get movie/series details by ID
  getMovieDetails: async (id) => {
    try {
      const response = await omdbInstance.get('', {
        params: {
          i: id,
          plot: 'full'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get movie/series details by title
  getMovieByTitle: async (title, year = null) => {
    try {
      const params = {
        t: title,
        plot: 'full'
      };
      if (year) params.y = year;
      
      const response = await omdbInstance.get('', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get popular movies (simulated with predefined searches)
  getPopularMovies: async () => {
    try {
      const popularTitles = [
        'The Dark Knight', 'Inception', 'Interstellar', 'The Matrix', 
        'Pulp Fiction', 'The Shawshank Redemption', 'Fight Club', 'Goodfellas',
        'The Godfather', 'Forrest Gump', 'The Lord of the Rings', 'Star Wars'
      ];
      
      const moviePromises = popularTitles.map(title => 
        this.getMovieByTitle(title).catch(() => null)
      );
      
      const movies = await Promise.all(moviePromises);
      return movies.filter(movie => movie !== null);
    } catch (error) {
      throw error;
    }
  },

  // Get popular TV series
  getPopularSeries: async () => {
    try {
      const popularSeries = [
        'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Office',
        'Friends', 'The Crown', 'Narcos', 'Black Mirror',
        'Sherlock', 'The Witcher', 'Money Heist', 'Dark'
      ];
      
      const seriesPromises = popularSeries.map(title => 
        this.getMovieByTitle(title).catch(() => null)
      );
      
      const series = await Promise.all(seriesPromises);
      return series.filter(show => show !== null);
    } catch (error) {
      throw error;
    }
  },

  // Get movies by genre (simulated with genre-specific searches)
  getMoviesByGenre: async (genre) => {
    try {
      const genreQueries = {
        action: ['Mission Impossible', 'John Wick', 'Mad Max', 'Die Hard', 'Terminator'],
        comedy: ['The Hangover', 'Superbad', 'Anchorman', 'Step Brothers', 'Dumb and Dumber'],
        drama: ['The Pursuit of Happyness', 'A Beautiful Mind', 'Good Will Hunting', 'Rain Man', 'Philadelphia'],
        horror: ['The Conjuring', 'Insidious', 'Saw', 'Scream', 'Halloween'],
        romance: ['The Notebook', 'Titanic', 'Ghost', 'Dirty Dancing', 'Casablanca'],
        thriller: ['Gone Girl', 'Se7en', 'Zodiac', 'The Silence of the Lambs', 'Shutter Island'],
        animation: ['Toy Story', 'Finding Nemo', 'Shrek', 'The Lion King', 'Frozen']
      };

      const queries = genreQueries[genre.toLowerCase()] || genreQueries.action;
      
      const moviePromises = queries.map(title => 
        this.getMovieByTitle(title).catch(() => null)
      );
      
      const movies = await Promise.all(moviePromises);
      return movies.filter(movie => movie !== null);
    } catch (error) {
      throw error;
    }
  }
};

export default omdbInstance;