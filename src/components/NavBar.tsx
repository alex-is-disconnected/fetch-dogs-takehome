import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/NavBar.css";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function goToSearch() {
    navigate("/search");
    setIsMenuOpen(false);
  }

  function goToMatch() {
    navigate("/match");
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={goToSearch}>
        <h1>fetch!</h1>
      </div>
      
      <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? "✕" : "☰"}
      </button>
      
      <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        <button 
          className={`navbar-item ${window.location.pathname === '/search' ? 'active' : ''}`} 
          onClick={goToSearch}
        >
          Search Dogs
        </button>
        
        <button 
          className={`navbar-item ${window.location.pathname === '/match' ? 'active' : ''}`} 
          onClick={goToMatch}
          disabled={favorites.length === 0}
        >
          Match ({favorites.length})
        </button>
      </div>
      
      <div className="navbar-user">
        {user && <span className="user-name">Hello, {user.name}</span>}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar; 