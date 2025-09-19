import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import Row from './components/Row/Row';
import MovieModal from './components/MovieModal/MovieModal';
import requests from './utils/requests';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  return (
    <div className="app">
      <Header />
      <Banner onMovieClick={handleMovieClick} />
      
      <div className="app__rows">
        <Row 
          title="Netflix Originals" 
          fetchUrl={requests.fetchNetflixOriginals}
          isLargeRow
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Trending Now" 
          fetchUrl={requests.fetchTrending}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Top Rated Movies" 
          fetchUrl={requests.fetchTopRated}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Action Movies" 
          fetchUrl={requests.fetchActionMovies}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Comedy Movies" 
          fetchUrl={requests.fetchComedyMovies}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Horror Movies" 
          fetchUrl={requests.fetchHorrorMovies}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Romance Movies" 
          fetchUrl={requests.fetchRomanceMovies}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Thriller Movies" 
          fetchUrl={requests.fetchThrillerMovies}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Animation Movies" 
          fetchUrl={requests.fetchAnimationMovies}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Documentaries" 
          fetchUrl={requests.fetchDocumentaries}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Popular TV Shows" 
          fetchUrl={requests.fetchPopularTVShows}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Comedy TV Shows" 
          fetchUrl={requests.fetchComedyTVShows}
          onMovieClick={handleMovieClick}
        />
        <Row 
          title="Drama TV Shows" 
          fetchUrl={requests.fetchDramaTVShows}
          onMovieClick={handleMovieClick}
        />
      </div>

      {showModal && selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;