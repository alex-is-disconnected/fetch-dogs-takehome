import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMatch, fetchDogDetails, fetchLocations } from "../api/fetchApi";
import { Dog, Location } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Match.css";

function Match() {
  const { favorites, clearFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function loadFavoriteDogs() {
      if (favorites.length === 0) {
        setFavoriteDogs([]);
        return;
      }
      
      try {
        const dogs = await fetchDogDetails(favorites);
        setFavoriteDogs(dogs);
      } catch (error) {
        console.error("Error loading favorite dogs:", error);
        setError("Failed to load favorite dogs. Please try again.");
      }
    }
    
    if (isAuthenticated) {
      loadFavoriteDogs();
    }
  }, [favorites, isAuthenticated]);

  async function handleMatch() {
    if (favorites.length === 0) {
      setError("Please select some favorite dogs first.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const matchResponse = await fetchMatch(favorites);
      
      if (!matchResponse || !matchResponse.match) {
        throw new Error("No match returned from the server");
      }
      
      const matchedDogDetails = await fetchDogDetails([matchResponse.match]);
      
      if (!matchedDogDetails || matchedDogDetails.length === 0) {
        throw new Error("Could not retrieve matched dog details");
      }
      
      setMatchedDog(matchedDogDetails[0]);
      
      if (matchedDogDetails[0] && matchedDogDetails[0].zip_code) {
        try {
          const locations = await fetchLocations([matchedDogDetails[0].zip_code]);
          if (locations && locations.length > 0) {
            setLocation(locations[0]);
          }
        } catch (locationError) {
          console.error("Error fetching location:", locationError);
        }
      }
    } catch (error) {
      console.error("Error fetching match:", error);
      setError("Failed to find a match. Please try again.");
      setMatchedDog(null);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }

  function handleStartOver() {
    clearFavorites();
    setMatchedDog(null);
    setLocation(null);
    setError(null);
    navigate("/search");
  }

  function goBackToSearch() {
    navigate("/search");
  }

  return (
    <div className="match-page">
      <main className="match-content">
        <div className="favorites-section">
          <h2>Your Favorites ({favorites.length})</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {favorites.length === 0 ? (
            <div className="no-favorites">
              <p>You haven't selected any favorites yet.</p>
              <button onClick={goBackToSearch} className="search-btn">
                Go to Search
              </button>
            </div>
          ) : (
            <>
              <div className="favorites-grid">
                {favoriteDogs.map(dog => (
                  <div key={dog.id} className="favorite-dog">
                    <img src={dog.img} alt={dog.name} />
                    <p>{dog.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="match-actions">
                <button 
                  onClick={handleMatch} 
                  disabled={loading || favorites.length === 0}
                  className="match-btn"
                >
                  {loading ? "Finding Match..." : "Find My Match"}
                </button>
                
                <button onClick={handleStartOver} className="start-over-btn">
                  Start Over
                </button>
              </div>
            </>
          )}
        </div>
        
        {matchedDog && (
          <div className="match-result">
            <h2>Congratulations! You've been matched with:</h2>
            <div className="matched-dog">
              <div className="matched-dog-image">
                <img src={matchedDog.img} alt={matchedDog.name} />
              </div>
              <div className="matched-dog-info">
                <h3>{matchedDog.name}</h3>
                <p className="breed">{matchedDog.breed}</p>
                <p className="age">Age: {matchedDog.age}</p>
                {location && (
                  <p className="location">
                    Location: {location.city}, {location.state} ({matchedDog.zip_code})
                  </p>
                )}
                <div className="adoption-info">
                  <p>Contact your local shelter to start the adoption process!</p>
                  <button className="adopt-btn">Start Adoption</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Match;
