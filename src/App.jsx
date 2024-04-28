import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import HomeFeed from "./routes/homeFeed";
import NavBar from "./routes/navBar";
import PostDetails from "./routes/postDetails";
import CreatePost from "./routes/createPost";
import NameData from "./data/generatedNames.json";
import EditPost from "./routes/editPost";

function App() {


  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userID, setUserID] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [theme]);


  useEffect(() => {
    let id = localStorage.getItem('userID');
    if (!id) {
      const adjectives = NameData.adjectives;
      const nouns = NameData.nouns;
      id = adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)] + Math.floor(Math.random() * 100);
      localStorage.setItem('userID', id);
    }
    setUserID(id);
    window.resetUserID = resetUserID;
  }, []);


  const resetUserID = () => {
    const adjectives = NameData.adjectives;
    const nouns = NameData.nouns;
    const newID = adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)] + Math.floor(Math.random() * 100);
    localStorage.setItem('userID', newID);
    setUserID(newID);
  };

  console.log(userID)

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <NavBar setSearchQuery={setSearchQuery} userID={userID} toggleTheme={toggleTheme} theme={theme} />
        <div className="main-container">
          <Routes>
            <Route path="/" element={<HomeFeed searchQuery={searchQuery} />} />
            <Route path="/details/:postID" element={<PostDetails userID={userID} />} />
            <Route path="/create" element={<CreatePost userID={userID} />} />
            <Route path="/edit/:postID" element={<EditPost />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
