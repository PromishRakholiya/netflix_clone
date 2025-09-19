import React, { useState, useEffect } from 'react';
import requests from '../../utils/requests';
import './Banner.css';

function Banner({ onMovieClick }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch Netflix Originals (popular series)
        const netflixOriginals = await requests.fetchNetflixOriginals();
        
        if (netflixOriginals && netflixOriginals.length > 0) {
          // Get a random movie from the results
          const randomMovie = netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)];
          
          // Transform OMDB data to match our component structure
          const transformedMovie = {
            id: randomMovie.imdbID,
            title: randomMovie.Title,
            name: randomMovie.Title,
            overview: randomMovie.Plot || 'No description available.',
            backdrop_path: randomMovie.Poster !== 'N/A' ? randomMovie.Poster : null,
            poster_path: randomMovie.Poster !== 'N/A' ? randomMovie.Poster : null,
            vote_average: randomMovie.imdbRating ? parseFloat(randomMovie.imdbRating) : 0,
            release_date: randomMovie.Released,
            Year: randomMovie.Year,
            Genre: randomMovie.Genre,
            Director: randomMovie.Director,
            Actors: randomMovie.Actors,
            Runtime: randomMovie.Runtime
          };
          
          setMovie(transformedMovie);
        } else {
          // Fallback: try to get trending movies
          const trendingMovies = await requests.fetchTrending();
          if (trendingMovies && trendingMovies.length > 0) {
            const randomMovie = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
            
            const transformedMovie = {
              id: randomMovie.imdbID,
              title: randomMovie.Title,
              name: randomMovie.Title,
              overview: randomMovie.Plot || 'No description available.',
              backdrop_path: randomMovie.Poster !== 'N/A' ? randomMovie.Poster : null,
              poster_path: randomMovie.Poster !== 'N/A' ? randomMovie.Poster : null,
              vote_average: randomMovie.imdbRating ? parseFloat(randomMovie.imdbRating) : 0,
              release_date: randomMovie.Released,
              Year: randomMovie.Year,
              Genre: randomMovie.Genre,
              Director: randomMovie.Director,
              Actors: randomMovie.Actors,
              Runtime: randomMovie.Runtime
            };
            
            setMovie(transformedMovie);
          }
        }
      } catch (error) {
        console.error('Error fetching banner movie:', error);
        
        // Ultimate fallback: use a predefined movie
        setMovie({
          id: 'tt0111161',
          title: 'The Shawshank Redemption',
          name: 'The Shawshank Redemption',
          overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          backdrop_path: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
          poster_path: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
          vote_average: 9.3,
          release_date: '1994-09-23',
          Year: '1994',
          Genre: 'Drama',
          Director: 'Frank Darabont',
          Actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
          Runtime: '142 min'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }

  const handlePlayClick = () => {
    if (movie && onMovieClick) {
      onMovieClick(movie);
    }
  };

  if (loading) {
    return (
      <header className="banner banner--loading">
        <div className="banner__contents">
          <div className="banner__title loading"></div>
          <div className="banner__description loading"></div>
        </div>
      </header>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <header 
      className="banner"
      style={{
        backgroundSize: 'cover',
        backgroundImage: movie?.backdrop_path 
          ? `url("${movie.backdrop_path}")` 
          : 'linear-gradient(to bottom, #111, #333)',
        backgroundPosition: 'center center',
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name}
        </h1>
        
        <div className="banner__metadata">
          {movie?.Year && <span className="banner__year">{movie.Year}</span>}
          }
          {movie?.Runtime && <span className="banner__runtime">{movie.Runtime}</span>}
          }
          {movie?.vote_average && (
            <span className="banner__rating">
              ⭐ {movie.vote_average}/10
            </span>
          )}
        </div>
        
        <div className="banner__buttons">
          <button 
            className="banner__button banner__button--play"
            onClick={handlePlayClick}
          >
            <svg className="banner__playIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
          
          <button 
            className="banner__button banner__button--info"
            onClick={handlePlayClick}
          >
            <svg className="banner__infoIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
            More Info
          </button>
        </div>

        <p className="banner__description">
          {truncate(
            movie?.overview || 'No description available for this title.',
            150
          )}
        </p>

        {(movie?.Genre || movie?.Director) && (
          <div className="banner__additionalInfo">
            {movie?.Genre && (
              <p className="banner__genre">
                <strong>Genres:</strong> {movie.Genre}
              </p>
            )}
            {movie?.Director && (
              <p className="banner__director">
                <strong>Director:</strong> {movie.Director}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="banner__fadeBottom" />
    </header>
  );
}

export default Banner;