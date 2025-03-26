import { useEffect, useState } from "react";
import { fetchDogDetails, fetchLocations } from "../api/fetchApi";
import { Dog, Location } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/DogCard.css";

interface DogCardProps {
  id: string;
  showLocation?: boolean;
}

function DogCard({ id, showLocation = false }: DogCardProps) {
  const [dog, setDog] = useState<Dog | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    async function loadDog() {
      setLoading(true);
      try {
        const data = await fetchDogDetails([id]);
        setDog(data[0]);
        
        if (showLocation && data[0]) {
          const locations = await fetchLocations([data[0].zip_code]);
          if (locations.length > 0) {
            setLocation(locations[0]);
          }
        }
      } catch (error) {
        console.error("Error loading dog details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDog();
  }, [id, showLocation]);

  function toggleFavorite() {
    if (!dog) return;
    
    if (isFavorite(dog.id)) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog.id);
    }
  }

  if (loading) {
    return (
      <div className="dog-card skeleton">
        <div className="dog-card-image"></div>
        <div className="dog-card-info">
          <h3></h3>
          <p className="breed"></p>
          <p className="age"></p>
          {showLocation && <p className="location"></p>}
        </div>
      </div>
    );
  }

  if (!dog) {
    return <div className="dog-card loading">Could not load dog details</div>;
  }

  return (
    <div className="dog-card">
      <div className="dog-card-image">
        <img src={dog.img} alt={dog.name} />
        <button 
          className={`favorite-btn ${isFavorite(dog.id) ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite(dog.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite(dog.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="dog-card-info">
        <h3>{dog.name}</h3>
        <p className="breed">{dog.breed}</p>
        <p className="age">{dog.age} years old</p>
        {showLocation && location && (
          <p className="location">
            {location.city}, {location.state}
          </p>
        )}
      </div>
    </div>
  );
}

export default DogCard;
