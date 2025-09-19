import { movieAPI } from '../services/api';

// OMDB API request functions
const requests = {
  // Movie categories
  fetchTrending: async () => {
    return await movieAPI.getPopularMovies();
  },

  fetchNetflixOriginals: async () => {
    return await movieAPI.getPopularSeries();
  },

  fetchTopRated: async () => {
    const topRatedTitles = [
      'The Shawshank Redemption', 'The Godfather', 'The Dark Knight',
      'Pulp Fiction', 'The Lord of the Rings', 'Schindler\'s List',
      'Inception', 'Fight Club', 'Goodfellas', 'The Matrix'
    ];
    
    try {
      const moviePromises = topRatedTitles.map(title => 
        movieAPI.getMovieByTitle(title).catch(() => null)
      );
      
      const movies = await Promise.all(moviePromises);
      return movies.filter(movie => movie !== null);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  fetchActionMovies: async () => {
    return await movieAPI.getMoviesByGenre('action');
  },

  fetchComedyMovies: async () => {
    return await movieAPI.getMoviesByGenre('comedy');
  },

  fetchHorrorMovies: async () => {
    return await movieAPI.getMoviesByGenre('horror');
  },

  fetchRomanceMovies: async () => {
    return await movieAPI.getMoviesByGenre('romance');
  },

  fetchDocumentaries: async () => {
    const documentaryTitles = [
      'Free Solo', 'Won\'t You Be My Neighbor', 'March of the Penguins',
      'An Inconvenient Truth', 'Bowling for Columbine', 'Fahrenheit 9/11',
      'Super Size Me', 'The Social Dilemma', 'Blackfish', 'Food, Inc.'
    ];
    
    try {
      const moviePromises = documentaryTitles.map(title => 
        movieAPI.getMovieByTitle(title).catch(() => null)
      );
      
      const movies = await Promise.all(moviePromises);
      return movies.filter(movie => movie !== null);
    } catch (error) {
      console.error('Error fetching documentaries:', error);
      return [];
    }
  },

  fetchThrillerMovies: async () => {
    return await movieAPI.getMoviesByGenre('thriller');
  },

  fetchAnimationMovies: async () => {
    return await movieAPI.getMoviesByGenre('animation');
  },

  // TV Show categories
  fetchPopularTVShows: async () => {
    return await movieAPI.getPopularSeries();
  },

  fetchActionTVShows: async () => {
    const actionSeries = [
      'Breaking Bad', 'Better Call Saul', 'The Walking Dead', 
      '24', 'Prison Break', 'Narcos', 'The Punisher',
      'Daredevil', 'Arrow', 'The Flash'
    ];
    
    try {
      const seriesPromises = actionSeries.map(title => 
        movieAPI.getMovieByTitle(title).catch(() => null)
      );
      
      const series = await Promise.all(seriesPromises);
      return series.filter(show => show !== null);
    } catch (error) {
      console.error('Error fetching action TV shows:', error);
      return [];
    }
  },

  fetchComedyTVShows: async () => {
    const comedySeries = [
      'The Office', 'Friends', 'How I Met Your Mother',
      'Brooklyn Nine-Nine', 'Parks and Recreation', 'Scrubs',
      'The Big Bang Theory', 'Seinfeld', 'Arrested Development', 'Community'
    ];
    
    try {
      const seriesPromises = comedySeries.map(title => 
        movieAPI.getMovieByTitle(title).catch(() => null)
      );
      
      const series = await Promise.all(seriesPromises);
      return series.filter(show => show !== null);
    } catch (error) {
      console.error('Error fetching comedy TV shows:', error);
      return [];
    }
  },

  fetchDramaTVShows: async () => {
    const dramaSeries = [
      'Game of Thrones', 'The Crown', 'This Is Us',
      'Lost', 'Mad Men', 'The Sopranos', 'House of Cards',
      'Stranger Things', 'Dark', 'Westworld'
    ];
    
    try {
      const seriesPromises = dramaSeries.map(title => 
        movieAPI.getMovieByTitle(title).catch(() => null)
      );
      
      const series = await Promise.all(seriesPromises);
      return series.filter(show => show !== null);
    } catch (error) {
      console.error('Error fetching drama TV shows:', error);
      return [];
    }
  },

  // Search functionality
  searchMovies: async (query) => {
    try {
      const response = await movieAPI.searchMovies(query);
      return response.Search || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  searchSeries: async (query) => {
    try {
      const response = await movieAPI.searchSeries(query);
      return response.Search || [];
    } catch (error) {
      console.error('Error searching series:', error);
      return [];
    }
  },

  // Get detailed information
  getMovieDetails: (id) => movieAPI.getMovieDetails(id),
  getMovieByTitle: (title, year) => movieAPI.getMovieByTitle(title, year),
};

export default requests;