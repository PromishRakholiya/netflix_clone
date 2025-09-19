import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [show, setShow] = useState(false);

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavBar);
    return () => window.removeEventListener('scroll', transitionNavBar);
  }, []);

  return (
    <div className={`nav ${show && 'nav__black'}`}>
      <div className="nav__contents">
        <div className="nav__left">
          <img
            className="nav__logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt="Netflix Logo"
          />
          
          <div className="nav__links">
            <span className="nav__link">Home</span>
            <span className="nav__link">TV Shows</span>
            <span className="nav__link">Movies</span>
            <span className="nav__link">New & Popular</span>
            <span className="nav__link">My List</span>
            <span className="nav__link">Browse by Languages</span>
          </div>
        </div>

        <div className="nav__right">
          <div className="nav__search">
            <svg className="nav__searchIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          
          <div className="nav__notifications">
            <svg className="nav__notificationIcon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </div>

          <div className="nav__profile">
            <img
              className="nav__avatar"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="User Avatar"
            />
            <div className="nav__dropdown">
              <svg className="nav__dropdownIcon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;