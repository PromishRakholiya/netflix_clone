import React, { useState, useEffect } from 'react';
import movieTrailer from 'movie-trailer';
import YouTube from 'react-youtube';
import { movieAPI } from '../../services/api';
import './MovieModal.css';

function MovieModal({ movie, onClose }) {
  const [trailerUrl, setTrailerUrl] = useState('');
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        
        let detailedMovie = movie;
        
        // If we only have basic info, fetch detailed information
        if (movie.imdbID && !movie.Plot) {
          try {
            detailedMovie = await movieAPI.getMovieDetails(movie.imdbID);
            
            // Transform the data
            detailedMovie = {
              ...movie,
              overview: detailedMovie.Plot || movie.overview,
              Genre: detailedMovie.Genre,
              Director: detailedMovie.Director,
              Actors: detailedMovie.Actors,
              Runtime: detailedMovie.Runtime,
              imdbRating: detailedMovie.imdbRating,
              Rated: detailedMovie.Rated,
              Awards: detailedMovie.Awards,
              BoxOffice: detailedMovie.BoxOffice,
              Country: detailedMovie.Country,
              Language: detailedMovie.Language
            };
          } catch (error) {
            console.log('Could not fetch additional details, using existing data');
          }
        }
        
        setMovieDetails(detailedMovie);

        // Try to find trailer using movie-trailer package
        try {
          const searchQuery = `${detailedMovie.title || detailedMovie.Title} ${detailedMovie.Year || ''} trailer`;
          const url = await movieTrailer(searchQuery);
          
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get('v');
            if (videoId) {
              setTrailerUrl(videoId);
            }
          }
        } catch (error) {
          console.log('No trailer found for:', detailedMovie.title || detailedMovie.Title);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovieDetails(movie); // Fall back to original movie data
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();

    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePlayTrailer = () => {
    if (trailerUrl) {
      setShowTrailer(true);
    } else {
      // Fallback: open in new tab to search for trailer
      const searchQuery = encodeURIComponent(`${movieDetails?.title || movieDetails?.Title} ${movieDetails?.Year || ''} trailer`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: isMuted ? 1 : 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
    },
  };

  const formatGenres = (genres) => {
    if (!genres) return 'N/A';
    return genres.split(',').map(genre => genre.trim()).join(', ');
  };

  const getImageUrl = () => {
    return movieDetails?.backdrop_path || movieDetails?.poster_path || '/placeholder-image.jpg';
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <button className="modal__closeButton" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {/* Video Section */}
        <div className="modal__video">
          {loading ? (
            <div className="modal__videoLoading">
              <div className="loading-spinner"></div>
            </div>
          ) : showTrailer && trailerUrl ? (
            <YouTube 
              videoId={trailerUrl} 
              opts={opts} 
              className="modal__youtube"
            />
          ) : (
            <img
              className="modal__backdrop"
              src={getImageUrl()}
              alt={movieDetails?.title || movieDetails?.Title}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          )}
          
          {/* Video Overlay */}
          <div className="modal__videoOverlay">
            <div className="modal__videoContent">
              <h1 className="modal__title">
                {movieDetails?.title || movieDetails?.Title || movieDetails?.name}
              </h1>
              
              <div className="modal__buttons">
                <button 
                  className="modal__button modal__button--play"
                  onClick={handlePlayTrailer}
                >
                  <svg className="modal__buttonIcon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  {trailerUrl ? 'Play Trailer' : 'Search Trailer'}
                </button>
                
                <button className="modal__button modal__button--add">
                  <svg className="modal__buttonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                
                <button className="modal__button modal__button--like">
                  <svg className="modal__buttonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {showTrailer && trailerUrl && (
              <button 
                className="modal__muteButton"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="modal__details">
          {loading ? (
            <div className="modal__detailsLoading">
              <div className="loading-placeholder loading-placeholder--title"></div>
              <div className="loading-placeholder loading-placeholder--text"></div>
              <div className="loading-placeholder loading-placeholder--text"></div>
            </div>
          ) : (
            <div className="modal__detailsContent">
              <div className="modal__mainDetails">
                <div className="modal__metadata">
                  {movieDetails?.imdbRating && (
                    <span className="modal__rating">⭐ {movieDetails.imdbRating}/10</span>
                  )}
                  {movieDetails?.Year && (
                    <span className="modal__year">{movieDetails.Year}</span>
                  )}
                  {movieDetails?.Rated && (
                    <span className="modal__ageRating">{movieDetails.Rated}</span>
                  )}
                  {movieDetails?.Runtime && (
                    <span className="modal__runtime">{movieDetails.Runtime}</span>
                  )}
                  <span className="modal__hd">HD</span>
                </div>
                
                <p className="modal__overview">
                  {movieDetails?.overview || movieDetails?.Plot || 'No description available.'}
                </p>
              </div>
              
              <div className="modal__additionalInfo">
                {movieDetails?.Actors && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Cast:</span>
                    <span className="modal__infoValue">{movieDetails.Actors}</span>
                  </div>
                )}
                
                {movieDetails?.Director && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Director:</span>
                    <span className="modal__infoValue">{movieDetails.Director}</span>
                  </div>
                )}
                
                {movieDetails?.Genre && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Genres:</span>
                    <span className="modal__infoValue">{formatGenres(movieDetails.Genre)}</span>
                  </div>
                )}
                
                {movieDetails?.Country && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Country:</span>
                    <span className="modal__infoValue">{movieDetails.Country}</span>
                  </div>
                )}
                
                {movieDetails?.Language && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Language:</span>
                    <span className="modal__infoValue">{movieDetails.Language}</span>
                  </div>
                )}
                
                {movieDetails?.Awards && movieDetails.Awards !== 'N/A' && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Awards:</span>
                    <span className="modal__infoValue">{movieDetails.Awards}</span>
                  </div>
                )}
                
                {movieDetails?.BoxOffice && movieDetails.BoxOffice !== 'N/A' && (
                  <div className="modal__infoItem">
                    <span className="modal__infoLabel">Box Office:</span>
                    <span className="modal__infoValue">{movieDetails.BoxOffice}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;