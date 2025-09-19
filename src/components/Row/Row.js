import React, { useState, useEffect } from 'react';
import './Row.css';

function Row({ title, fetchUrl, isLargeRow, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // fetchUrl is now a function that returns data directly
        const moviesData = await fetchUrl();
        
        if (moviesData && Array.isArray(moviesData)) {
          // Transform OMDB data to match our component structure
          const transformedMovies = moviesData.map(movie => ({
            id: movie.imdbID || Math.random().toString(),
            imdbID: movie.imdbID,
            title: movie.Title,
            name: movie.Title,
            overview: movie.Plot || 'No description available.',
            backdrop_path: movie.Poster !== 'N/A' ? movie.Poster : null,
            poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
            vote_average: movie.imdbRating ? parseFloat(movie.imdbRating) : 0,
            release_date: movie.Released,
            Year: movie.Year,
            Genre: movie.Genre,
            Director: movie.Director,
            Actors: movie.Actors,
            Runtime: movie.Runtime,
            Type: movie.Type
          }));
          
          setMovies(transformedMovies);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    if (fetchUrl) {
      fetchData();
    }
  }, [fetchUrl]);

  const scrollLeft = () => {
    const row = document.getElementById(`row-${title}`);
    if (row) {
      row.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const row = document.getElementById(`row-${title}`);
    if (row) {
      row.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="row">
        <h2 className="row__title">{title}</h2>
        <div className="row__posters">
          {[...Array(10)].map((_, index) => (
            <div key={index} className={`row__poster ${isLargeRow && 'row__posterLarge'} loading`}>
              {/* Loading placeholder */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <h2 className="row__title">{title}</h2>
        <div className="row__error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="row">
        <h2 className="row__title">{title}</h2>
        <div className="row__error">
          <p>No movies found in this category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <h2 className="row__title">{title}</h2>
      
      <div className="row__container">
        <div className="row__scrollButton row__scrollButton--left" onClick={scrollLeft}>
          <svg className="row__scrollIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </div>

        <div className="row__posters" id={`row-${title}`}>
          {movies.map((movie) => {
            // Use poster for large rows (Netflix Originals), backdrop for others
            const imageSrc = isLargeRow 
              ? movie.poster_path 
              : movie.backdrop_path || movie.poster_path;
            
            return (
              <div
                key={movie.id || movie.imdbID}
                className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                onClick={() => onMovieClick(movie)}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={movie.name || movie.title || movie.Title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback when no image */}
                <div 
                  className="row__poster--fallback"
                  style={{ display: imageSrc ? 'none' : 'flex' }}
                >
                  <div className="row__poster--fallback-content">
                    <h4>{movie.title || movie.Title}</h4>
                    <p>{movie.Year}</p>
                    {movie.vote_average > 0 && (
                      <span className="row__poster--rating">⭐ {movie.vote_average}</span>
                    )}
                  </div>
                </div>

                {/* Movie info overlay */}
                <div className="row__poster--overlay">
                  <div className="row__poster--info">
                    <h4>{movie.title || movie.Title}</h4>
                    <p>{movie.Year} • {movie.Type}</p>
                    {movie.vote_average > 0 && (
                      <span className="row__poster--rating">⭐ {movie.vote_average}/10</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="row__scrollButton row__scrollButton--right" onClick={scrollRight}>
          <svg className="row__scrollIcon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Row;