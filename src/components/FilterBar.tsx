import { useState, useEffect, FormEvent } from "react";
import { fetchBreeds, searchLocations } from "../api/fetchApi";
import { SearchFilters } from "../types";
import "../styles/FilterBar.css";

interface FilterBarProps {
  onFilterChange: (filters: SearchFilters) => void;
}

function FilterBar({ onFilterChange }: FilterBarProps) {
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 20]); // Default range 0-20 years
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState<string>("");
  const [stateSearch, setStateSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadBreeds() {
      try {
        const breedList = await fetchBreeds();
        setAllBreeds(breedList);
        setFilteredBreeds(breedList);
      } catch (error) {
        console.error("Error loading breeds:", error);
      }
    }
    loadBreeds();
  }, []);

  function handleBreedChange(breed: string) {
    setSelectedBreeds(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed) 
        : [...prev, breed]
    );
  }

  async function handleLocationSearch(e: FormEvent) {
    e.preventDefault();
    if (!citySearch && !stateSearch) return;

    setLoading(true);
    try {
      const params = {
        city: citySearch || undefined,
        states: stateSearch ? [stateSearch.toUpperCase()] : undefined,
        size: 25
      };
      
      const response = await searchLocations(params);
      setZipCodes(response.results.map(loc => loc.zip_code));
    } catch (error) {
      console.error("Error searching locations:", error);
    }
    setLoading(false);
  }

  function applyFilters() {
    onFilterChange({
      breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
      zipCodes: zipCodes.length > 0 ? zipCodes : undefined,
      ageMin: ageRange[0],
      ageMax: ageRange[1]
    });
  }

  function clearFilters() {
    setSelectedBreeds([]);
    setAgeRange([0, 20]);
    setZipCodes([]);
    setCitySearch("");
    setStateSearch("");
    onFilterChange({});
  }

  return (
    <div className="filter-bar">
      <h3>Filter Dogs</h3>
      
      <div className="filter-section">
        <h4>Age Range</h4>
        <div className="age-inputs">
          <div className="range-container">
            <span>Minimum Age: {ageRange[0]} years</span>
            <input 
              type="range"
              min="0"
              max="20"
              value={ageRange[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= ageRange[1]) {
                  setAgeRange([value, ageRange[1]]);
                }
              }}
              className="range-input min-range"
            />
            <span>Maximum Age: {ageRange[1]} years</span>
            <input 
              type="range"
              min="0"
              max="20"
              value={ageRange[1]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= ageRange[0]) {
                  setAgeRange([ageRange[0], value]);
                }
              }}
              className="range-input max-range"
            />
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Location</h4>
        <form onSubmit={handleLocationSearch} className="location-search">
          <input 
            type="text" 
            placeholder="City" 
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="State (e.g. CA)" 
            maxLength={2}
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {zipCodes.length > 0 && (
          <div className="zip-codes">
            <p>{zipCodes.length} zip codes selected</p>
            <button onClick={() => setZipCodes([])}>Clear</button>
          </div>
        )}
      </div>
      
      <div className="filter-section breeds-section">
        <h4>Breeds</h4>
        <input 
          type="text" 
          placeholder="Search breeds..." 
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            setFilteredBreeds(
              searchTerm
                ? allBreeds.filter(breed => 
                    breed.toLowerCase().includes(searchTerm)
                  )
                : allBreeds
            );
          }}
        />
        <div className="breeds-list">
          {filteredBreeds.slice(0, 10).map(breed => (
            <article key={breed} className="breed-option">
              <input 
                type="checkbox"
                checked={selectedBreeds.includes(breed)}
                onChange={() => handleBreedChange(breed)}
              />
              <label>
                  {breed}
              </label>
            </article>
          ))}
          {filteredBreeds.length > 10 && <p>...and {filteredBreeds.length - 10} more</p>}
        </div>
      </div>
      
      <div className="filter-actions">
        <button onClick={applyFilters} className="apply-btn">Apply Filters</button>
        <button onClick={clearFilters} className="clear-btn">Clear All</button>
      </div>
    </div>
  );
}

export default FilterBar;
