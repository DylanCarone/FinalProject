import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const NavBar = ({ setSearchQuery, userID, toggleTheme, theme }) => {




  const location = useLocation();
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setSearchQuery(event.target.value);
  };

  return (
    <nav className="nav-bar">
      <div>
        <a href="/">
          <h2>RETROHUB</h2>
        </a>
      </div>
      {userID && (<h3>Currently logged in as {userID}</h3>)}
      <div className="nav-buttons">

        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
        <a href="/">Home</a>
        <a href="/create">Create New Post</a>
      </div>
    </nav>
  );
};

export default NavBar;
